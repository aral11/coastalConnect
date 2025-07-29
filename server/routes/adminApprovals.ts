import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { AuthService } from "../services/auth";

// Get pending vendor applications
export const getPendingVendorApplications: RequestHandler = async (req, res) => {
  try {
    const { limit = 20, status = 'pending' } = req.query;
    
    const connection = await getConnection();
    
    const query = `
      SELECT TOP ${Math.min(Number(limit), 100)}
        va.*,
        u.name as applicant_name,
        u.email as applicant_email,
        u.phone as applicant_phone,
        u.created_at as user_created_at,
        reviewer.name as reviewer_name
      FROM VendorApplications va
      LEFT JOIN Users u ON va.user_id = u.id
      LEFT JOIN Users reviewer ON va.reviewed_by = reviewer.id
      WHERE va.status = @status
      ORDER BY va.submitted_at DESC
    `;
    
    const result = await connection.request()
      .input('status', status)
      .query(query);
    
    const applications = result.recordset.map(app => ({
      id: app.id,
      applicant: {
        id: app.user_id,
        name: app.applicant_name,
        email: app.applicant_email,
        phone: app.applicant_phone,
        memberSince: app.user_created_at
      },
      business: {
        name: app.business_name,
        type: app.business_type,
        description: app.business_description,
        address: app.business_address,
        city: app.city,
        state: app.state
      },
      documents: {
        businessLicense: app.business_license,
        gstNumber: app.gst_number,
        panNumber: app.pan_number,
        aadharNumber: app.aadhar_number,
        otherDocuments: app.documents ? JSON.parse(app.documents) : []
      },
      contact: {
        person: app.contact_person,
        phone: app.contact_phone,
        email: app.contact_email
      },
      status: app.status,
      submittedAt: app.submitted_at,
      reviewedAt: app.reviewed_at,
      reviewedBy: app.reviewer_name,
      adminNotes: app.admin_notes,
      rejectionReason: app.rejection_reason
    }));
    
    res.json({
      success: true,
      data: applications,
      totalCount: applications.length,
      message: 'Vendor applications retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error getting vendor applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vendor applications',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Approve vendor application
export const approveVendorApplication: RequestHandler = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { adminNotes } = req.body;
    
    // Get admin user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let adminUser;
    try {
      const decoded = AuthService.verifyToken(token);
      adminUser = await AuthService.findUserById(decoded.userId);
      if (!adminUser || adminUser.role !== 'admin') {
        throw new Error('Admin access required');
      }
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const connection = await getConnection();
    
    // Get the application details
    const appQuery = `
      SELECT va.*, u.email as user_email, u.name as user_name
      FROM VendorApplications va
      LEFT JOIN Users u ON va.user_id = u.id
      WHERE va.id = @applicationId
    `;
    
    const appResult = await connection.request()
      .input('applicationId', applicationId)
      .query(appQuery);
    
    if (appResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const application = appResult.recordset[0];
    
    // Start transaction
    const transaction = connection.transaction();
    await transaction.begin();
    
    try {
      // Update application status
      await transaction.request()
        .input('applicationId', applicationId)
        .input('reviewedBy', adminUser.id)
        .input('adminNotes', adminNotes || 'Application approved')
        .query(`
          UPDATE VendorApplications 
          SET status = 'approved',
              reviewed_at = GETDATE(),
              reviewed_by = @reviewedBy,
              admin_notes = @adminNotes
          WHERE id = @applicationId
        `);
      
      // Update user role and vendor status
      await transaction.request()
        .input('userId', application.user_id)
        .input('businessName', application.business_name)
        .input('businessType', application.business_type)
        .query(`
          UPDATE Users 
          SET role = 'vendor',
              vendor_status = 'approved',
              business_name = @businessName,
              business_type = @businessType
          WHERE id = @userId
        `);
      
      await transaction.commit();
      
      res.json({
        success: true,
        data: {
          applicationId: applicationId,
          status: 'approved',
          reviewedBy: adminUser.name,
          reviewedAt: new Date()
        },
        message: 'Vendor application approved successfully'
      });
      
      // TODO: Send approval email notification
      console.log(`Vendor application ${applicationId} approved by ${adminUser.name}`);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error approving vendor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve application',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Reject vendor application
export const rejectVendorApplication: RequestHandler = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { rejectionReason, adminNotes } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    // Get admin user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let adminUser;
    try {
      const decoded = AuthService.verifyToken(token);
      adminUser = await AuthService.findUserById(decoded.userId);
      if (!adminUser || adminUser.role !== 'admin') {
        throw new Error('Admin access required');
      }
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const connection = await getConnection();
    
    // Update application status
    await connection.request()
      .input('applicationId', applicationId)
      .input('reviewedBy', adminUser.id)
      .input('rejectionReason', rejectionReason)
      .input('adminNotes', adminNotes || '')
      .query(`
        UPDATE VendorApplications 
        SET status = 'rejected',
            reviewed_at = GETDATE(),
            reviewed_by = @reviewedBy,
            rejection_reason = @rejectionReason,
            admin_notes = @adminNotes
        WHERE id = @applicationId
      `);
    
    res.json({
      success: true,
      data: {
        applicationId: applicationId,
        status: 'rejected',
        reviewedBy: adminUser.name,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason
      },
      message: 'Vendor application rejected'
    });
    
    // TODO: Send rejection email notification
    console.log(`Vendor application ${applicationId} rejected by ${adminUser.name}: ${rejectionReason}`);
    
  } catch (error) {
    console.error('Error rejecting vendor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject application',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get pending events for approval
export const getPendingEvents: RequestHandler = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const connection = await getConnection();
    
    const query = `
      SELECT TOP ${Math.min(Number(limit), 100)}
        e.*,
        u.name as organizer_name,
        u.email as organizer_email,
        u.organization_name,
        approver.name as approver_name
      FROM Events e
      LEFT JOIN Users u ON e.organizer_id = u.id
      LEFT JOIN Users approver ON e.approved_by = approver.id
      WHERE e.status = 'pending_approval'
      ORDER BY e.created_at DESC
    `;
    
    const result = await connection.request().query(query);
    
    const events = result.recordset.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      shortDescription: event.short_description,
      category: event.category,
      eventDate: event.event_date,
      startTime: event.start_time,
      endTime: event.end_time,
      venue: {
        name: event.venue_name,
        address: event.venue_address,
        city: event.city,
        state: event.state
      },
      capacity: {
        max: event.max_capacity,
        current: event.current_registrations
      },
      pricing: {
        ticketPrice: event.ticket_price,
        currency: event.currency
      },
      organizer: {
        id: event.organizer_id,
        name: event.organizer_name,
        email: event.organizer_email,
        organization: event.organization_name
      },
      media: {
        featuredImage: event.featured_image,
        gallery: event.image_gallery ? JSON.parse(event.image_gallery) : []
      },
      status: event.status,
      createdAt: event.created_at,
      approvedAt: event.approved_at,
      approvedBy: event.approver_name
    }));
    
    res.json({
      success: true,
      data: events,
      totalCount: events.length,
      message: 'Pending events retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error getting pending events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Approve event
export const approveEvent: RequestHandler = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { adminNotes, isFeatured = false } = req.body;
    
    // Get admin user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let adminUser;
    try {
      const decoded = AuthService.verifyToken(token);
      adminUser = await AuthService.findUserById(decoded.userId);
      if (!adminUser || adminUser.role !== 'admin') {
        throw new Error('Admin access required');
      }
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const connection = await getConnection();
    
    // Update event status
    await connection.request()
      .input('eventId', eventId)
      .input('approvedBy', adminUser.id)
      .input('isFeatured', isFeatured)
      .query(`
        UPDATE Events 
        SET status = 'published',
            approved_at = GETDATE(),
            approved_by = @approvedBy,
            published_at = GETDATE(),
            is_featured = @isFeatured
        WHERE id = @eventId
      `);
    
    res.json({
      success: true,
      data: {
        eventId: eventId,
        status: 'published',
        approvedBy: adminUser.name,
        approvedAt: new Date(),
        isFeatured: isFeatured
      },
      message: 'Event approved and published successfully'
    });
    
    console.log(`Event ${eventId} approved by ${adminUser.name}`);
    
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Reject event
export const rejectEvent: RequestHandler = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    // Get admin user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let adminUser;
    try {
      const decoded = AuthService.verifyToken(token);
      adminUser = await AuthService.findUserById(decoded.userId);
      if (!adminUser || adminUser.role !== 'admin') {
        throw new Error('Admin access required');
      }
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const connection = await getConnection();
    
    // Update event status (using description field temporarily for rejection reason)
    await connection.request()
      .input('eventId', eventId)
      .input('approvedBy', adminUser.id)
      .input('rejectionReason', rejectionReason)
      .query(`
        UPDATE Events 
        SET status = 'rejected',
            approved_at = GETDATE(),
            approved_by = @approvedBy
        WHERE id = @eventId
      `);
    
    res.json({
      success: true,
      data: {
        eventId: eventId,
        status: 'rejected',
        approvedBy: adminUser.name,
        approvedAt: new Date(),
        rejectionReason: rejectionReason
      },
      message: 'Event rejected'
    });
    
    console.log(`Event ${eventId} rejected by ${adminUser.name}: ${rejectionReason}`);
    
  } catch (error) {
    console.error('Error rejecting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject event',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get approval statistics for admin dashboard
export const getApprovalStats: RequestHandler = async (req, res) => {
  try {
    const connection = await getConnection();
    
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM VendorApplications WHERE status = 'pending') as pending_vendors,
        (SELECT COUNT(*) FROM VendorApplications WHERE status = 'approved') as approved_vendors,
        (SELECT COUNT(*) FROM VendorApplications WHERE status = 'rejected') as rejected_vendors,
        (SELECT COUNT(*) FROM Events WHERE status = 'pending_approval') as pending_events,
        (SELECT COUNT(*) FROM Events WHERE status = 'published') as published_events,
        (SELECT COUNT(*) FROM Events WHERE status = 'rejected') as rejected_events,
        (SELECT COUNT(*) FROM Services WHERE status = 'pending') as pending_services,
        (SELECT COUNT(*) FROM Services WHERE status = 'approved') as approved_services
    `;
    
    const result = await connection.request().query(statsQuery);
    const stats = result.recordset[0];
    
    res.json({
      success: true,
      data: {
        vendors: {
          pending: stats.pending_vendors || 0,
          approved: stats.approved_vendors || 0,
          rejected: stats.rejected_vendors || 0,
          total: (stats.pending_vendors || 0) + (stats.approved_vendors || 0) + (stats.rejected_vendors || 0)
        },
        events: {
          pending: stats.pending_events || 0,
          published: stats.published_events || 0,
          rejected: stats.rejected_events || 0,
          total: (stats.pending_events || 0) + (stats.published_events || 0) + (stats.rejected_events || 0)
        },
        services: {
          pending: stats.pending_services || 0,
          approved: stats.approved_services || 0,
          total: (stats.pending_services || 0) + (stats.approved_services || 0)
        }
      },
      message: 'Approval statistics retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error getting approval stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get approval statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
