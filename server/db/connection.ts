import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || 'DESKTOP-6FSVDEL\\SQLEXPRESS',
  user: process.env.DB_USER || 'DESKTOP-6FSVDEL\\Aral',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'CoastalConnectUdupi',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
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

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
