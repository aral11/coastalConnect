-- CoastalConnect SQL Server Database Schema
-- Production-Ready Schema matching Supabase functionality
-- Includes proper indexes, constraints, and stored procedures for business logic

-- Enable required features
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;

-- ==============================================
-- 1. CONFIGURATION TABLES (Dynamic Data Sources)
-- ==============================================

-- Service Categories (replaces hardcoded navigation)
CREATE TABLE service_categories (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL UNIQUE,
    slug NVARCHAR(100) NOT NULL UNIQUE,
    icon NVARCHAR(100), -- icon class or URL
    color NVARCHAR(7), -- hex color
    description NTEXT,
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    parent_id UNIQUEIDENTIFIER REFERENCES service_categories(id),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Dropdown Options (dynamic form choices)
CREATE TABLE dropdown_options (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    category NVARCHAR(100) NOT NULL, -- 'event_categories', 'cities', 'cuisines', etc.
    label NVARCHAR(255) NOT NULL,
    value NVARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    metadata NVARCHAR(MAX), -- JSON string for additional properties
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    UNIQUE(category, value)
);

-- Geographic Data
CREATE TABLE locations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL,
    type NVARCHAR(50) NOT NULL, -- 'city', 'area', 'landmark'
    parent_id UNIQUEIDENTIFIER REFERENCES locations(id),
    state NVARCHAR(100) DEFAULT 'Karnataka',
    country NVARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    pincode NVARCHAR(10),
    is_popular BIT DEFAULT 0,
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Site Configuration
CREATE TABLE site_config (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    key NVARCHAR(100) NOT NULL UNIQUE,
    value NTEXT,
    value_type NVARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description NTEXT,
    is_public BIT DEFAULT 0, -- can be exposed to frontend
    updated_at DATETIME2 DEFAULT GETDATE(),
    updated_by UNIQUEIDENTIFIER
);

-- Media Assets
CREATE TABLE media_assets (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    filename NVARCHAR(255) NOT NULL,
    original_name NVARCHAR(255),
    file_type NVARCHAR(100),
    file_size INT,
    storage_path NVARCHAR(500),
    public_url NVARCHAR(500),
    alt_text NVARCHAR(255),
    caption NTEXT,
    metadata NVARCHAR(MAX), -- JSON string
    uploaded_by UNIQUEIDENTIFIER,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- ==============================================
-- 2. USER MANAGEMENT & AUTHENTICATION
-- ==============================================

-- Users table (main user entity)
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    email NVARCHAR(255) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    password_hash NVARCHAR(255), -- for email auth (when not using external auth)
    role NVARCHAR(50) NOT NULL DEFAULT 'customer' 
        CHECK (role IN ('admin', 'vendor', 'customer', 'event_organizer')),
    avatar_url NVARCHAR(500),
    is_verified BIT DEFAULT 0,
    is_active BIT DEFAULT 1,
    
    -- Vendor specific fields
    vendor_status NVARCHAR(50) CHECK (vendor_status IN ('pending', 'approved', 'rejected')),
    business_name NVARCHAR(255),
    business_type NVARCHAR(50) CHECK (business_type IN ('homestay', 'restaurant', 'driver', 'event_services')),
    business_description NTEXT,
    business_address NTEXT,
    business_license NVARCHAR(255),
    gst_number NVARCHAR(50),
    
    -- Organizer specific fields
    organization_name NVARCHAR(255),
    organization_type NVARCHAR(100),
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    last_login_at DATETIME2
);

-- User Permissions (dynamic role-based access)
CREATE TABLE user_permissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id) ON DELETE CASCADE,
    permission NVARCHAR(100) NOT NULL,
    granted_at DATETIME2 DEFAULT GETDATE(),
    granted_by UNIQUEIDENTIFIER REFERENCES users(id),
    UNIQUE(user_id, permission)
);

-- User Sessions (for JWT management)
CREATE TABLE user_sessions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token NVARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME2 NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    ip_address NVARCHAR(45),
    user_agent NTEXT
);

-- ==============================================
-- 3. SERVICES & BUSINESS LISTINGS
-- ==============================================

