-- CoastalConnect Complete Database Schema
-- This script creates all necessary tables for a fully functional platform

-- Drop existing tables if they exist (in reverse order of dependencies)
IF EXISTS (SELECT * FROM sysobjects WHERE name='EventRegistrations' AND xtype='U') DROP TABLE EventRegistrations;
IF EXISTS (SELECT * FROM sysobjects WHERE name='BookingPayments' AND xtype='U') DROP TABLE BookingPayments;
IF EXISTS (SELECT * FROM sysobjects WHERE name='Reviews' AND xtype='U') DROP TABLE Reviews;
IF EXISTS (SELECT * FROM sysobjects WHERE name='Bookings' AND xtype='U') DROP TABLE Bookings;
IF EXISTS (SELECT * FROM sysobjects WHERE name='Events' AND xtype='U') DROP TABLE Events;
IF EXISTS (SELECT * FROM sysobjects WHERE name='ServiceAvailability' AND xtype='U') DROP TABLE ServiceAvailability;
IF EXISTS (SELECT * FROM sysobjects WHERE name='Services' AND xtype='U') DROP TABLE Services;
IF EXISTS (SELECT * FROM sysobjects WHERE name='VendorApplications' AND xtype='U') DROP TABLE VendorApplications;
IF EXISTS (SELECT * FROM sysobjects WHERE name='ContactSubmissions' AND xtype='U') DROP TABLE ContactSubmissions;
IF EXISTS (SELECT * FROM sysobjects WHERE name='SupportTickets' AND xtype='U') DROP TABLE SupportTickets;
IF EXISTS (SELECT * FROM sysobjects WHERE name='Feedback' AND xtype='U') DROP TABLE Feedback;
IF EXISTS (SELECT * FROM sysobjects WHERE name='Coupons' AND xtype='U') DROP TABLE Coupons;
IF EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U') DROP TABLE Users;

-- 1. USERS TABLE (Enhanced with role-based system)
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    password_hash NVARCHAR(255), -- for email auth
    provider NVARCHAR(50) NOT NULL DEFAULT 'email', -- email, google, apple
    provider_id NVARCHAR(255),
    role NVARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'vendor', 'customer', 'event_organizer')),
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
    last_login_at DATETIME2,
    
    -- Indexes
    INDEX IX_Users_Email (email),
    INDEX IX_Users_Role (role),
    INDEX IX_Users_VendorStatus (vendor_status),
    INDEX IX_Users_BusinessType (business_type)
);

-- 2. SERVICES TABLE (Replaces separate homestays, restaurants, drivers)
CREATE TABLE Services (
    id INT IDENTITY(1,1) PRIMARY KEY,
    vendor_id INT NOT NULL,
    service_type NVARCHAR(50) NOT NULL CHECK (service_type IN ('homestay', 'restaurant', 'driver', 'event_services')),
    name NVARCHAR(255) NOT NULL,
    description NTEXT,
    short_description NVARCHAR(500),
    
    -- Location
    address NTEXT,
    city NVARCHAR(100),
    state NVARCHAR(100) DEFAULT 'Karnataka',
    country NVARCHAR(100) DEFAULT 'India',
    pincode NVARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(10,2), -- per night, per person, per km
    currency NVARCHAR(10) DEFAULT 'INR',
    
    -- Service specific details (JSON for flexibility)
    service_details NTEXT, -- JSON: {rooms, amenities, cuisine_type, vehicle_type, etc.}
    
    -- Media
    primary_image NVARCHAR(500),
    image_gallery NTEXT, -- JSON array of image URLs
    
    -- Status and approval
    status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    is_active BIT DEFAULT 1,
    is_featured BIT DEFAULT 0,
    
    -- Ratings and reviews
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    approved_at DATETIME2,
    approved_by INT,
    
    -- Foreign keys
    FOREIGN KEY (vendor_id) REFERENCES Users(id),
    FOREIGN KEY (approved_by) REFERENCES Users(id),
    
    -- Indexes
    INDEX IX_Services_VendorId (vendor_id),
    INDEX IX_Services_Type (service_type),
    INDEX IX_Services_Status (status),
    INDEX IX_Services_City (city),
    INDEX IX_Services_Rating (average_rating),
    INDEX IX_Services_Featured (is_featured)
);

