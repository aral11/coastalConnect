import { RequestHandler } from 'express';
import { EmailService } from '../services/emailService';

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  bookingId?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  created: string;
  lastUpdate: string;
}

// In-memory storage for demo purposes - replace with database
let tickets: SupportTicket[] = [
  {
    id: 'TK001',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 9876543210',
    category: 'booking',
    priority: 'medium',
    subject: 'Booking Cancellation Request',
    description: 'I need to cancel my homestay booking due to emergency',
    bookingId: 'BK001',
    status: 'in-progress',
    created: '2024-01-15T10:30:00Z',
    lastUpdate: '2024-01-16T14:20:00Z'
  },
  {
    id: 'TK002',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    category: 'payment',
    priority: 'high',
    subject: 'Payment Issue',
    description: 'Payment was deducted but booking not confirmed',
    status: 'resolved',
    created: '2024-01-14T09:15:00Z',
    lastUpdate: '2024-01-15T16:45:00Z'
  }
];

export const createSupportTicket: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      priority,
      subject,
      description,
      bookingId
    } = req.body;

    // Validate required fields
    if (!name || !email || !category || !subject || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Generate ticket ID
    const ticketId = `TK${String(tickets.length + 1).padStart(3, '0')}`;
    
    const newTicket: SupportTicket = {
      id: ticketId,
      name,
      email,
      phone,
      category,
      priority: priority || 'medium',
      subject,
      description,
      bookingId,
      status: 'open',
      created: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };

    tickets.push(newTicket);

    // Send email notifications
    try {
      // Email to admin
      const adminEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF5722, #F44336); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Support Ticket</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Ticket Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Ticket ID:</td>
                <td style="padding: 10px; color: #333;">${ticketId}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 10px; color: #333;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 10px; color: #333;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 10px; color: #333;">${phone || 'Not provided'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Category:</td>
                <td style="padding: 10px; color: #333;">${category}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Priority:</td>
                <td style="padding: 10px; color: #333;">${priority}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Subject:</td>
                <td style="padding: 10px; color: #333;">${subject}</td>
              </tr>
              ${bookingId ? `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #555;">Booking ID:</td>
                <td style="padding: 10px; color: #333;">${bookingId}</td>
              </tr>
              ` : ''}
            </table>
            
            <h3 style="color: #333; margin-bottom: 10px;">Description:</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; color: #333; line-height: 1.5;">
              ${description.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `;

      await EmailService.sendEmail(
        'support@coastalconnect.in',
        `New Support Ticket [${ticketId}]: ${subject}`,
        adminEmailContent,
        `New Support Ticket: ${ticketId}\n\nFrom: ${name} (${email})\nSubject: ${subject}\n\nDescription:\n${description}`
      );

      // Email to customer
      const customerEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF5722, #F44336); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Support Ticket Created</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name},</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for contacting CoastalConnect support. We have received your support request 
              and our team will review it shortly.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Ticket Details:</h3>
              <p style="margin: 5px 0; color: #555;"><strong>Ticket ID:</strong> ${ticketId}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Category:</strong> ${category}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Priority:</strong> ${priority}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              We typically respond within <strong>24 hours</strong> for standard issues and within 
              <strong>4 hours</strong> for urgent matters during business hours.
            </p>
            
            <div style="background: #FF5722; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📞 Need Immediate Help?</strong></p>
              <p style="margin: 5px 0;">Call us: +91 9876543210</p>
              <p style="margin: 5px 0;">Available 24/7 for urgent issues</p>
            </div>
            
            <p style="color: #555; margin-top: 30px;">
              Best regards,<br>
              <strong>CoastalConnect Support Team</strong>
            </p>
          </div>
        </div>
      `;

      await EmailService.sendEmail(
        email,
        `Support Ticket Created [${ticketId}] - We're Here to Help!`,
        customerEmailContent,
        `Hi ${name},\n\nYour support ticket has been created.\n\nTicket ID: ${ticketId}\nSubject: ${subject}\n\nWe'll respond within 24 hours.\n\nCoastalConnect Support Team`
      );

    } catch (emailError) {
      console.error('Failed to send support ticket emails:', emailError);
      // Continue even if email fails
    }

    res.json({
      success: true,
      message: 'Support ticket created successfully',
      data: {
        ticketId: newTicket.id,
        status: newTicket.status,
        created: newTicket.created
      }
    });

  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create support ticket'
    });
  }
};

export const getSupportTickets: RequestHandler = async (req, res) => {
  try {
    const { email } = req.query;
    
    let filteredTickets = tickets;
    
    // Filter by email if provided
    if (email) {
      filteredTickets = tickets.filter(ticket => 
        ticket.email.toLowerCase() === (email as string).toLowerCase()
      );
    }

    // Sort by creation date (newest first)
    filteredTickets.sort((a, b) => 
      new Date(b.created).getTime() - new Date(a.created).getTime()
    );

    res.json({
      success: true,
      data: filteredTickets,
      total: filteredTickets.length
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch support tickets'
    });
  }
};

export const getSupportTicket: RequestHandler = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch support ticket'
    });
  }
};

export const updateSupportTicket: RequestHandler = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, response } = req.body;
    
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Support ticket not found'
      });
    }

    // Update ticket
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      status: status || tickets[ticketIndex].status,
      lastUpdate: new Date().toISOString()
    };

    // Send update email if status changed
    if (status && response) {
      try {
        const ticket = tickets[ticketIndex];
        const updateEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #FF5722, #F44336); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Ticket Update</h1>
            </div>
            
            <div style="padding: 30px; background: white;">
              <h2 style="color: #333; margin-bottom: 20px;">Hi ${ticket.name},</h2>
              
              <p style="color: #555; line-height: 1.6;">
                We have an update on your support ticket <strong>${ticketId}</strong>.
              </p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0; color: #555;"><strong>Status:</strong> ${status}</p>
                <p style="margin: 5px 0; color: #555;"><strong>Response:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                  ${response.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <p style="color: #555; line-height: 1.6;">
                If you have any questions or need further assistance, please reply to this email 
                or contact our support team.
              </p>
            </div>
          </div>
        `;

        await EmailService.sendEmail(
          ticket.email,
          `Ticket Update [${ticketId}] - ${ticket.subject}`,
          updateEmailContent,
          `Ticket Update: ${ticketId}\n\nStatus: ${status}\nResponse: ${response}\n\nCoastalConnect Support Team`
        );

      } catch (emailError) {
        console.error('Failed to send ticket update email:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Support ticket updated successfully',
      data: tickets[ticketIndex]
    });

  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update support ticket'
    });
  }
};