-- Services (unified service management)
CREATE TABLE services (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    vendor_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id),
    category_id UNIQUEIDENTIFIER REFERENCES service_categories(id),
    service_type NVARCHAR(50) NOT NULL CHECK (service_type IN ('homestay', 'restaurant', 'driver', 'event_services')),
    name NVARCHAR(255) NOT NULL,
    description NTEXT,
    short_description NVARCHAR(500),
    
    -- Location
    address NTEXT,
    location_id UNIQUEIDENTIFIER REFERENCES locations(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(10,2),
    currency NVARCHAR(10) DEFAULT 'INR',
    
    -- Service specific details (JSON for flexibility)
    service_details NVARCHAR(MAX), -- JSON string
    
    -- Media
    primary_image_id UNIQUEIDENTIFIER REFERENCES media_assets(id),
    gallery_images NVARCHAR(MAX), -- JSON array of media_asset IDs
    
    -- Status and approval
    status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    is_active BIT DEFAULT 1,
    is_featured BIT DEFAULT 0,
    
    -- Ratings and reviews
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    
    -- SEO and metadata
    slug NVARCHAR(255) UNIQUE,
    meta_title NVARCHAR(255),
    meta_description NTEXT,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    approved_at DATETIME2,
    approved_by UNIQUEIDENTIFIER REFERENCES users(id)
);

-- Service Availability
CREATE TABLE service_availability (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    service_id UNIQUEIDENTIFIER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_units INT DEFAULT 1,
    booked_units INT DEFAULT 0,
    price_override DECIMAL(10,2),
    is_blocked BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    UNIQUE (service_id, date)
);

-- Service Features (dynamic amenities/features)
CREATE TABLE service_features (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    service_id UNIQUEIDENTIFIER REFERENCES services(id) ON DELETE CASCADE,
    feature_name NVARCHAR(100) NOT NULL,
    feature_value NVARCHAR(255),
    is_highlighted BIT DEFAULT 0,
    display_order INT DEFAULT 0
);

-- ==============================================
-- 4. BOOKINGS & TRANSACTIONS
-- ==============================================

-- Bookings (unified booking system)
CREATE TABLE bookings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    booking_reference NVARCHAR(50) NOT NULL UNIQUE,
    
    -- Parties involved
    customer_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id),
    vendor_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id),
    service_id UNIQUEIDENTIFIER NOT NULL REFERENCES services(id),
    
    -- Booking details
    service_type NVARCHAR(50) NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    guests INT DEFAULT 1,
    units INT DEFAULT 1,
    
    -- Service specific details (JSON)
    booking_details NVARCHAR(MAX), -- JSON string
    
    -- Contact information
    guest_name NVARCHAR(255) NOT NULL,
    guest_email NVARCHAR(255) NOT NULL,
    guest_phone NVARCHAR(20) NOT NULL,
    special_requests NTEXT,
    
    -- Pricing
    base_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    convenience_fee DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency NVARCHAR(10) DEFAULT 'INR',
    
    -- Payment
    payment_status NVARCHAR(50) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id NVARCHAR(255),
    payment_gateway NVARCHAR(50),
    payment_details NVARCHAR(MAX), -- JSON string
    
    -- Status and lifecycle
    status NVARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    cancellation_reason NTEXT,
    cancelled_by NVARCHAR(50),
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    confirmed_at DATETIME2,
    cancelled_at DATETIME2
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    booking_id UNIQUEIDENTIFIER REFERENCES bookings(id),
    transaction_id NVARCHAR(255) NOT NULL UNIQUE,
    gateway NVARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency NVARCHAR(10) DEFAULT 'INR',
    status NVARCHAR(50) NOT NULL,
    gateway_response NVARCHAR(MAX), -- JSON string
    processed_at DATETIME2 DEFAULT GETDATE()
);

-- ==============================================
-- 5. EVENTS MANAGEMENT
-- ==============================================

