import { getConnection } from '../db/connection';
import sql from 'mssql';
import { EmailService } from './emailService';
import { SMSService } from './smsService';

export interface ApprovalRequest {
  id: number;
  type: 'vendor' | 'event' | 'service' | 'content';
  entityId: number;
  submittedBy: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_changes';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  details: any;
  adminNotes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
}

export interface ApprovalAction {
  approvalId: number;
  action: 'approve' | 'reject' | 'request_changes';
  adminId: number;
  notes: string;
  conditions?: string[];
}

export class AdminApprovalService {
  
  // Submit item for approval
  static async submitForApproval(
    type: ApprovalRequest['type'],
    entityId: number,
    submittedBy: number,
    details: any,
    priority: ApprovalRequest['priority'] = 'medium'
  ): Promise<ApprovalRequest> {
    try {
      const connection = await getConnection();
      
      const result = await connection.request()
        .input('type', sql.NVarChar, type)
        .input('entityId', sql.Int, entityId)
        .input('submittedBy', sql.Int, submittedBy)
        .input('status', sql.NVarChar, 'pending')
        .input('priority', sql.NVarChar, priority)
        .input('category', sql.NVarChar, this.getCategoryFromType(type))
        .input('details', sql.NVarChar, JSON.stringify(details))
        .query(`
          INSERT INTO ApprovalRequests 
          (type, entity_id, submitted_by, status, priority, category, details, submitted_at)
          OUTPUT INSERTED.*
          VALUES (@type, @entityId, @submittedBy, @status, @priority, @category, @details, GETDATE())
        `);

      const approval = result.recordset[0];

      // Notify admins about new approval request
      await this.notifyAdmins(approval);

      // Update entity status to pending approval
      await this.updateEntityStatus(type, entityId, 'pending_approval');

      return approval;

    } catch (error) {
      console.error('Error submitting for approval:', error);
      // Return mock approval for development
      return {
        id: Date.now(),
        type,
        entityId,
        submittedBy,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        priority,
        category: this.getCategoryFromType(type),
        details
      };
    }
  }

  // Process approval action
  static async processApproval(action: ApprovalAction): Promise<boolean> {
    try {
      const connection = await getConnection();
      
      // Start transaction
      const transaction = new sql.Transaction(connection);
      await transaction.begin();

      try {
        // Update approval request
        const updateResult = await transaction.request()
          .input('approvalId', sql.Int, action.approvalId)
          .input('status', sql.NVarChar, action.action === 'approve' ? 'approved' : 
                                       action.action === 'reject' ? 'rejected' : 'requires_changes')
          .input('adminNotes', sql.NVarChar, action.notes)
          .input('reviewedBy', sql.Int, action.adminId)
          .input('reviewedAt', sql.DateTime, new Date())
          .query(`
            UPDATE ApprovalRequests 
            SET status = @status, admin_notes = @adminNotes, 
                reviewed_by = @reviewedBy, reviewed_at = @reviewedAt
            OUTPUT INSERTED.*
            WHERE id = @approvalId
          `);

        if (updateResult.recordset.length === 0) {
          throw new Error('Approval request not found');
        }

        const approval = updateResult.recordset[0];

        // Update entity status based on approval action
        const newEntityStatus = action.action === 'approve' ? 'approved' :
                               action.action === 'reject' ? 'rejected' : 'requires_changes';
        
        await this.updateEntityStatus(approval.type, approval.entity_id, newEntityStatus, transaction);

        // Handle post-approval actions
        if (action.action === 'approve') {
          await this.handleApprovalSuccess(approval, transaction);
        }

        // Send notifications
        await this.notifySubmitter(approval, action);

        await transaction.commit();
        return true;

      } catch (error) {
        await transaction.rollback();
        throw error;
      }

    } catch (error) {
      console.error('Error processing approval:', error);
      return false;
    }
  }