-- 3. SERVICE AVAILABILITY TABLE
CREATE TABLE ServiceAvailability (
    id INT IDENTITY(1,1) PRIMARY KEY,
    service_id INT NOT NULL,
    date DATE NOT NULL,
    available_units INT DEFAULT 1, -- rooms, tables, vehicles
    booked_units INT DEFAULT 0,
    price_override DECIMAL(10,2), -- special pricing for specific dates
    is_blocked BIT DEFAULT 0, -- manually blocked by vendor
    created_at DATETIME2 DEFAULT GETDATE(),
    
    FOREIGN KEY (service_id) REFERENCES Services(id),
    UNIQUE (service_id, date),
    INDEX IX_Availability_ServiceDate (service_id, date)
);

-- 4. BOOKINGS TABLE (Unified booking system)
CREATE TABLE Bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_reference NVARCHAR(50) NOT NULL UNIQUE,
    
    -- Parties involved
    customer_id INT NOT NULL,
    vendor_id INT NOT NULL,
    service_id INT NOT NULL,
    
    -- Booking details
    service_type NVARCHAR(50) NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    guests INT DEFAULT 1,
    units INT DEFAULT 1, -- rooms, tables, vehicles
    
    -- Service specific details (JSON)
    booking_details NTEXT, -- JSON: pickup/dropoff, special requests, etc.
    
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
    payment_status NVARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id NVARCHAR(255),
    payment_gateway NVARCHAR(50),
    
    -- Status and lifecycle
    status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    cancellation_reason NTEXT,
    cancelled_by NVARCHAR(50), -- customer, vendor, admin
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    confirmed_at DATETIME2,
    cancelled_at DATETIME2,
    
    -- Foreign keys
    FOREIGN KEY (customer_id) REFERENCES Users(id),
    FOREIGN KEY (vendor_id) REFERENCES Users(id),
    FOREIGN KEY (service_id) REFERENCES Services(id),
    
    -- Indexes
    INDEX IX_Bookings_Reference (booking_reference),
    INDEX IX_Bookings_Customer (customer_id),
    INDEX IX_Bookings_Vendor (vendor_id),
    INDEX IX_Bookings_Service (service_id),
    INDEX IX_Bookings_Status (status),
    INDEX IX_Bookings_PaymentStatus (payment_status),
    INDEX IX_Bookings_Dates (check_in_date, check_out_date)
);

-- 5. EVENTS TABLE
CREATE TABLE Events (
    id INT IDENTITY(1,1) PRIMARY KEY,
    organizer_id INT NOT NULL,
    
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
    city NVARCHAR(100),
    state NVARCHAR(100) DEFAULT 'Karnataka',
    
    -- Capacity and pricing
    max_capacity INT DEFAULT 100,
    current_registrations INT DEFAULT 0,
    ticket_price DECIMAL(10,2) DEFAULT 0,
    currency NVARCHAR(10) DEFAULT 'INR',
    
    -- Media
    featured_image NVARCHAR(500),
    image_gallery NTEXT, -- JSON array
    
    -- Status and approval
    status NVARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published', 'cancelled', 'completed')),
    is_featured BIT DEFAULT 0,
    requires_approval BIT DEFAULT 1,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    published_at DATETIME2,
    approved_at DATETIME2,
    approved_by INT,
    
    -- Foreign keys
    FOREIGN KEY (organizer_id) REFERENCES Users(id),
    FOREIGN KEY (approved_by) REFERENCES Users(id),
    
    -- Indexes
    INDEX IX_Events_Organizer (organizer_id),
    INDEX IX_Events_Status (status),
    INDEX IX_Events_Date (event_date),
    INDEX IX_Events_City (city),
    INDEX IX_Events_Featured (is_featured)
);

-- 6. EVENT REGISTRATIONS TABLE
CREATE TABLE EventRegistrations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    
    -- Registration details
    tickets INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Contact info (can differ from user profile)
    attendee_name NVARCHAR(255) NOT NULL,
    attendee_email NVARCHAR(255) NOT NULL,
    attendee_phone NVARCHAR(20),
    
    -- Payment
    payment_status NVARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id NVARCHAR(255),
    
    -- Status
    status NVARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    
    -- Metadata
    registered_at DATETIME2 DEFAULT GETDATE(),
    attended_at DATETIME2,
    cancelled_at DATETIME2,
    
    -- Foreign keys
    FOREIGN KEY (event_id) REFERENCES Events(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    
    -- Unique constraint
    UNIQUE (event_id, user_id),
    
    -- Indexes
    INDEX IX_EventRegistrations_Event (event_id),
    INDEX IX_EventRegistrations_User (user_id),
    INDEX IX_EventRegistrations_Status (status)
);