-- Events
CREATE TABLE events (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    organizer_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id),
    category_id UNIQUEIDENTIFIER REFERENCES service_categories(id),
    
    -- Basic information
    title NVARCHAR(255) NOT NULL,
    description NTEXT,
    short_description NVARCHAR(500),
    category NVARCHAR(100),
    
    -- Event details
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_hours DECIMAL(4,2),
    
    -- Location
    venue_name NVARCHAR(255),
    venue_address NTEXT,
    location_id UNIQUEIDENTIFIER REFERENCES locations(id),
    
    -- Capacity and pricing
    max_capacity INT DEFAULT 100,
    current_registrations INT DEFAULT 0,
    ticket_price DECIMAL(10,2) DEFAULT 0,
    currency NVARCHAR(10) DEFAULT 'INR',
    
    -- Media
    featured_image_id UNIQUEIDENTIFIER REFERENCES media_assets(id),
    gallery_images NVARCHAR(MAX), -- JSON array
    
    -- Status and approval
    status NVARCHAR(50) DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published', 'cancelled', 'completed')),
    is_featured BIT DEFAULT 0,
    requires_approval BIT DEFAULT 1,
    
    -- SEO
    slug NVARCHAR(255) UNIQUE,
    meta_title NVARCHAR(255),
    meta_description NTEXT,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    published_at DATETIME2,
    approved_at DATETIME2,
    approved_by UNIQUEIDENTIFIER REFERENCES users(id)
);

-- Event Registrations
CREATE TABLE event_registrations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_id UNIQUEIDENTIFIER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id),
    
    -- Registration details
    tickets INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Contact info
    attendee_name NVARCHAR(255) NOT NULL,
    attendee_email NVARCHAR(255) NOT NULL,
    attendee_phone NVARCHAR(20),
    
    -- Payment
    payment_status NVARCHAR(50) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id NVARCHAR(255),
    
    -- Status
    status NVARCHAR(50) DEFAULT 'registered' 
        CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    
    -- Metadata
    registered_at DATETIME2 DEFAULT GETDATE(),
    attended_at DATETIME2,
    cancelled_at DATETIME2,
    
    UNIQUE (event_id, user_id)
);

-- ==============================================
-- 6. REVIEWS & RATINGS
-- ==============================================

-- Reviews
CREATE TABLE reviews (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    
    -- What's being reviewed
    service_id UNIQUEIDENTIFIER REFERENCES services(id),
    event_id UNIQUEIDENTIFIER REFERENCES events(id),
    booking_id UNIQUEIDENTIFIER REFERENCES bookings(id),
    
    -- Who's reviewing
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id),
    reviewer_name NVARCHAR(255) NOT NULL,
    
    -- Review content
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title NVARCHAR(255),
    comment NTEXT,
    
    -- Media
    images NVARCHAR(MAX), -- JSON array of media_asset IDs
    
    -- Status
    status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_verified BIT DEFAULT 0,
    
    -- Vendor response
    vendor_response NTEXT,
    vendor_response_date DATETIME2,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    approved_at DATETIME2,
    
    CHECK ((service_id IS NOT NULL) OR (event_id IS NOT NULL))
);

-- ==============================================
-- 7. ADMIN & SUPPORT
-- ==============================================

-- Vendor Applications
CREATE TABLE vendor_applications (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL REFERENCES users(id),
    
    -- Application details
    business_name NVARCHAR(255) NOT NULL,
    business_type NVARCHAR(50) NOT NULL,
    business_description NTEXT,
    business_address NTEXT,
    location_id UNIQUEIDENTIFIER REFERENCES locations(id),
    
    -- Legal documents
    business_license NVARCHAR(255),
    gst_number NVARCHAR(50),
    pan_number NVARCHAR(20),
    aadhar_number NVARCHAR(20),
    
    -- Contact details
    contact_person NVARCHAR(255),
    contact_phone NVARCHAR(20),
    contact_email NVARCHAR(255),
    
    -- Documents
    documents NVARCHAR(MAX), -- JSON array of media_asset IDs
    
    -- Status and approval
    status NVARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    admin_notes NTEXT,
    rejection_reason NTEXT,
    
    -- Metadata
    submitted_at DATETIME2 DEFAULT GETDATE(),
    reviewed_at DATETIME2,
    reviewed_by UNIQUEIDENTIFIER REFERENCES users(id)
);