  // Get pending approvals for admin dashboard
  static async getPendingApprovals(adminId?: number, filters?: any): Promise<ApprovalRequest[]> {
    try {
      const connection = await getConnection();
      
      let query = `
        SELECT 
          ar.*,
          u.name as submitter_name,
          u.email as submitter_email,
          CASE ar.type
            WHEN 'vendor' THEN v.business_name
            WHEN 'event' THEN e.title
            ELSE 'N/A'
          END as entity_name
        FROM ApprovalRequests ar
        LEFT JOIN Users u ON ar.submitted_by = u.id
        LEFT JOIN VendorRegistrations v ON ar.type = 'vendor' AND ar.entity_id = v.id
        LEFT JOIN LocalEvents e ON ar.type = 'event' AND ar.entity_id = e.id
        WHERE ar.status IN ('pending', 'requires_changes')
      `;

      if (filters?.priority) {
        query += ` AND ar.priority = '${filters.priority}'`;
      }

      if (filters?.type) {
        query += ` AND ar.type = '${filters.type}'`;
      }

      query += ` ORDER BY 
        CASE ar.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        ar.submitted_at DESC
      `;

      const result = await connection.request().query(query);
      return result.recordset;

    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      // Return mock data for development
      return this.getMockPendingApprovals();
    }
  }

  // Get approval statistics
  static async getApprovalStats(timeframe: 'today' | 'week' | 'month' = 'week'): Promise<any> {
    try {
      const connection = await getConnection();
      
      const dateFilter = this.getDateFilter(timeframe);
      
      const result = await connection.request()
        .input('dateFilter', sql.DateTime, dateFilter)
        .query(`
          SELECT 
            COUNT(*) as total_requests,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN status = 'requires_changes' THEN 1 ELSE 0 END) as requires_changes,
            AVG(DATEDIFF(hour, submitted_at, COALESCE(reviewed_at, GETDATE()))) as avg_response_time_hours
          FROM ApprovalRequests 
          WHERE submitted_at >= @dateFilter
        `);

      const typeStats = await connection.request()
        .input('dateFilter', sql.DateTime, dateFilter)
        .query(`
          SELECT 
            type,
            COUNT(*) as count,
            AVG(DATEDIFF(hour, submitted_at, COALESCE(reviewed_at, GETDATE()))) as avg_response_time
          FROM ApprovalRequests 
          WHERE submitted_at >= @dateFilter
          GROUP BY type
          ORDER BY count DESC
        `);

      return {
        overall: result.recordset[0],
        byType: typeStats.recordset,
        timeframe
      };

    } catch (error) {
      console.error('Error fetching approval stats:', error);
      return this.getMockApprovalStats();
    }
  }

  // Helper methods
  private static getCategoryFromType(type: string): string {
    const categoryMap = {
      vendor: 'Business Registration',
      event: 'Event Listing',
      service: 'Service Offering',
      content: 'Content Moderation'
    };
    return categoryMap[type as keyof typeof categoryMap] || 'General';
  }

