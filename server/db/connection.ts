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