-- Support Tickets
CREATE TABLE support_tickets (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ticket_number NVARCHAR(20) NOT NULL UNIQUE,
    
    -- Ticket details
    user_id UNIQUEIDENTIFIER REFERENCES users(id),
    subject NVARCHAR(255) NOT NULL,
    description NTEXT NOT NULL,
    category NVARCHAR(100),
    priority NVARCHAR(20) DEFAULT 'medium' 
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Contact info
    contact_name NVARCHAR(255),
    contact_email NVARCHAR(255),
    contact_phone NVARCHAR(20),
    
    -- Status and assignment
    status NVARCHAR(50) DEFAULT 'open' 
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UNIQUEIDENTIFIER REFERENCES users(id),
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    resolved_at DATETIME2
);

-- Contact Submissions
CREATE TABLE contact_submissions (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    
    -- Contact details
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    subject NVARCHAR(255),
    message NTEXT NOT NULL,
    
    -- Additional info
    user_id UNIQUEIDENTIFIER REFERENCES users(id),
    ip_address NVARCHAR(45),
    user_agent NTEXT,
    
    -- Status
    status NVARCHAR(50) DEFAULT 'new' 
        CHECK (status IN ('new', 'read', 'replied', 'resolved')),
    admin_notes NTEXT,
    
    -- Metadata
    submitted_at DATETIME2 DEFAULT GETDATE(),
    responded_at DATETIME2,
    responded_by UNIQUEIDENTIFIER REFERENCES users(id)
);

-- Feedback
CREATE TABLE feedback (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    
    -- Feedback details
    user_id UNIQUEIDENTIFIER REFERENCES users(id),
    type NVARCHAR(50) DEFAULT 'general' 
        CHECK (type IN ('general', 'bug_report', 'feature_request', 'complaint', 'suggestion')),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    subject NVARCHAR(255),
    message NTEXT NOT NULL,
    
    -- Contact info
    contact_email NVARCHAR(255),
    
    -- Metadata
    submitted_at DATETIME2 DEFAULT GETDATE(),
    is_anonymous BIT DEFAULT 0,
    
    -- Status
    status NVARCHAR(50) DEFAULT 'new' 
        CHECK (status IN ('new', 'reviewed', 'implemented', 'rejected')),
    admin_response NTEXT
);

-- ==============================================
-- 8. ANALYTICS & TRACKING
-- ==============================================

-- Analytics Events
CREATE TABLE analytics_events (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    event_type NVARCHAR(100) NOT NULL, -- 'page_view', 'click', 'search', 'booking_start', etc.
    event_name NVARCHAR(255),
    user_id UNIQUEIDENTIFIER REFERENCES users(id),
    session_id NVARCHAR(255),
    
    -- Event properties
    properties NVARCHAR(MAX), -- JSON string
    
    -- Page/context data
    page_url NVARCHAR(500),
    page_title NVARCHAR(255),
    referrer NVARCHAR(500),
    
    -- Device/browser data
    user_agent NTEXT,
    ip_address NVARCHAR(45),
    device_type NVARCHAR(50),
    browser NVARCHAR(100),
    os NVARCHAR(100),
    
    -- Geographic data
    country NVARCHAR(100),
    city NVARCHAR(100),
    
    -- Timestamp
    created_at DATETIME2 DEFAULT GETDATE()
);

-- ==============================================
-- 9. MARKETING & PROMOTIONS
-- ==============================================

-- Coupons
CREATE TABLE coupons (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    code NVARCHAR(50) NOT NULL UNIQUE,
    title NVARCHAR(255) NOT NULL,
    description NTEXT,
    
    -- Discount details
    discount_type NVARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2),
    min_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Applicability
    applicable_services NVARCHAR(MAX), -- JSON array of service types or IDs
    applicable_users NVARCHAR(MAX), -- JSON array of user IDs or criteria
    
    -- Usage limits
    usage_limit INT,
    usage_limit_per_user INT DEFAULT 1,
    current_usage INT DEFAULT 0,
    
    -- Validity
    valid_from DATETIME2 DEFAULT GETDATE(),
    valid_until DATETIME2,
    
    -- Status
    is_active BIT DEFAULT 1,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    created_by UNIQUEIDENTIFIER REFERENCES users(id)
);

