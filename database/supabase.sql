-- CoastalConnect Supabase/PostgreSQL Database Schema
-- Production-Ready Schema with RLS, Storage, Analytics, and Dynamic Configuration
-- Compatible with role-based authentication and full database-driven architecture

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ==============================================
-- 1. CONFIGURATION TABLES (Dynamic Data Sources)
-- ==============================================

-- Service Categories (replaces hardcoded navigation)
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100), -- icon class or URL
    color VARCHAR(7), -- hex color
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    parent_id UUID REFERENCES service_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dropdown Options (dynamic form choices)
CREATE TABLE dropdown_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL, -- 'event_categories', 'cities', 'cuisines', etc.
    label VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    metadata JSONB, -- additional properties
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, value)
);

-- Geographic Data
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'city', 'area', 'landmark'
    parent_id UUID REFERENCES locations(id),
    state VARCHAR(100) DEFAULT 'Karnataka',
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    pincode VARCHAR(10),
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Configuration
CREATE TABLE site_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    value_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- can be exposed to frontend
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID
);

-- Media Assets
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size INTEGER,
    storage_path VARCHAR(500),
    public_url VARCHAR(500),
    alt_text VARCHAR(255),
    caption TEXT,
    metadata JSONB,
    uploaded_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. USER MANAGEMENT & AUTHENTICATION
-- ==============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'customer' 
        CHECK (role IN ('admin', 'vendor', 'customer', 'event_organizer')),
    avatar_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Vendor specific fields
    vendor_status VARCHAR(50) CHECK (vendor_status IN ('pending', 'approved', 'rejected')),
    business_name VARCHAR(255),
    business_type VARCHAR(50) CHECK (business_type IN ('homestay', 'restaurant', 'driver', 'event_services')),
    business_description TEXT,
    business_address TEXT,
    business_license VARCHAR(255),
    gst_number VARCHAR(50),
    
    -- Organizer specific fields
    organization_name VARCHAR(255),
    organization_type VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- User Permissions (dynamic role-based access)
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    UNIQUE(user_id, permission)
);

-- ==============================================
-- 3. SERVICES & BUSINESS LISTINGS
-- ==============================================

-- Services (unified service management)
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES service_categories(id),
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('homestay', 'restaurant', 'driver', 'event_services')),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Location
    address TEXT,
    location_id UUID REFERENCES locations(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    price_per_unit DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Service specific details (JSON for flexibility)
    service_details JSONB,
    
    -- Media
    primary_image_id UUID REFERENCES media_assets(id),
    gallery_images UUID[], -- array of media_asset IDs
    
    -- Status and approval
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Ratings and reviews
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- SEO and metadata
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id)
);

-- Service Availability
CREATE TABLE service_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_units INTEGER DEFAULT 1,
    booked_units INTEGER DEFAULT 0,
    price_override DECIMAL(10,2),
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (service_id, date)
);

-- Service Features (dynamic amenities/features)
CREATE TABLE service_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_value VARCHAR(255),
    is_highlighted BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0
);

-- ==============================================
-- 4. BOOKINGS & TRANSACTIONS
-- ==============================================

-- Bookings (unified booking system)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    
    -- Parties involved
    customer_id UUID NOT NULL REFERENCES users(id),
    vendor_id UUID NOT NULL REFERENCES users(id),
    service_id UUID NOT NULL REFERENCES services(id),
    
    -- Booking details
    service_type VARCHAR(50) NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    guests INTEGER DEFAULT 1,
    units INTEGER DEFAULT 1,
    
    -- Service specific details (JSON)
    booking_details JSONB,
    
    -- Contact information
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    special_requests TEXT,
    
    -- Pricing
    base_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    convenience_fee DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id VARCHAR(255),
    payment_gateway VARCHAR(50),
    payment_details JSONB,
    
    -- Status and lifecycle
    status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    cancellation_reason TEXT,
    cancelled_by VARCHAR(50),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    gateway VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL,
    gateway_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. EVENTS MANAGEMENT
