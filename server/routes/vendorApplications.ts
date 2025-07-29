import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { AuthService } from "../services/auth";

// Submit vendor application
export const submitVendorApplication: RequestHandler = async (req, res) => {
  try {
    const {
      business_name,
      business_type,
      business_description,
      business_address,
      city,
      state,
      contact_person,
      contact_phone,
      contact_email,
      business_license,
      gst_number,
      pan_number,
      aadhar_number
    } = req.body;

    // Validate required fields
    if (!business_name || !business_type || !business_description || !business_address || 
        !contact_person || !contact_phone || !contact_email || !business_license || !gst_number) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let user;
    try {
      const decoded = AuthService.verifyToken(token);
      user = await AuthService.findUserById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    const connection = await getConnection();

    // Check if user already has a pending application
    const existingApp = await connection.request()
      .input('userId', user.id)
      .query('SELECT * FROM VendorApplications WHERE user_id = @userId AND status IN (\'pending\', \'under_review\')');

    if (existingApp.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending vendor application'
      });
    }

    // Insert vendor application
    const result = await connection.request()
      .input('userId', user.id)
      .input('businessName', business_name)
      .input('businessType', business_type)
      .input('businessDescription', business_description)
      .input('businessAddress', business_address)
      .input('city', city)
      .input('state', state || 'Karnataka')
      .input('contactPerson', contact_person)
      .input('contactPhone', contact_phone)
      .input('contactEmail', contact_email)
      .input('businessLicense', business_license)
      .input('gstNumber', gst_number)
      .input('panNumber', pan_number)
      .input('aadharNumber', aadhar_number || null)
      .query(`
        INSERT INTO VendorApplications (
          user_id, business_name, business_type, business_description,
          business_address, city, state, contact_person, contact_phone,
          contact_email, business_license, gst_number, pan_number, aadhar_number,
          status, submitted_at
        )
        OUTPUT INSERTED.id
        VALUES (
          @userId, @businessName, @businessType, @businessDescription,
          @businessAddress, @city, @state, @contactPerson, @contactPhone,
          @contactEmail, @businessLicense, @gstNumber, @panNumber, @aadharNumber,
          'pending', GETDATE()
        )
      `);

    const applicationId = result.recordset[0].id;

    res.status(201).json({
      success: true,
      data: {
        applicationId: applicationId,
        status: 'pending',
        submittedAt: new Date()
      },
      message: 'Vendor application submitted successfully'
    });

    console.log(`Vendor application submitted by user ${user.id} (${user.email})`);

  } catch (error) {
    console.error('Error submitting vendor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit vendor application',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user's vendor application status
export const getUserVendorApplication: RequestHandler = async (req, res) => {
  try {
    // Get user from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let user;
    try {
      const decoded = AuthService.verifyToken(token);
      user = await AuthService.findUserById(decoded.userId);
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    const connection = await getConnection();

    // Get user's vendor application
    const result = await connection.request()
      .input('userId', user.id)
      .query(`
        SELECT va.*, reviewer.name as reviewer_name
        FROM VendorApplications va
        LEFT JOIN Users reviewer ON va.reviewed_by = reviewer.id
        WHERE va.user_id = @userId
        ORDER BY va.submitted_at DESC
      `);

    if (result.recordset.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No vendor application found'
      });
    }

    const application = result.recordset[0];

    res.json({
      success: true,
      data: {
        id: application.id,
        business: {
          name: application.business_name,
          type: application.business_type,
          description: application.business_description,
          address: application.business_address,
          city: application.city,
          state: application.state
        },
        contact: {
          person: application.contact_person,
          phone: application.contact_phone,
          email: application.contact_email
        },
        documents: {
          businessLicense: application.business_license,
          gstNumber: application.gst_number,
          panNumber: application.pan_number,
          aadharNumber: application.aadhar_number
        },
        status: application.status,
        submittedAt: application.submitted_at,
        reviewedAt: application.reviewed_at,
        reviewedBy: application.reviewer_name,
        adminNotes: application.admin_notes,
        rejectionReason: application.rejection_reason
      },
      message: 'Vendor application retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting vendor application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vendor application',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