-- ==============================================
-- 10. AUDIT & LOGGING
-- ==============================================

-- Audit Log
CREATE TABLE audit_log (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER REFERENCES users(id),
    action NVARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'approve', etc.
    table_name NVARCHAR(100) NOT NULL,
    record_id UNIQUEIDENTIFIER,
    old_values NVARCHAR(MAX), -- JSON string
    new_values NVARCHAR(MAX), -- JSON string
    ip_address NVARCHAR(45),
    user_agent NTEXT,
    created_at DATETIME2 DEFAULT GETDATE()
);

-- ==============================================
-- 11. INDEXES FOR PERFORMANCE
-- ==============================================

-- Users indexes
CREATE NONCLUSTERED INDEX IX_users_role ON users(role);
CREATE NONCLUSTERED INDEX IX_users_vendor_status ON users(vendor_status);
CREATE NONCLUSTERED INDEX IX_users_email ON users(email);

-- Services indexes
CREATE NONCLUSTERED INDEX IX_services_vendor ON services(vendor_id);
CREATE NONCLUSTERED INDEX IX_services_type ON services(service_type);
CREATE NONCLUSTERED INDEX IX_services_status ON services(status);
CREATE NONCLUSTERED INDEX IX_services_location ON services(location_id);
CREATE NONCLUSTERED INDEX IX_services_featured ON services(is_featured);
CREATE NONCLUSTERED INDEX IX_services_rating ON services(average_rating);

-- Bookings indexes
CREATE NONCLUSTERED INDEX IX_bookings_customer ON bookings(customer_id);
CREATE NONCLUSTERED INDEX IX_bookings_vendor ON bookings(vendor_id);
CREATE NONCLUSTERED INDEX IX_bookings_service ON bookings(service_id);
CREATE NONCLUSTERED INDEX IX_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE NONCLUSTERED INDEX IX_bookings_status ON bookings(status);

-- Events indexes
CREATE NONCLUSTERED INDEX IX_events_organizer ON events(organizer_id);
CREATE NONCLUSTERED INDEX IX_events_date ON events(event_date);
CREATE NONCLUSTERED INDEX IX_events_status ON events(status);
CREATE NONCLUSTERED INDEX IX_events_location ON events(location_id);

-- Analytics indexes
CREATE NONCLUSTERED INDEX IX_analytics_type_date ON analytics_events(event_type, created_at);
CREATE NONCLUSTERED INDEX IX_analytics_user_date ON analytics_events(user_id, created_at);
CREATE NONCLUSTERED INDEX IX_analytics_session ON analytics_events(session_id);

-- ==============================================
-- 12. VIEWS FOR ANALYTICS & REPORTING
-- ==============================================

-- Daily Analytics View
CREATE VIEW daily_analytics AS
SELECT 
    CAST(created_at AS DATE) as date,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events 
GROUP BY CAST(created_at AS DATE), event_type;

-- Weekly Analytics View
CREATE VIEW weekly_analytics AS
SELECT 
    DATEPART(YEAR, created_at) as year,
    DATEPART(WEEK, created_at) as week,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events 
GROUP BY DATEPART(YEAR, created_at), DATEPART(WEEK, created_at), event_type;

-- Service Performance View
CREATE VIEW service_performance AS
SELECT 
    s.id,
    s.name,
    s.service_type,
    s.average_rating,
    s.total_reviews,
    COUNT(b.id) as total_bookings,
    SUM(b.total_amount) as total_revenue,
    AVG(b.total_amount) as avg_booking_value
FROM services s
LEFT JOIN bookings b ON s.id = b.service_id AND b.status = 'completed'
WHERE s.status = 'approved'
GROUP BY s.id, s.name, s.service_type, s.average_rating, s.total_reviews;

-- ==============================================
-- 13. STORED PROCEDURES & FUNCTIONS
-- ==============================================

