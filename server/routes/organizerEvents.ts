import { RequestHandler } from "express";
import { getConnection } from "../db/connection";
import { Event } from "../models/EventOrganizer";

// Create New Event
export const createEvent: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const {
      title,
      description,
      category,
      subcategory,
      location,
      detailed_address,
      venue_name,
      venue_capacity,
      event_date,
      start_time,
      end_time,
      is_multi_day,
      end_date,
      entry_fee,
      is_free,
      registration_required,
      registration_url,
      registration_deadline,
      max_attendees,
      image_url,
      gallery_images,
      contact_phone,
      contact_email,
      website_url,
      social_media_links,
      requirements,
      amenities,
      accessibility_info,
      cancellation_policy,
      refund_policy,
      terms_conditions,
      tags,
      age_restrictions,
      languages,
      certificates_provided,
      ceu_credits,
      weather_dependency,
      backup_plan,
      live_streaming,
      recording_allowed,
      media_contact
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location || !detailed_address || 
        !event_date || !start_time || !end_time || !contact_phone || !contact_email) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate category
    const validCategories = ['kambala', 'festival', 'cultural', 'religious', 'sports', 'educational', 
                           'workshop', 'conference', 'concert', 'exhibition', 'competition', 'community', 'charity', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Validate location
    const validLocations = ['udupi', 'manipal', 'malpe', 'kaup', 'other'];
    if (!validLocations.includes(location)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location'
      });
    }

    // Validate date is in future
    const eventDateTime = new Date(`${event_date}T${start_time}`);
    if (eventDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event date must be in the future'
      });
    }

    const connection = await getConnection();

    const result = await connection.request()
      .input('organizer_id', organizerId)
      .input('title', title)
      .input('description', description)
      .input('category', category)
      .input('subcategory', subcategory || null)
      .input('location', location)
      .input('detailed_address', detailed_address)
      .input('venue_name', venue_name || null)
      .input('venue_capacity', venue_capacity || null)
      .input('event_date', event_date)
      .input('start_time', start_time)
      .input('end_time', end_time)
      .input('is_multi_day', is_multi_day || false)
      .input('end_date', end_date || null)
      .input('entry_fee', entry_fee || 0)
      .input('is_free', is_free !== false)
      .input('registration_required', registration_required || false)
      .input('registration_url', registration_url || null)
      .input('registration_deadline', registration_deadline || null)
      .input('max_attendees', max_attendees || null)
      .input('image_url', image_url || null)
      .input('gallery_images', gallery_images ? JSON.stringify(gallery_images) : null)
      .input('contact_phone', contact_phone)
      .input('contact_email', contact_email)
      .input('website_url', website_url || null)
      .input('social_media_links', social_media_links ? JSON.stringify(social_media_links) : null)
      .input('requirements', requirements || null)
      .input('amenities', amenities || null)
      .input('accessibility_info', accessibility_info || null)
      .input('cancellation_policy', cancellation_policy || null)
      .input('refund_policy', refund_policy || null)
      .input('terms_conditions', terms_conditions || null)
      .input('tags', tags || null)
      .input('age_restrictions', age_restrictions || null)
      .input('languages', languages || null)
      .input('certificates_provided', certificates_provided || false)
      .input('ceu_credits', ceu_credits || null)
      .input('weather_dependency', weather_dependency || false)
      .input('backup_plan', backup_plan || null)
      .input('live_streaming', live_streaming || false)
      .input('recording_allowed', recording_allowed !== false)
      .input('media_contact', media_contact || null)
      .query(`
        INSERT INTO LocalEvents 
        (organizer_id, title, description, category, subcategory, location, detailed_address, venue_name, venue_capacity,
         event_date, start_time, end_time, is_multi_day, end_date, entry_fee, is_free, registration_required, 
         registration_url, registration_deadline, max_attendees, image_url, gallery_images, contact_phone, 
         contact_email, website_url, social_media_links, requirements, amenities, accessibility_info, 
         cancellation_policy, refund_policy, terms_conditions, tags, age_restrictions, languages, 
         certificates_provided, ceu_credits, weather_dependency, backup_plan, live_streaming, 
         recording_allowed, media_contact)
        OUTPUT INSERTED.id
        VALUES (@organizer_id, @title, @description, @category, @subcategory, @location, @detailed_address, 
                @venue_name, @venue_capacity, @event_date, @start_time, @end_time, @is_multi_day, @end_date, 
                @entry_fee, @is_free, @registration_required, @registration_url, @registration_deadline, 
                @max_attendees, @image_url, @gallery_images, @contact_phone, @contact_email, @website_url, 
                @social_media_links, @requirements, @amenities, @accessibility_info, @cancellation_policy, 
                @refund_policy, @terms_conditions, @tags, @age_restrictions, @languages, @certificates_provided, 
                @ceu_credits, @weather_dependency, @backup_plan, @live_streaming, @recording_allowed, @media_contact)
      `);

    const eventId = result.recordset[0].id;

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { id: eventId }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
};