-- ==============================================

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES service_categories(id),
    
    -- Basic information
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    category VARCHAR(100),
    
    -- Event details
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_hours DECIMAL(4,2),
    
    -- Location
    venue_name VARCHAR(255),
    venue_address TEXT,
    location_id UUID REFERENCES locations(id),
    
    -- Capacity and pricing
    max_capacity INTEGER DEFAULT 100,
    current_registrations INTEGER DEFAULT 0,
    ticket_price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'INR',
    
    -- Media
    featured_image_id UUID REFERENCES media_assets(id),
    gallery_images UUID[],
    
    -- Status and approval
    status VARCHAR(50) DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'published', 'cancelled', 'completed')),
    is_featured BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT true,
    
    -- SEO
    slug VARCHAR(255) UNIQUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id)
);

-- Event Registrations
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Registration details
    tickets INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Contact info
    attendee_name VARCHAR(255) NOT NULL,
    attendee_email VARCHAR(255) NOT NULL,
    attendee_phone VARCHAR(20),
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'registered' 
        CHECK (status IN ('registered', 'attended', 'no_show', 'cancelled')),
    
    -- Metadata
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attended_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE (event_id, user_id)
);

-- ==============================================
-- 6. REVIEWS & RATINGS
-- ==============================================

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- What's being reviewed
    service_id UUID REFERENCES services(id),
    event_id UUID REFERENCES events(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Who's reviewing
    user_id UUID NOT NULL REFERENCES users(id),
    reviewer_name VARCHAR(255) NOT NULL,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    
    -- Media
    images UUID[], -- array of media_asset IDs
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_verified BOOLEAN DEFAULT false,
    
    -- Vendor response
    vendor_response TEXT,
    vendor_response_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    CHECK ((service_id IS NOT NULL) OR (event_id IS NOT NULL))
);

-- ==============================================
-- 7. ADMIN & SUPPORT
-- ==============================================

-- Vendor Applications
CREATE TABLE vendor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Application details
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    business_description TEXT,
    business_address TEXT,
    location_id UUID REFERENCES locations(id),
    
    -- Legal documents
    business_license VARCHAR(255),
    gst_number VARCHAR(50),
    pan_number VARCHAR(20),
    aadhar_number VARCHAR(20),
    
    -- Contact details
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Documents
    documents UUID[], -- array of media_asset IDs
    
    -- Status and approval
    status VARCHAR(50) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id)
);

-- Support Tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    
    -- Ticket details
    user_id UUID REFERENCES users(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium' 
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Contact info
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Status and assignment
    status VARCHAR(50) DEFAULT 'open' 
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Contact Submissions
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact details
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    
    -- Additional info
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'new' 
        CHECK (status IN ('new', 'read', 'replied', 'resolved')),
    admin_notes TEXT,
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES users(id)
);

-- Feedback
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Feedback details
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) DEFAULT 'general' 
        CHECK (type IN ('general', 'bug_report', 'feature_request', 'complaint', 'suggestion')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    
    -- Contact info
    contact_email VARCHAR(255),
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Status
    status VARCHAR(50) DEFAULT 'new' 
        CHECK (status IN ('new', 'reviewed', 'implemented', 'rejected')),
    admin_response TEXT
);

-- ==============================================
-- 8. ANALYTICS & TRACKING
-- ==============================================

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- 'page_view', 'click', 'search', 'booking_start', etc.
    event_name VARCHAR(255),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    
    -- Event properties
    properties JSONB,
    
    -- Page/context data
    page_url VARCHAR(500),
    page_title VARCHAR(255),
    referrer VARCHAR(500),
    
    -- Device/browser data
    user_agent TEXT,
    ip_address INET,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    
    -- Geographic data
    country VARCHAR(100),
    city VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materialized view for daily analytics
CREATE MATERIALIZED VIEW daily_analytics AS
SELECT 
    date_trunc('day', created_at) as date,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events 
GROUP BY date_trunc('day', created_at), event_type
ORDER BY date DESC, event_type;

-- Weekly analytics view
CREATE MATERIALIZED VIEW weekly_analytics AS
SELECT 
    date_trunc('week', created_at) as week,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events 
GROUP BY date_trunc('week', created_at), event_type
ORDER BY week DESC, event_type;

-- ==============================================
-- 9. MARKETING & PROMOTIONS
-- ==============================================