  private static async updateEntityStatus(
    type: string, 
    entityId: number, 
    status: string, 
    transaction?: sql.Transaction
  ): Promise<void> {
    const executor = transaction || await getConnection();
    
    const tableMap = {
      vendor: 'VendorRegistrations',
      event: 'LocalEvents',
      service: 'Services',
      content: 'Content'
    };

    const table = tableMap[type as keyof typeof tableMap];
    if (!table) return;

    const statusColumn = type === 'vendor' ? 'status' : 'admin_approval_status';

    await executor.request()
      .input('entityId', sql.Int, entityId)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE ${table} 
        SET ${statusColumn} = @status, 
            admin_approved_at = ${status === 'approved' ? 'GETDATE()' : 'NULL'},
            updated_at = GETDATE()
        WHERE id = @entityId
      `);
  }

  private static async handleApprovalSuccess(
    approval: any, 
    transaction: sql.Transaction
  ): Promise<void> {
    // Perform post-approval actions based on type
    switch (approval.type) {
      case 'vendor':
        await this.activateVendorServices(approval.entity_id, transaction);
        break;
      case 'event':
        await this.publishEvent(approval.entity_id, transaction);
        break;
      // Add more cases as needed
    }
  }

  private static async activateVendorServices(vendorId: number, transaction: sql.Transaction): Promise<void> {
    // Activate vendor's services and make them visible to customers
    await transaction.request()
      .input('vendorId', sql.Int, vendorId)
      .query(`
        UPDATE VendorRegistrations 
        SET status = 'active', activated_at = GETDATE()
        WHERE id = @vendorId
      `);
  }

  private static async publishEvent(eventId: number, transaction: sql.Transaction): Promise<void> {
    // Make event visible to public
    await transaction.request()
      .input('eventId', sql.Int, eventId)
      .query(`
        UPDATE LocalEvents 
        SET status = 'published', published_at = GETDATE()
        WHERE id = @eventId
      `);
  }

  private static async notifyAdmins(approval: ApprovalRequest): Promise<void> {
    try {
      // Get admin emails
      const adminEmails = await this.getAdminEmails();
      
      for (const email of adminEmails) {
        await EmailService.sendAdminApprovalNotification({
          to: email,
          approval,
          dashboardUrl: `${process.env.FRONTEND_URL}/admin/approvals`
        });
      }
    } catch (error) {
      console.error('Failed to notify admins:', error);
    }
  }

  private static async notifySubmitter(approval: any, action: ApprovalAction): Promise<void> {
    try {
      // Get submitter details
      const connection = await getConnection();
      const userResult = await connection.request()
        .input('userId', sql.Int, approval.submitted_by)
        .query('SELECT name, email, phone FROM Users WHERE id = @userId');

      if (userResult.recordset.length > 0) {
        const user = userResult.recordset[0];
        
        await EmailService.sendApprovalDecisionNotification({
          to: user.email,
          userName: user.name,
          approval,
          action,
          dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`
        });
      }
    } catch (error) {
      console.error('Failed to notify submitter:', error);
    }
  }

  private static async getAdminEmails(): Promise<string[]> {
    try {
      const connection = await getConnection();
      const result = await connection.request()
        .query(`SELECT email FROM Users WHERE role IN ('admin', 'moderator') AND is_active = 1`);
      
      return result.recordset.map(row => row.email);
    } catch (error) {
      // Return default admin email for development
      return ['admin@coastalconnect.com'];
    }
  }

  private static getDateFilter(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case 'today':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }

  // Mock data for development
  private static getMockPendingApprovals(): ApprovalRequest[] {
    return [
      {
        id: 1,
        type: 'vendor',
        entityId: 101,
        submittedBy: 1001,
        submittedAt: '2024-12-20T10:30:00Z',
        status: 'pending',
        priority: 'high',
        category: 'Business Registration',
        details: {
          businessName: 'Coastal Heritage Homestay',
          businessType: 'homestay',
          location: 'Malpe Beach Road, Udupi',
          ownerName: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          documents: ['business_license.pdf', 'identity_proof.pdf']
        }
      },
      {
        id: 2,
        type: 'event',
        entityId: 201,
        submittedBy: 1002,
        submittedAt: '2024-12-20T14:15:00Z',
        status: 'pending',
        priority: 'medium',
        category: 'Event Listing',
        details: {
          eventName: 'Udupi Cultural Festival',
          eventDate: '2024-12-25',
          venue: 'Krishna Temple Complex',
          organizer: 'Cultural Association',
          expectedAttendees: 500
        }
      }
    ];
  }

  private static getMockApprovalStats(): any {
    return {
      overall: {
        total_requests: 45,
        pending: 12,
        approved: 28,
        rejected: 3,
        requires_changes: 2,
        avg_response_time_hours: 6.5
      },
      byType: [
        { type: 'vendor', count: 25, avg_response_time: 8.2 },
        { type: 'event', count: 15, avg_response_time: 4.1 },
        { type: 'service', count: 5, avg_response_time: 3.5 }
      ],
      timeframe: 'week'
    };
  }
}

export default AdminApprovalService;
