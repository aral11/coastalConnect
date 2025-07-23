-- Event Organizers Table
CREATE TABLE EventOrganizers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    organization_name NVARCHAR(255) NOT NULL,
    contact_person NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    address NVARCHAR(500) NOT NULL,
    city NVARCHAR(100) NOT NULL,
    state NVARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    pincode NVARCHAR(10) NOT NULL,
    organization_type NVARCHAR(50) NOT NULL CHECK (organization_type IN ('individual', 'ngo', 'government', 'private', 'religious', 'cultural', 'sports', 'educational')),
    website_url NVARCHAR(500),
    social_media_links NVARCHAR(MAX), -- JSON string
    registration_number NVARCHAR(100),
    tax_id NVARCHAR(50),
    verification_status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_documents NVARCHAR(MAX), -- JSON string for document URLs
    admin_notes NVARCHAR(MAX),
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    last_login DATETIME2,
    total_events_organized INT NOT NULL DEFAULT 0,
    rating DECIMAL(3,2),
    specialization NVARCHAR(500) -- comma-separated categories
);

-- Updated LocalEvents Table (Enhanced)
IF OBJECT_ID('LocalEvents', 'U') IS NOT NULL
    DROP TABLE LocalEvents;

CREATE TABLE LocalEvents (
    id INT IDENTITY(1,1) PRIMARY KEY,
    organizer_id INT FOREIGN KEY REFERENCES EventOrganizers(id),
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    category NVARCHAR(50) NOT NULL CHECK (category IN ('kambala', 'festival', 'cultural', 'religious', 'sports', 'educational', 'workshop', 'conference', 'concert', 'exhibition', 'competition', 'community', 'charity', 'other')),
    subcategory NVARCHAR(100),
    location NVARCHAR(50) NOT NULL CHECK (location IN ('udupi', 'manipal', 'malpe', 'kaup', 'other')),
    detailed_address NVARCHAR(500) NOT NULL,
    venue_name NVARCHAR(255),
    venue_capacity INT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_multi_day BIT NOT NULL DEFAULT 0,
    end_date DATE,
    entry_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_free BIT NOT NULL DEFAULT 1,
    registration_required BIT NOT NULL DEFAULT 0,
    registration_url NVARCHAR(500),
    registration_deadline DATETIME2,
    max_attendees INT,
    current_registrations INT NOT NULL DEFAULT 0,
    image_url NVARCHAR(500),
    gallery_images NVARCHAR(MAX), -- JSON string for multiple images
    contact_phone NVARCHAR(20) NOT NULL,
    contact_email NVARCHAR(255) NOT NULL,
    website_url NVARCHAR(500),
    social_media_links NVARCHAR(MAX), -- JSON string
    requirements NVARCHAR(MAX), -- What attendees need to bring/know
    amenities NVARCHAR(MAX), -- What's provided (parking, food, etc.)
    accessibility_info NVARCHAR(MAX),
    cancellation_policy NVARCHAR(MAX),
    refund_policy NVARCHAR(MAX),
    terms_conditions NVARCHAR(MAX),
    status NVARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'published', 'cancelled', 'completed')),
    admin_approval_status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (admin_approval_status IN ('pending', 'approved', 'rejected')),
    admin_notes NVARCHAR(MAX),
    rejection_reason NVARCHAR(MAX),
    is_featured BIT NOT NULL DEFAULT 0,
    featured_until DATETIME2,
    priority_level NVARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high')),
    tags NVARCHAR(500), -- comma-separated tags
    age_restrictions NVARCHAR(255),
    languages NVARCHAR(255), -- Languages used in event
    certificates_provided BIT NOT NULL DEFAULT 0,
    ceu_credits DECIMAL(4,2),
    sponsorship_info NVARCHAR(MAX), -- JSON string
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    published_at DATETIME2,
    last_modified_by NVARCHAR(20) NOT NULL DEFAULT 'organizer' CHECK (last_modified_by IN ('organizer', 'admin')),
    view_count INT NOT NULL DEFAULT 0,
    interested_count INT NOT NULL DEFAULT 0,
    going_count INT NOT NULL DEFAULT 0,
    weather_dependency BIT NOT NULL DEFAULT 0,
    backup_plan NVARCHAR(MAX),
    live_streaming BIT NOT NULL DEFAULT 0,
    recording_allowed BIT NOT NULL DEFAULT 1,
    media_contact NVARCHAR(255)
);

-- Event Registrations Table
CREATE TABLE EventRegistrations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL FOREIGN KEY REFERENCES LocalEvents(id),
    participant_name NVARCHAR(255) NOT NULL,
    participant_email NVARCHAR(255) NOT NULL,
    participant_phone NVARCHAR(20) NOT NULL,
    participant_age INT,
    participant_gender NVARCHAR(20) CHECK (participant_gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    participant_city NVARCHAR(100) NOT NULL,
    emergency_contact_name NVARCHAR(255),
    emergency_contact_phone NVARCHAR(20),
    dietary_restrictions NVARCHAR(500),
    special_requirements NVARCHAR(500),
    how_did_you_hear NVARCHAR(255),
    registration_date DATETIME2 NOT NULL DEFAULT GETDATE(),
    payment_status NVARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method NVARCHAR(50),
    payment_reference NVARCHAR(100),
    attendance_status NVARCHAR(20) NOT NULL DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'no_show', 'cancelled')),
    check_in_time DATETIME2,
    feedback_rating INT CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comments NVARCHAR(MAX),
    certificate_issued BIT NOT NULL DEFAULT 0,
    certificate_url NVARCHAR(500)
);