-- Coupons
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Discount details
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2),
    min_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Applicability
    applicable_services JSONB, -- array of service types or IDs
    applicable_users JSONB, -- array of user IDs or criteria
    
    -- Usage limits
    usage_limit INTEGER,
    usage_limit_per_user INTEGER DEFAULT 1,
    current_usage INTEGER DEFAULT 0,
    
    -- Validity
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- ==============================================
-- 10. AUDIT & LOGGING
-- ==============================================

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'approve', etc.
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 11. INDEXES FOR PERFORMANCE
-- ==============================================

-- Users indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_vendor_status ON users(vendor_status);
CREATE INDEX idx_users_email ON users(email);

-- Services indexes
CREATE INDEX idx_services_vendor ON services(vendor_id);
CREATE INDEX idx_services_type ON services(service_type);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_location ON services(location_id);
CREATE INDEX idx_services_featured ON services(is_featured);
CREATE INDEX idx_services_rating ON services(average_rating);

-- Bookings indexes
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Events indexes
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location ON events(location_id);

-- Analytics indexes
CREATE INDEX idx_analytics_type_date ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_user_date ON analytics_events(user_id, created_at);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

-- ==============================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Services policies
CREATE POLICY "Anyone can view approved services" ON services
    FOR SELECT USING (status = 'approved' AND is_active = true);

CREATE POLICY "Vendors can manage their own services" ON services
    FOR ALL USING (vendor_id = auth.uid());

CREATE POLICY "Admins can manage all services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (
        customer_id = auth.uid() OR vendor_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Customers can create bookings" ON bookings
    FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Vendors and customers can update their bookings" ON bookings
    FOR UPDATE USING (
        customer_id = auth.uid() OR vendor_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Events policies
CREATE POLICY "Anyone can view published events" ON events
    FOR SELECT USING (status = 'published');

CREATE POLICY "Organizers can manage their own events" ON events
    FOR ALL USING (organizer_id = auth.uid());

CREATE POLICY "Admins can manage all events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create reviews for their bookings" ON reviews
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        (booking_id IS NULL OR EXISTS (
            SELECT 1 FROM bookings 
            WHERE id = booking_id AND customer_id = auth.uid()
        ))
    );

-- Analytics policies (admins only)
CREATE POLICY "Admins can view analytics" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Anyone can insert analytics events" ON analytics_events
    FOR INSERT WITH CHECK (true);

-- ==============================================
-- 13. STORAGE BUCKETS
-- ==============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('service-images', 'service-images', true),
    ('event-images', 'event-images', true),
    ('user-avatars', 'user-avatars', true),
    ('documents', 'documents', false),
    ('review-images', 'review-images', true);

-- Storage policies
CREATE POLICY "Public can view service images" ON storage.objects
    FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Vendors can upload service images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'service-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Public can view event images" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Event organizers can upload event images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'event-images' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can manage their avatars" ON storage.objects
    FOR ALL USING (
        bucket_id = 'user-avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND
        auth.role() = 'authenticated'
    );

-- ==============================================
-- 13. ADDITIONAL CONTENT TABLES
-- ==============================================

-- Festivals Table (for dedicated festival content)
CREATE TABLE festivals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,

    -- Timing
    festival_date DATE,
    festival_month INTEGER, -- for recurring festivals
    duration_days INTEGER DEFAULT 1,
    recurring_annually BOOLEAN DEFAULT true,

    -- Location
    location_id UUID REFERENCES locations(id),
    venue VARCHAR(255),
    venue_address TEXT,

    -- Festival details
    category VARCHAR(100), -- religious, cultural, traditional, modern
    significance TEXT,
    rituals TEXT,
    special_foods TEXT,

    -- Media
    primary_image_url VARCHAR(500),
    gallery_images TEXT[], -- array of image URLs

    -- Features
    is_major_festival BOOLEAN DEFAULT false,
    is_unesco_recognized BOOLEAN DEFAULT false,
    tourist_friendly BOOLEAN DEFAULT true,

    -- SEO and metadata
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[],

    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visit Guide Content Table
CREATE TABLE visit_guide_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section VARCHAR(100) NOT NULL, -- 'seasons', 'festivals', 'cuisine', 'attractions', 'cultural_insights'
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    content TEXT NOT NULL,

    -- Media
    primary_image_url VARCHAR(500),
    images TEXT[], -- array of image URLs

    -- Metadata
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    season VARCHAR(50), -- for seasonal content
    month INTEGER, -- for month-specific content

    -- SEO
    slug VARCHAR(255),
    tags TEXT[],

    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cultural Attractions Table