// Get Organizer's Events
export const getOrganizerEvents: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const { status, category, page = 1, limit = 10 } = req.query;
    
    const connection = await getConnection();
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereClause = 'WHERE organizer_id = @organizerId';
    const request = connection.request().input('organizerId', organizerId);

    if (status) {
      whereClause += ' AND status = @status';
      request.input('status', status);
    }

    if (category) {
      whereClause += ' AND category = @category';
      request.input('category', category);
    }

    // Get total count
    const countResult = await request.query(`
      SELECT COUNT(*) as total FROM LocalEvents ${whereClause}
    `);

    // Get events
    const eventsResult = await request
      .input('offset', offset)
      .input('limit', parseInt(limit as string))
      .query(`
        SELECT id, title, description, category, location, event_date, start_time, end_time, 
               entry_fee, is_free, status, admin_approval_status, current_registrations, max_attendees,
               view_count, interested_count, going_count, is_featured, created_at, updated_at
        FROM LocalEvents 
        ${whereClause}
        ORDER BY created_at DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    res.json({
      success: true,
      data: eventsResult.recordset,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: countResult.recordset[0].total,
        totalPages: Math.ceil(countResult.recordset[0].total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
};

// Get Single Event Details
export const getEventDetails: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const eventId = req.params.id;

    const connection = await getConnection();

    const result = await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`
        SELECT * FROM LocalEvents 
        WHERE id = @eventId AND organizer_id = @organizerId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const event = result.recordset[0];
    
    // Parse JSON fields
    if (event.gallery_images) event.gallery_images = JSON.parse(event.gallery_images);
    if (event.social_media_links) event.social_media_links = JSON.parse(event.social_media_links);

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event details'
    });
  }
};

// Update Event
export const updateEvent: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const eventId = req.params.id;
    
    const connection = await getConnection();

    // Check if event belongs to organizer and can be edited
    const eventCheck = await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`
        SELECT status, admin_approval_status FROM LocalEvents 
        WHERE id = @eventId AND organizer_id = @organizerId
      `);

    if (eventCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const currentEvent = eventCheck.recordset[0];
    
    // Check if event can be edited
    if (currentEvent.status === 'completed' || currentEvent.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit completed or cancelled events'
      });
    }

    const updateFields = [];
    const request = connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId);

    // Build dynamic update query
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        updateFields.push(`${key} = @${key}`);
        if (key === 'gallery_images' || key === 'social_media_links') {
          request.input(key, JSON.stringify(req.body[key]));
        } else {
          request.input(key, req.body[key]);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // If event was approved and is being modified, reset approval status
    if (currentEvent.admin_approval_status === 'approved') {
      updateFields.push('admin_approval_status = @newApprovalStatus');
      request.input('newApprovalStatus', 'pending');
    }

    await request.query(`
      UPDATE LocalEvents 
      SET ${updateFields.join(', ')}, last_modified_by = 'organizer'
      WHERE id = @eventId AND organizer_id = @organizerId
    `);

    res.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
};

