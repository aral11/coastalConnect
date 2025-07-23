import { RequestHandler } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConnection } from "../db/connection";
import { EventOrganizer, Event } from "../models/EventOrganizer";

const JWT_SECRET = process.env.JWT_SECRET || 'coastal-connect-event-organizer-secret';
const SALT_ROUNDS = 12;

// Event Organizer Registration
export const registerOrganizer: RequestHandler = async (req, res) => {
  try {
    const {
      organization_name,
      contact_person,
      email,
      phone,
      password,
      address,
      city,
      pincode,
      organization_type,
      website_url,
      social_media_links,
      registration_number,
      tax_id,
      specialization
    } = req.body;

    // Validate required fields
    if (!organization_name || !contact_person || !email || !phone || !password || !address || !city || !pincode || !organization_type) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate organization type
    const validTypes = ['individual', 'ngo', 'government', 'private', 'religious', 'cultural', 'sports', 'educational'];
    if (!validTypes.includes(organization_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organization type'
      });
    }

    const connection = await getConnection();

    // Check if email already exists
    const existingOrganizer = await connection.request()
      .input('email', email)
      .query('SELECT id FROM EventOrganizers WHERE email = @email');

    if (existingOrganizer.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new organizer
    const result = await connection.request()
      .input('organization_name', organization_name)
      .input('contact_person', contact_person)
      .input('email', email)
      .input('phone', phone)
      .input('password_hash', password_hash)
      .input('address', address)
      .input('city', city)
      .input('pincode', pincode)
      .input('organization_type', organization_type)
      .input('website_url', website_url || null)
      .input('social_media_links', social_media_links ? JSON.stringify(social_media_links) : null)
      .input('registration_number', registration_number || null)
      .input('tax_id', tax_id || null)
      .input('specialization', specialization || null)
      .query(`
        INSERT INTO EventOrganizers 
        (organization_name, contact_person, email, phone, password_hash, address, city, pincode, 
         organization_type, website_url, social_media_links, registration_number, tax_id, specialization)
        OUTPUT INSERTED.id
        VALUES (@organization_name, @contact_person, @email, @phone, @password_hash, @address, 
                @city, @pincode, @organization_type, @website_url, @social_media_links, 
                @registration_number, @tax_id, @specialization)
      `);

    const organizerId = result.recordset[0].id;

    res.status(201).json({
      success: true,
      message: 'Event organizer registered successfully. Your account is pending verification.',
      data: {
        id: organizerId,
        organization_name,
        contact_person,
        email,
        verification_status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error registering event organizer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register event organizer'
    });
  }
};

// Event Organizer Login
export const loginOrganizer: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const connection = await getConnection();

    // Get organizer by email
    const result = await connection.request()
      .input('email', email)
      .query(`
        SELECT id, organization_name, contact_person, email, password_hash, 
               verification_status, is_active, last_login
        FROM EventOrganizers 
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const organizer = result.recordset[0];

    // Check if organizer is active
    if (!organizer.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, organizer.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await connection.request()
      .input('id', organizer.id)
      .query('UPDATE EventOrganizers SET last_login = GETDATE() WHERE id = @id');

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: organizer.id, 
        email: organizer.email, 
        type: 'event_organizer',
        verification_status: organizer.verification_status
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        organizer: {
          id: organizer.id,
          organization_name: organizer.organization_name,
          contact_person: organizer.contact_person,
          email: organizer.email,
          verification_status: organizer.verification_status
        },
        token
      }
    });
  } catch (error) {
    console.error('Error logging in event organizer:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Get Organizer Profile
export const getOrganizerProfile: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const connection = await getConnection();

    const result = await connection.request()
      .input('id', organizerId)
      .query(`
        SELECT id, organization_name, contact_person, email, phone, address, city, state, pincode,
               organization_type, website_url, social_media_links, registration_number, tax_id,
               verification_status, is_active, created_at, total_events_organized, rating, specialization
        FROM EventOrganizers 
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Organizer not found'
      });
    }

    const organizer = result.recordset[0];
    if (organizer.social_media_links) {
      organizer.social_media_links = JSON.parse(organizer.social_media_links);
    }

    res.json({
      success: true,
      data: organizer
    });
  } catch (error) {
    console.error('Error fetching organizer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// Update Organizer Profile
export const updateOrganizerProfile: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const {
      organization_name,
      contact_person,
      phone,
      address,
      city,
      pincode,
      website_url,
      social_media_links,
      specialization
    } = req.body;

    const connection = await getConnection();

    await connection.request()
      .input('id', organizerId)
      .input('organization_name', organization_name)
      .input('contact_person', contact_person)
      .input('phone', phone)
      .input('address', address)
      .input('city', city)
      .input('pincode', pincode)
      .input('website_url', website_url || null)
      .input('social_media_links', social_media_links ? JSON.stringify(social_media_links) : null)
      .input('specialization', specialization || null)
      .query(`
        UPDATE EventOrganizers 
        SET organization_name = @organization_name,
            contact_person = @contact_person,
            phone = @phone,
            address = @address,
            city = @city,
            pincode = @pincode,
            website_url = @website_url,
            social_media_links = @social_media_links,
            specialization = @specialization
        WHERE id = @id
      `);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating organizer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

// Get Organizer Dashboard Stats
export const getOrganizerDashboard: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const connection = await getConnection();

    // Get event statistics
    const eventStats = await connection.request()
      .input('organizerId', organizerId)
      .query(`
        SELECT 
          COUNT(*) as total_events,
          SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_events,
          SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_events,
          SUM(CASE WHEN admin_approval_status = 'pending' THEN 1 ELSE 0 END) as pending_approval,
          SUM(CASE WHEN admin_approval_status = 'approved' THEN 1 ELSE 0 END) as approved_events,
          SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_events,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_events,
          SUM(CASE WHEN event_date >= CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) as upcoming_events
        FROM LocalEvents 
        WHERE organizer_id = @organizerId
      `);

    // Get recent events
    const recentEvents = await connection.request()
      .input('organizerId', organizerId)
      .query(`
        SELECT TOP 5 id, title, event_date, status, admin_approval_status, current_registrations, view_count
        FROM LocalEvents 
        WHERE organizer_id = @organizerId
        ORDER BY created_at DESC
      `);

    // Get total registrations
    const registrationStats = await connection.request()
      .input('organizerId', organizerId)
      .query(`
        SELECT 
          SUM(er.payment_amount) as total_revenue,
          COUNT(er.id) as total_registrations,
          AVG(CAST(ef.overall_rating AS FLOAT)) as average_rating
        FROM LocalEvents le
        LEFT JOIN EventRegistrations er ON le.id = er.event_id
        LEFT JOIN EventFeedback ef ON le.id = ef.event_id
        WHERE le.organizer_id = @organizerId
      `);

    res.json({
      success: true,
      data: {
        event_stats: eventStats.recordset[0],
        recent_events: recentEvents.recordset,
        registration_stats: registrationStats.recordset[0]
      }
    });
  } catch (error) {
    console.error('Error fetching organizer dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
};

// Middleware to authenticate organizer
export const authenticateOrganizer: RequestHandler = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type !== 'event_organizer') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    (req as any).organizer = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to check if organizer is verified
export const requireVerifiedOrganizer: RequestHandler = (req, res, next) => {
  const organizer = (req as any).organizer;
  
  if (organizer.verification_status !== 'verified') {
    return res.status(403).json({
      success: false,
      message: 'Organizer account must be verified to perform this action'
    });
  }
  
  next();
};