CREATE TABLE cultural_attractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,

    -- Location
    location_id UUID REFERENCES locations(id),
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    -- Details
    category VARCHAR(100), -- temple, beach, historical, natural, museum
    established_year INTEGER,
    opening_hours VARCHAR(255),
    entry_fee VARCHAR(100),
    best_time_to_visit VARCHAR(255),

    -- Facilities
    parking_available BOOLEAN DEFAULT false,
    guided_tours BOOLEAN DEFAULT false,
    wheelchair_accessible BOOLEAN DEFAULT false,
    photography_allowed BOOLEAN DEFAULT true,

    -- Media
    primary_image_url VARCHAR(500),
    gallery_images TEXT[],

    -- Ratings
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,

    -- Features
    is_unesco_site BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    tourist_priority INTEGER DEFAULT 1, -- 1-5 scale

    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[],

    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 14. FUNCTIONS & TRIGGERS
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_reference IS NULL THEN
        NEW.booking_reference := 'CC' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_booking_ref BEFORE INSERT ON bookings FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();

-- Function to update service ratings
CREATE OR REPLACE FUNCTION update_service_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE services 
        SET 
            average_rating = (
                SELECT ROUND(AVG(rating)::numeric, 2) 
                FROM reviews 
                WHERE service_id = NEW.service_id AND status = 'approved'
            ),
            total_reviews = (
                SELECT COUNT(*) 
                FROM reviews 
                WHERE service_id = NEW.service_id AND status = 'approved'
            )
        WHERE id = NEW.service_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_rating_trigger 
    AFTER INSERT OR UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_service_rating();

-- Refresh materialized views function
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_analytics;
END;
$$ language 'plpgsql';

-- ==============================================
-- 15. INITIAL DATA SETUP
-- ==============================================

-- Insert initial configuration
INSERT INTO site_config (key, value, value_type, description, is_public) VALUES
    ('site_name', 'CoastalConnect', 'string', 'Site name', true),
    ('site_tagline', 'Your Gateway to Coastal Karnataka', 'string', 'Site tagline', true),
    ('contact_email', 'admin@coastalconnect.in', 'string', 'Primary contact email', true),
    ('contact_phone', '8105003858', 'string', 'Primary contact phone', true),
    ('booking_fee_percentage', '5', 'number', 'Booking convenience fee percentage', false),
    ('payment_gateways', '["razorpay", "stripe"]', 'json', 'Available payment gateways', false),
    ('max_upload_size', '10485760', 'number', 'Maximum file upload size in bytes', false);

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
    ('Udupi', 'city', 'Karnataka', 'India', true, 1),
    ('Manipal', 'city', 'Karnataka', 'India', true, 2),
    ('Malpe', 'area', 'Karnataka', 'India', true, 3),
    ('Kaup', 'area', 'Karnataka', 'India', true, 4),
    ('Kundapur', 'city', 'Karnataka', 'India', true, 5),
    ('Hebri', 'area', 'Karnataka', 'India', true, 6);

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

-- Create indexes on materialized views
CREATE UNIQUE INDEX ON daily_analytics (date, event_type);
CREATE UNIQUE INDEX ON weekly_analytics (week, event_type);

-- ==============================================
-- 16. SAMPLE QUERIES FOR DASHBOARDS
-- ==============================================

-- Dashboard views and queries are included as comments for reference

/*
-- Daily bookings summary
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_bookings,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_booking_value
FROM bookings 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Service performance metrics
SELECT 
    s.name,
    s.service_type,
    COUNT(b.id) as total_bookings,
    AVG(r.rating) as avg_rating,
    SUM(b.total_amount) as total_revenue
FROM services s
LEFT JOIN bookings b ON s.id = b.service_id
LEFT JOIN reviews r ON s.id = r.service_id
WHERE s.status = 'approved'
GROUP BY s.id, s.name, s.service_type
ORDER BY total_revenue DESC;

-- Real-time analytics (last 24 hours)
SELECT 
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users
FROM analytics_events 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_type
ORDER BY event_count DESC;
*/

-- Performance optimization notice
ANALYZE;

-- Final message
SELECT 'CoastalConnect Supabase database schema created successfully!' as status;