-- 7. REVIEWS TABLE
CREATE TABLE Reviews (
    id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- What's being reviewed
    service_id INT,
    event_id INT,
    booking_id INT,
    
    -- Who's reviewing
    user_id INT NOT NULL,
    reviewer_name NVARCHAR(255) NOT NULL,
    
    -- Review content
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title NVARCHAR(255),
    comment NTEXT,
    
    -- Media
    images NTEXT, -- JSON array of image URLs
    
    -- Status
    status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_verified BIT DEFAULT 0, -- verified purchase/attendance
    
    -- Vendor response
    vendor_response NTEXT,
    vendor_response_date DATETIME2,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    approved_at DATETIME2,
    
    -- Foreign keys
    FOREIGN KEY (service_id) REFERENCES Services(id),
    FOREIGN KEY (event_id) REFERENCES Events(id),
    FOREIGN KEY (booking_id) REFERENCES Bookings(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    
    -- Constraints
    CHECK ((service_id IS NOT NULL) OR (event_id IS NOT NULL)),
    
    -- Indexes
    INDEX IX_Reviews_Service (service_id),
    INDEX IX_Reviews_Event (event_id),
    INDEX IX_Reviews_User (user_id),
    INDEX IX_Reviews_Rating (rating),
    INDEX IX_Reviews_Status (status)
);

-- 8. COUPONS TABLE
CREATE TABLE Coupons (
    id INT IDENTITY(1,1) PRIMARY KEY,
    code NVARCHAR(50) NOT NULL UNIQUE,
    title NVARCHAR(255) NOT NULL,
    description NTEXT,
    
    -- Discount details
    discount_type NVARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2), -- for percentage discounts
    min_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Applicability
    applicable_services NTEXT, -- JSON array of service types
    applicable_users NTEXT, -- JSON array of user IDs or 'all'
    
    -- Usage limits
    usage_limit INT, -- total usage limit
    usage_limit_per_user INT DEFAULT 1,
    current_usage INT DEFAULT 0,
    
    -- Validity
    valid_from DATETIME2 DEFAULT GETDATE(),
    valid_until DATETIME2,
    
    -- Status
    is_active BIT DEFAULT 1,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    created_by INT,
    
    -- Foreign keys
    FOREIGN KEY (created_by) REFERENCES Users(id),
    
    -- Indexes
    INDEX IX_Coupons_Code (code),
    INDEX IX_Coupons_Active (is_active),
    INDEX IX_Coupons_Validity (valid_from, valid_until)
);

-- 9. VENDOR APPLICATIONS TABLE
CREATE TABLE VendorApplications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- Application details
    business_name NVARCHAR(255) NOT NULL,
    business_type NVARCHAR(50) NOT NULL CHECK (business_type IN ('homestay', 'restaurant', 'driver', 'event_services')),
    business_description NTEXT,
    business_address NTEXT,
    city NVARCHAR(100),
    state NVARCHAR(100) DEFAULT 'Karnataka',
    
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
    documents NTEXT, -- JSON array of document URLs
    
    -- Status and approval
    status NVARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    admin_notes NTEXT,
    rejection_reason NTEXT,
    
    -- Metadata
    submitted_at DATETIME2 DEFAULT GETDATE(),
    reviewed_at DATETIME2,
    reviewed_by INT,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (reviewed_by) REFERENCES Users(id),
    
    -- Indexes
    INDEX IX_VendorApplications_User (user_id),
    INDEX IX_VendorApplications_Status (status),
    INDEX IX_VendorApplications_BusinessType (business_type)
);

-- 10. SUPPORT TICKETS TABLE
CREATE TABLE SupportTickets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ticket_number NVARCHAR(20) NOT NULL UNIQUE,
    
    -- Ticket details
    user_id INT,
    subject NVARCHAR(255) NOT NULL,
    description NTEXT NOT NULL,
    category NVARCHAR(100),
    priority NVARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Contact info (for non-logged-in users)
    contact_name NVARCHAR(255),
    contact_email NVARCHAR(255),
    contact_phone NVARCHAR(20),
    
    -- Status and assignment
    status NVARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to INT,
    
    -- Metadata
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    resolved_at DATETIME2,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (assigned_to) REFERENCES Users(id),
    
    -- Indexes
    INDEX IX_SupportTickets_Number (ticket_number),
    INDEX IX_SupportTickets_User (user_id),
    INDEX IX_SupportTickets_Status (status),
    INDEX IX_SupportTickets_Priority (priority)
);