-- Event Updates Table
CREATE TABLE EventUpdates (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL FOREIGN KEY REFERENCES LocalEvents(id),
    organizer_id INT NOT NULL FOREIGN KEY REFERENCES EventOrganizers(id),
    update_type NVARCHAR(20) NOT NULL CHECK (update_type IN ('announcement', 'schedule_change', 'venue_change', 'cancellation', 'general')),
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    is_important BIT NOT NULL DEFAULT 0,
    sent_to_registered BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Event Feedback Table
CREATE TABLE EventFeedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL FOREIGN KEY REFERENCES LocalEvents(id),
    participant_email NVARCHAR(255) NOT NULL,
    participant_name NVARCHAR(255),
    overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    venue_rating INT CHECK (venue_rating BETWEEN 1 AND 5),
    organization_rating INT CHECK (organization_rating BETWEEN 1 AND 5),
    content_rating INT CHECK (content_rating BETWEEN 1 AND 5),
    value_rating INT CHECK (value_rating BETWEEN 1 AND 5),
    comments NVARCHAR(MAX),
    suggestions NVARCHAR(MAX),
    would_recommend BIT NOT NULL DEFAULT 1,
    attend_future_events BIT NOT NULL DEFAULT 1,
    favorite_aspects NVARCHAR(500),
    improvement_areas NVARCHAR(500),
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    is_public BIT NOT NULL DEFAULT 1
);

-- Event Analytics Table
CREATE TABLE EventAnalytics (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL FOREIGN KEY REFERENCES LocalEvents(id),
    date DATE NOT NULL,
    page_views INT NOT NULL DEFAULT 0,
    unique_visitors INT NOT NULL DEFAULT 0,
    registrations INT NOT NULL DEFAULT 0,
    cancellations INT NOT NULL DEFAULT 0,
    social_shares INT NOT NULL DEFAULT 0,
    click_through_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    referral_source NVARCHAR(MAX), -- JSON string with sources
    demographics NVARCHAR(MAX), -- JSON string with age, gender, location data
    UNIQUE(event_id, date)
);

-- Create indexes for performance
CREATE INDEX IX_EventOrganizers_Email ON EventOrganizers(email);
CREATE INDEX IX_EventOrganizers_VerificationStatus ON EventOrganizers(verification_status);
CREATE INDEX IX_LocalEvents_OrganizerID ON LocalEvents(organizer_id);
CREATE INDEX IX_LocalEvents_Status ON LocalEvents(status);
CREATE INDEX IX_LocalEvents_AdminApprovalStatus ON LocalEvents(admin_approval_status);
CREATE INDEX IX_LocalEvents_EventDate ON LocalEvents(event_date);
CREATE INDEX IX_LocalEvents_Location ON LocalEvents(location);
CREATE INDEX IX_LocalEvents_Category ON LocalEvents(category);
CREATE INDEX IX_EventRegistrations_EventID ON EventRegistrations(event_id);
CREATE INDEX IX_EventRegistrations_ParticipantEmail ON EventRegistrations(participant_email);
CREATE INDEX IX_EventUpdates_EventID ON EventUpdates(event_id);
CREATE INDEX IX_EventFeedback_EventID ON EventFeedback(event_id);
CREATE INDEX IX_EventAnalytics_EventID ON EventAnalytics(event_id);

-- Create triggers for updating timestamps
CREATE TRIGGER TR_EventOrganizers_UpdateTimestamp 
ON EventOrganizers
AFTER UPDATE
AS
BEGIN
    UPDATE EventOrganizers 
    SET updated_at = GETDATE()
    WHERE id IN (SELECT id FROM inserted);
END;

CREATE TRIGGER TR_LocalEvents_UpdateTimestamp 
ON LocalEvents
AFTER UPDATE
AS
BEGIN
    UPDATE LocalEvents 
    SET updated_at = GETDATE()
    WHERE id IN (SELECT id FROM inserted);
END;

-- Create trigger to update organizer event count
CREATE TRIGGER TR_LocalEvents_UpdateOrganizerCount
ON LocalEvents
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Update count for organizers affected by inserts/updates
    IF EXISTS(SELECT * FROM inserted)
    BEGIN
        UPDATE EventOrganizers 
        SET total_events_organized = (
            SELECT COUNT(*) 
            FROM LocalEvents 
            WHERE organizer_id = EventOrganizers.id 
            AND status IN ('approved', 'published', 'completed')
        )
        WHERE id IN (SELECT DISTINCT organizer_id FROM inserted WHERE organizer_id IS NOT NULL);
    END

    -- Update count for organizers affected by deletes
    IF EXISTS(SELECT * FROM deleted)
    BEGIN
        UPDATE EventOrganizers 
        SET total_events_organized = (
            SELECT COUNT(*) 
            FROM LocalEvents 
            WHERE organizer_id = EventOrganizers.id 
            AND status IN ('approved', 'published', 'completed')
        )
        WHERE id IN (SELECT DISTINCT organizer_id FROM deleted WHERE organizer_id IS NOT NULL);
    END
END;