// Submit Event for Approval
export const submitEventForApproval: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const eventId = req.params.id;

    const connection = await getConnection();

    // Check if event exists and belongs to organizer
    const eventCheck = await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`
        SELECT status FROM LocalEvents 
        WHERE id = @eventId AND organizer_id = @organizerId
      `);

    if (eventCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const currentStatus = eventCheck.recordset[0].status;
    
    if (currentStatus !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft events can be submitted for approval'
      });
    }

    await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`
        UPDATE LocalEvents 
        SET status = 'submitted', admin_approval_status = 'pending'
        WHERE id = @eventId AND organizer_id = @organizerId
      `);

    res.json({
      success: true,
      message: 'Event submitted for approval'
    });
  } catch (error) {
    console.error('Error submitting event for approval:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit event for approval'
    });
  }
};

// Delete Event
export const deleteEvent: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const eventId = req.params.id;

    const connection = await getConnection();

    // Check if event exists and can be deleted
    const eventCheck = await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`
        SELECT status, current_registrations FROM LocalEvents 
        WHERE id = @eventId AND organizer_id = @organizerId
      `);

    if (eventCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const event = eventCheck.recordset[0];
    
    // Don't allow deletion if event has registrations
    if (event.current_registrations > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with existing registrations. Consider cancelling instead.'
      });
    }

    // Only allow deletion of draft, rejected events
    if (!['draft', 'rejected'].includes(event.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only draft or rejected events can be deleted'
      });
    }

    await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`
        DELETE FROM LocalEvents 
        WHERE id = @eventId AND organizer_id = @organizerId
      `);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
};

// Cancel Event
export const cancelEvent: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const eventId = req.params.id;
    const { cancellation_reason, notify_participants = true } = req.body;

    const connection = await getConnection();

    await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .input('cancellationReason', cancellation_reason || 'Event cancelled by organizer')
      .query(`
        UPDATE LocalEvents 
        SET status = 'cancelled', admin_notes = @cancellationReason
        WHERE id = @eventId AND organizer_id = @organizerId
      `);

    // TODO: Implement notification system for participants

    res.json({
      success: true,
      message: 'Event cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel event'
    });
  }
};

// Get Event Registrations
export const getEventRegistrations: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const eventId = req.params.id;

    const connection = await getConnection();

    // Verify event belongs to organizer
    const eventCheck = await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`SELECT id FROM LocalEvents WHERE id = @eventId AND organizer_id = @organizerId`);

    if (eventCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registrations = await connection.request()
      .input('eventId', eventId)
      .query(`
        SELECT id, participant_name, participant_email, participant_phone, participant_city,
               participant_age, participant_gender, registration_date, payment_status, 
               payment_amount, attendance_status, dietary_restrictions, special_requirements
        FROM EventRegistrations 
        WHERE event_id = @eventId
        ORDER BY registration_date DESC
      `);

    res.json({
      success: true,
      data: registrations.recordset
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations'
    });
  }
};

// Get Event Analytics
export const getEventAnalytics: RequestHandler = async (req, res) => {
  try {
    const organizerId = (req as any).organizer.id;
    const eventId = req.params.id;

    const connection = await getConnection();

    // Verify event belongs to organizer
    const eventCheck = await connection.request()
      .input('eventId', eventId)
      .input('organizerId', organizerId)
      .query(`SELECT id FROM LocalEvents WHERE id = @eventId AND organizer_id = @organizerId`);

    if (eventCheck.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get basic analytics
    const analytics = await connection.request()
      .input('eventId', eventId)
      .query(`
        SELECT 
          SUM(page_views) as total_views,
          SUM(unique_visitors) as unique_visitors,
          SUM(registrations) as total_registrations,
          SUM(social_shares) as social_shares
        FROM EventAnalytics 
        WHERE event_id = @eventId
      `);

    // Get registration trends (last 30 days)
    const trends = await connection.request()
      .input('eventId', eventId)
      .query(`
        SELECT date, registrations, page_views
        FROM EventAnalytics 
        WHERE event_id = @eventId 
        AND date >= DATEADD(day, -30, GETDATE())
        ORDER BY date ASC
      `);

    res.json({
      success: true,
      data: {
        summary: analytics.recordset[0],
        trends: trends.recordset
      }
    });
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};