-- 11. CONTACT SUBMISSIONS TABLE
CREATE TABLE ContactSubmissions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Contact details
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    subject NVARCHAR(255),
    message NTEXT NOT NULL,
    
    -- Additional info
    user_id INT, -- if logged in
    ip_address NVARCHAR(45),
    user_agent NTEXT,
    
    -- Status
    status NVARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved')),
    admin_notes NTEXT,
    
    -- Metadata
    submitted_at DATETIME2 DEFAULT GETDATE(),
    responded_at DATETIME2,
    responded_by INT,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (responded_by) REFERENCES Users(id),
    
    -- Indexes
    INDEX IX_ContactSubmissions_Email (email),
    INDEX IX_ContactSubmissions_Status (status),
    INDEX IX_ContactSubmissions_Date (submitted_at)
);

-- 12. FEEDBACK TABLE
CREATE TABLE Feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Feedback details
    user_id INT,
    type NVARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'bug_report', 'feature_request', 'complaint', 'suggestion')),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    subject NVARCHAR(255),
    message NTEXT NOT NULL,
    
    -- Contact info (for anonymous feedback)
    contact_email NVARCHAR(255),
    
    -- Metadata
    submitted_at DATETIME2 DEFAULT GETDATE(),
    is_anonymous BIT DEFAULT 0,
    
    -- Status
    status NVARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'implemented', 'rejected')),
    admin_response NTEXT,
    
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES Users(id),
    
    -- Indexes
    INDEX IX_Feedback_User (user_id),
    INDEX IX_Feedback_Type (type),
    INDEX IX_Feedback_Rating (rating),
    INDEX IX_Feedback_Status (status)
);

-- Insert initial admin user
INSERT INTO Users (email, name, role, password_hash, is_verified, is_active)
VALUES ('admin@coastalconnect.in', 'CoastalConnect Admin', 'admin', NULL, 1, 1);

-- Insert sample data for testing
INSERT INTO Users (email, name, phone, role, is_verified, is_active)
VALUES 
    ('aral21@example.com', 'Aral Demo User', '+91-9876543210', 'customer', 1, 1),
    ('vendor@example.com', 'Demo Vendor', '+91-9876543211', 'vendor', 1, 1),
    ('organizer@example.com', 'Demo Organizer', '+91-9876543212', 'event_organizer', 1, 1);

-- Insert sample services
INSERT INTO Services (vendor_id, service_type, name, description, address, city, base_price, service_details, status, average_rating, total_reviews)
VALUES 
    (2, 'homestay', 'Coastal Paradise Villa', 'Beautiful beachside villa with modern amenities', 'Malpe Beach Road, Udupi', 'Udupi', 3500.00, '{"rooms": 3, "amenities": ["WiFi", "AC", "Parking", "Beach Access"]}', 'approved', 4.5, 23),
    (2, 'restaurant', 'Sea Breeze Restaurant', 'Authentic coastal Karnataka cuisine', 'Temple Street, Udupi', 'Udupi', 500.00, '{"cuisine": "South Indian", "seating": 50}', 'approved', 4.2, 15),
    (2, 'driver', 'Udupi Tour Services', 'Professional driver services for local tours', 'Car Street, Udupi', 'Udupi', 2000.00, '{"vehicle_type": "SUV", "capacity": 7}', 'approved', 4.8, 8);

-- Insert sample events
INSERT INTO Events (organizer_id, title, description, event_date, start_time, venue_name, venue_address, city, max_capacity, ticket_price, status)
VALUES 
    (3, 'Udupi Cultural Festival', 'Annual cultural festival showcasing local arts and traditions', '2024-02-15', '18:00', 'Udupi Town Hall', 'Town Hall Road, Udupi', 'Udupi', 200, 100.00, 'published'),
    (3, 'Beach Cleanup Drive', 'Community beach cleanup and environmental awareness event', '2024-02-20', '07:00', 'Malpe Beach', 'Malpe Beach, Udupi', 'Udupi', 100, 0.00, 'published');

PRINT 'CoastalConnect database schema created successfully with sample data!';
