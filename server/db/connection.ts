import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || 'DESKTOP-6FSVDEL\\SQLEXPRESS',
  database: process.env.DB_DATABASE || 'CoastalConnectUdupi',
  authentication: {
    type: 'ntlm',
    options: {
      userName: process.env.DB_USER || 'DESKTOP-6FSVDEL\\Aral',
      password: process.env.DB_PASSWORD || '',
      domain: process.env.DB_DOMAIN || ''
    }
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' || false,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export const getConnection = async (): Promise<sql.ConnectionPool> => {
  try {
    if (!pool) {
      pool = new sql.ConnectionPool(config);
      await pool.connect();
      console.log('Connected to SQL Server successfully');
    }

    // Check if the pool is still connected
    if (!pool.connected) {
      console.log('Pool disconnected, reconnecting...');
      await pool.connect();
    }

    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    // Reset pool on connection failure
    pool = null;
    throw error;
  }
};

export const closeConnection = async (): Promise<void> => {
  try {
    if (pool) {
      await pool.close();
      pool = null;
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

// Initialize database tables if they don't exist
export const initializeDatabase = async (): Promise<void> => {
  try {
    const connection = await getConnection();
    
    // Create Homestays table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Homestays' AND xtype='U')
      CREATE TABLE Homestays (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        price_per_night DECIMAL(10,2),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        phone NVARCHAR(20),
        email NVARCHAR(255),
        amenities NVARCHAR(MAX),
        image_url NVARCHAR(500),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Eateries table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Eateries' AND xtype='U')
      CREATE TABLE Eateries (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        cuisine_type NVARCHAR(100),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        phone NVARCHAR(20),
        opening_hours NVARCHAR(200),
        price_range NVARCHAR(50),
        image_url NVARCHAR(500),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Drivers table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Drivers' AND xtype='U')
      CREATE TABLE Drivers (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20) NOT NULL,
        email NVARCHAR(255),
        location NVARCHAR(255) NOT NULL,
        vehicle_type NVARCHAR(100),
        vehicle_number NVARCHAR(50),
        license_number NVARCHAR(100),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        hourly_rate DECIMAL(10,2),
        experience_years INT,
        languages NVARCHAR(200),
        is_available BIT DEFAULT 1,
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Users table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password_hash NVARCHAR(255),
        name NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20),
        provider NVARCHAR(50) DEFAULT 'email',
        provider_id NVARCHAR(100),
        role NVARCHAR(50) DEFAULT 'customer',
        avatar_url NVARCHAR(500),
        is_active BIT DEFAULT 1,
        is_verified BIT DEFAULT 0,
        email_verified BIT DEFAULT 0,
        phone_verified BIT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Bookings table for homestays
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='HomestayBookings' AND xtype='U')
      CREATE TABLE HomestayBookings (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        homestay_id INT NOT NULL,
        booking_reference NVARCHAR(20) UNIQUE NOT NULL,
        check_in_date DATE NOT NULL,
        check_out_date DATE NOT NULL,
        guests INT NOT NULL,
        guest_name NVARCHAR(255) NOT NULL,
        guest_phone NVARCHAR(20) NOT NULL,
        guest_email NVARCHAR(255) NOT NULL,
        special_requests NVARCHAR(MAX),
        total_amount DECIMAL(10,2) NOT NULL,
        status NVARCHAR(20) DEFAULT 'pending',
        payment_status NVARCHAR(20) DEFAULT 'pending',
        payment_id NVARCHAR(100),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (homestay_id) REFERENCES Homestays(id)
      )
    `);

    // Create Bookings table for drivers
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DriverBookings' AND xtype='U')
      CREATE TABLE DriverBookings (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        driver_id INT NOT NULL,
        booking_reference NVARCHAR(20) UNIQUE NOT NULL,
        trip_code NVARCHAR(10) UNIQUE NOT NULL,
        pickup_location NVARCHAR(500) NOT NULL,
        dropoff_location NVARCHAR(500) NOT NULL,
        pickup_datetime DATETIME NOT NULL,
        passenger_name NVARCHAR(255) NOT NULL,
        passenger_phone NVARCHAR(20) NOT NULL,
        passengers_count INT DEFAULT 1,
        estimated_duration INT,
        total_amount DECIMAL(10,2) NOT NULL,
        status NVARCHAR(20) DEFAULT 'pending',
        payment_status NVARCHAR(20) DEFAULT 'pending',
        payment_id NVARCHAR(100),
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (driver_id) REFERENCES Drivers(id)
      )
    `);

    // Create Creators table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Creators' AND xtype='U')
      CREATE TABLE Creators (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        instagram_handle NVARCHAR(100) NOT NULL,
        instagram_url NVARCHAR(500),
        profile_image NVARCHAR(500),
        cover_image NVARCHAR(500),
        followers_count INT DEFAULT 0,
        specialty NVARCHAR(100),
        location NVARCHAR(255),
        contact_email NVARCHAR(255),
        contact_phone NVARCHAR(20),
        website_url NVARCHAR(500),
        featured_works NVARCHAR(MAX),
        is_verified BIT DEFAULT 0,
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Beauty & Wellness table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BeautyWellness' AND xtype='U')
      CREATE TABLE BeautyWellness (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- salon, spa, gym, ayurveda
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        phone NVARCHAR(20),
        email NVARCHAR(255),
        opening_hours NVARCHAR(200),
        services NVARCHAR(MAX), -- JSON array of services
        price_range NVARCHAR(50),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        image_url NVARCHAR(500),
        website_url NVARCHAR(500),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Arts & History table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ArtsHistory' AND xtype='U')
      CREATE TABLE ArtsHistory (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- museum, heritage_site, cultural_event, art_gallery
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        phone NVARCHAR(20),
        email NVARCHAR(255),
        opening_hours NVARCHAR(200),
        entry_fee DECIMAL(10,2),
        activities NVARCHAR(MAX), -- JSON array
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        image_url NVARCHAR(500),
        website_url NVARCHAR(500),
        historical_significance NVARCHAR(MAX),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Nightlife table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Nightlife' AND xtype='U')
      CREATE TABLE Nightlife (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- bar, pub, club, lounge
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        phone NVARCHAR(20),
        email NVARCHAR(255),
        opening_hours NVARCHAR(200),
        music_type NVARCHAR(200),
        dress_code NVARCHAR(200),
        entry_fee DECIMAL(10,2),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        image_url NVARCHAR(500),
        website_url NVARCHAR(500),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Shopping table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Shopping' AND xtype='U')
      CREATE TABLE Shopping (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- market, store, boutique, mall
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        phone NVARCHAR(20),
        email NVARCHAR(255),
        opening_hours NVARCHAR(200),
        specialties NVARCHAR(MAX), -- JSON array
        price_range NVARCHAR(50),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        image_url NVARCHAR(500),
        website_url NVARCHAR(500),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Entertainment table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Entertainment' AND xtype='U')
      CREATE TABLE Entertainment (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- cinema, festival, outdoor_activity, sports
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        phone NVARCHAR(20),
        email NVARCHAR(255),
        opening_hours NVARCHAR(200),
        activities NVARCHAR(MAX), -- JSON array
        ticket_price DECIMAL(10,2),
        age_group NVARCHAR(100),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        image_url NVARCHAR(500),
        website_url NVARCHAR(500),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Event Management table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='EventManagement' AND xtype='U')
      CREATE TABLE EventManagement (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- wedding, corporate, party, festival
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        phone NVARCHAR(20),
        email NVARCHAR(255),
        services NVARCHAR(MAX), -- JSON array
        package_details NVARCHAR(MAX),
        price_range NVARCHAR(100),
        portfolio NVARCHAR(MAX), -- JSON array of image URLs
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        website_url NVARCHAR(500),
        experience_years INT,
        capacity_range NVARCHAR(100),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Other Services table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OtherServices' AND xtype='U')
      CREATE TABLE OtherServices (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- catering, plumber, electrician, maintenance
        location NVARCHAR(255) NOT NULL,
        phone NVARCHAR(20),
        email NVARCHAR(255),
        services NVARCHAR(MAX), -- JSON array
        availability NVARCHAR(200),
        hourly_rate DECIMAL(10,2),
        fixed_rate DECIMAL(10,2),
        rating DECIMAL(3,2),
        total_reviews INT DEFAULT 0,
        experience_years INT,
        certifications NVARCHAR(MAX),
        emergency_available BIT DEFAULT 0,
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Local Events table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='LocalEvents' AND xtype='U')
      CREATE TABLE LocalEvents (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        category NVARCHAR(100) NOT NULL, -- kambala, festival, cultural, religious, sports
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        event_date DATE NOT NULL,
        start_time TIME,
        end_time TIME,
        organizer NVARCHAR(255),
        contact_phone NVARCHAR(20),
        contact_email NVARCHAR(255),
        entry_fee DECIMAL(10,2),
        image_url NVARCHAR(500),
        website_url NVARCHAR(500),
        registration_url NVARCHAR(500),
        capacity INT,
        registered_count INT DEFAULT 0,
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_featured BIT DEFAULT 0,
        status NVARCHAR(50) DEFAULT 'upcoming',
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Religious Services table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ReligiousServices' AND xtype='U')
      CREATE TABLE ReligiousServices (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        religion NVARCHAR(100) NOT NULL, -- hindu, christian, islam, buddhist, jain
        category NVARCHAR(100) NOT NULL, -- temple, church, mosque, prayer_hall
        location NVARCHAR(255) NOT NULL,
        address NVARCHAR(500),
        phone NVARCHAR(20),
        email NVARCHAR(255),
        morning_timings NVARCHAR(200),
        evening_timings NVARCHAR(200),
        special_timings NVARCHAR(500), -- JSON for festivals/special days
        services NVARCHAR(MAX), -- JSON array of services offered
        languages NVARCHAR(200),
        priest_contact NVARCHAR(100),
        image_url NVARCHAR(500),
        website_url NVARCHAR(500),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        is_active BIT DEFAULT 1,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Vendor Registrations table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='VendorRegistrations' AND xtype='U')
      CREATE TABLE VendorRegistrations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        vendor_id NVARCHAR(50) UNIQUE NOT NULL,
        business_name NVARCHAR(255) NOT NULL,
        owner_name NVARCHAR(255) NOT NULL,
        category NVARCHAR(100) NOT NULL,
        subcategory NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX),
        address NVARCHAR(500) NOT NULL,
        city NVARCHAR(100) NOT NULL,
        phone NVARCHAR(20) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        website NVARCHAR(500),
        aadhar_number NVARCHAR(12) NOT NULL,
        gst_number NVARCHAR(15),
        subscription_plan NVARCHAR(20) NOT NULL,
        status NVARCHAR(50) DEFAULT 'pending_verification',
        documents NVARCHAR(MAX), -- JSON string
        admin_notes NVARCHAR(MAX),
        payment_status NVARCHAR(50) DEFAULT 'pending',
        payment_id NVARCHAR(100),
        approved_by NVARCHAR(255),
        created_at DATETIME DEFAULT GETDATE(),
        reviewed_at DATETIME,
        activated_at DATETIME,
        subscription_expires_at DATETIME
      )
    `);

    console.log('Database tables initialized successfully');

    // Create indexes for better performance
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
      CREATE INDEX IX_Users_Email ON Users(email);
    `);

    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HomestayBookings_User')
      CREATE INDEX IX_HomestayBookings_User ON HomestayBookings(user_id);
    `);

    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_DriverBookings_User')
      CREATE INDEX IX_DriverBookings_User ON DriverBookings(user_id);
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