-- Generate booking reference
CREATE FUNCTION generate_booking_reference()
RETURNS NVARCHAR(50)
AS
BEGIN
    DECLARE @reference NVARCHAR(50);
    SET @reference = 'CC' + FORMAT(GETDATE(), 'yyyyMMdd') + RIGHT('000000' + CAST(DATEPART(SECOND, GETDATE()) * 1000 + DATEPART(MILLISECOND, GETDATE()) AS NVARCHAR), 6);
    RETURN @reference;
END;

-- Update service rating procedure
CREATE PROCEDURE update_service_rating
    @service_id UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @avg_rating DECIMAL(3,2);
    DECLARE @total_reviews INT;
    
    SELECT 
        @avg_rating = ROUND(AVG(CAST(rating AS DECIMAL(3,2))), 2),
        @total_reviews = COUNT(*)
    FROM reviews 
    WHERE service_id = @service_id AND status = 'approved';
    
    UPDATE services 
    SET 
        average_rating = ISNULL(@avg_rating, 0),
        total_reviews = ISNULL(@total_reviews, 0)
    WHERE id = @service_id;
END;

-- User authentication procedure
CREATE PROCEDURE authenticate_user
    @email NVARCHAR(255),
    @password_hash NVARCHAR(255),
    @session_token NVARCHAR(255),
    @ip_address NVARCHAR(45),
    @user_agent NTEXT
AS
BEGIN
    DECLARE @user_id UNIQUEIDENTIFIER;
    DECLARE @expires_at DATETIME2 = DATEADD(DAY, 30, GETDATE());
    
    -- Verify user credentials
    SELECT @user_id = id 
    FROM users 
    WHERE email = @email 
        AND password_hash = @password_hash 
        AND is_active = 1;
    
    IF @user_id IS NOT NULL
    BEGIN
        -- Update last login
        UPDATE users SET last_login_at = GETDATE() WHERE id = @user_id;
        
        -- Create session
        INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
        VALUES (@user_id, @session_token, @expires_at, @ip_address, @user_agent);
        
        -- Return user data
        SELECT id, email, name, role, avatar_url 
        FROM users 
        WHERE id = @user_id;
    END
    ELSE
    BEGIN
        -- Authentication failed
        SELECT NULL as id;
    END
END;

-- ==============================================
-- 14. TRIGGERS
-- ==============================================

-- Trigger to update updated_at column
CREATE TRIGGER tr_update_timestamp_users ON users
AFTER UPDATE
AS
BEGIN
    UPDATE users 
    SET updated_at = GETDATE()
    FROM users u
    INNER JOIN inserted i ON u.id = i.id;
END;

CREATE TRIGGER tr_update_timestamp_services ON services
AFTER UPDATE
AS
BEGIN
    UPDATE services 
    SET updated_at = GETDATE()
    FROM services s
    INNER JOIN inserted i ON s.id = i.id;
END;

CREATE TRIGGER tr_update_timestamp_bookings ON bookings
AFTER UPDATE
AS
BEGIN
    UPDATE bookings 
    SET updated_at = GETDATE()
    FROM bookings b
    INNER JOIN inserted i ON b.id = i.id;
END;

CREATE TRIGGER tr_update_timestamp_events ON events
AFTER UPDATE
AS
BEGIN
    UPDATE events 
    SET updated_at = GETDATE()
    FROM events e
    INNER JOIN inserted i ON e.id = i.id;
END;

-- Trigger to generate booking reference
CREATE TRIGGER tr_generate_booking_reference ON bookings
AFTER INSERT
AS
BEGIN
    UPDATE bookings 
    SET booking_reference = dbo.generate_booking_reference()
    FROM bookings b
    INNER JOIN inserted i ON b.id = i.id
    WHERE b.booking_reference IS NULL;
END;

-- Trigger to update service rating when review is added/updated
CREATE TRIGGER tr_update_service_rating ON reviews
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE review_cursor CURSOR FOR
    SELECT DISTINCT service_id 
    FROM inserted 
    WHERE service_id IS NOT NULL;
    
    DECLARE @service_id UNIQUEIDENTIFIER;
    
    OPEN review_cursor;
    FETCH NEXT FROM review_cursor INTO @service_id;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        EXEC update_service_rating @service_id;
        FETCH NEXT FROM review_cursor INTO @service_id;
    END;
    
    CLOSE review_cursor;
    DEALLOCATE review_cursor;
END;

-- ==============================================
-- 15. INITIAL DATA SETUP
-- ==============================================

-- Insert initial configuration
INSERT INTO site_config (key, value, value_type, description, is_public) VALUES
    ('site_name', 'CoastalConnect', 'string', 'Site name', 1),
    ('site_tagline', 'Your Gateway to Coastal Karnataka', 'string', 'Site tagline', 1),
    ('contact_email', 'admin@coastalconnect.in', 'string', 'Primary contact email', 1),
    ('contact_phone', '8105003858', 'string', 'Primary contact phone', 1),
    ('booking_fee_percentage', '5', 'number', 'Booking convenience fee percentage', 0),
    ('payment_gateways', '["razorpay", "stripe"]', 'json', 'Available payment gateways', 0),
    ('max_upload_size', '10485760', 'number', 'Maximum file upload size in bytes', 0);

-- Insert service categories
INSERT INTO service_categories (name, slug, icon, color, description, display_order) VALUES
    ('Hotels, Resorts & Homestays', 'hotels-resorts-homestays', 'hotel', '#E91E63', 'Accommodation services', 1),
    ('Restaurants & Cafes', 'restaurants-cafes', 'restaurant', '#FF9800', 'Dining and food services', 2),
    ('Transportation', 'transportation', 'car', '#2196F3', 'Cab and transport services', 3),
    ('Event Services', 'event-services', 'event', '#9C27B0', 'Event planning and management', 4),
    ('Photography', 'photography', 'camera', '#607D8B', 'Professional photography services', 5),
    ('Wellness & Spa', 'wellness-spa', 'spa', '#4CAF50', 'Health and wellness services', 6),
    ('Beach Activities', 'beach-activities', 'beach', '#00BCD4', 'Water sports and beach activities', 7),
    ('Cultural Tours', 'cultural-tours', 'temple', '#795548', 'Heritage and cultural experiences', 8);

-- Insert popular locations
INSERT INTO locations (name, type, state, country, is_popular, display_order) VALUES
    ('Udupi', 'city', 'Karnataka', 'India', 1, 1),
    ('Manipal', 'city', 'Karnataka', 'India', 1, 2),
    ('Malpe', 'area', 'Karnataka', 'India', 1, 3),
    ('Kaup', 'area', 'Karnataka', 'India', 1, 4),
    ('Kundapur', 'city', 'Karnataka', 'India', 1, 5),
    ('Hebri', 'area', 'Karnataka', 'India', 1, 6);

-- Insert dropdown options
INSERT INTO dropdown_options (category, label, value, display_order) VALUES
    ('event_categories', 'Cultural Festival', 'cultural', 1),
    ('event_categories', 'Religious Ceremony', 'religious', 2),
    ('event_categories', 'Educational Workshop', 'educational', 3),
    ('event_categories', 'Sports Tournament', 'sports', 4),
    ('event_categories', 'Entertainment Show', 'entertainment', 5),
    ('event_categories', 'Business Conference', 'business', 6),
    ('cuisines', 'South Indian', 'south_indian', 1),
    ('cuisines', 'North Indian', 'north_indian', 2),
    ('cuisines', 'Chinese', 'chinese', 3),
    ('cuisines', 'Continental', 'continental', 4),
    ('cuisines', 'Coastal Karnataka', 'coastal_karnataka', 5),
    ('vehicle_types', 'Sedan', 'sedan', 1),
    ('vehicle_types', 'SUV', 'suv', 2),
    ('vehicle_types', 'Hatchback', 'hatchback', 3),
    ('vehicle_types', 'Auto Rickshaw', 'auto', 4),
    ('vehicle_types', 'Bike', 'bike', 5);

-- Create initial admin user
INSERT INTO users (email, name, role, is_verified, is_active)
VALUES ('admin@coastalconnect.in', 'CoastalConnect Admin', 'admin', 1, 1);

PRINT 'CoastalConnect SQL Server database schema created successfully!';
