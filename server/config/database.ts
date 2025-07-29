import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// SQL Server Authentication Configuration
const dbConfigSQLAuth: sql.config = {
  server: process.env.DB_SERVER || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE || 'costalConnectDEV',
  user: process.env.DB_USER || 'aral21',
  password: process.env.DB_PASSWORD || 'Aral@1234',
  options: {
    encrypt: false, // Set to true if using Azure SQL
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 60000,
    requestTimeout: 60000,
    connectionIsolationLevel: sql.ISOLATION_LEVEL.READ_COMMITTED
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200
  }
};

// Windows Authentication Configuration (fallback)
const dbConfigTrusted: sql.config = {
  server: process.env.DB_SERVER || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE || 'costalConnectDEV',
  driver: 'msnodesqlv8' as any,
  options: {
    trustedConnection: true,
    enableArithAbort: true,
    trustServerCertificate: true,
    connectTimeout: 60000,
    requestTimeout: 60000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool: sql.ConnectionPool | null = null;
let isConnecting = false;

export const connectDB = async (): Promise<sql.ConnectionPool> => {
  if (pool && pool.connected) {
    return pool;
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (pool && pool.connected) {
      return pool;
    }
  }

  isConnecting = true;

  try {
    console.log('🔗 Connecting to SQL Server...');
    console.log('📋 Server:', dbConfigSQLAuth.server);
    console.log('📋 Database:', dbConfigSQLAuth.database);
    console.log('���� User:', dbConfigSQLAuth.user);

    // Try SQL Server Authentication first
    try {
      pool = new sql.ConnectionPool(dbConfigSQLAuth);
      await pool.connect();
      console.log('✅ Connected to SQL Server with SQL Authentication');
      await initializeTables();
      return pool;
    } catch (sqlAuthError) {
      console.log('❌ SQL Auth failed, trying Windows Authentication...');
      
      // Fallback to Windows Authentication
      try {
        pool = new sql.ConnectionPool(dbConfigTrusted);
        await pool.connect();
        console.log('✅ Connected to SQL Server with Windows Authentication');
        await initializeTables();
        return pool;
      } catch (winAuthError) {
        throw new Error(`Both authentication methods failed. SQL Auth: ${sqlAuthError.message}, Windows Auth: ${winAuthError.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  } finally {
    isConnecting = false;
  }
};

export const getConnection = async (): Promise<sql.ConnectionPool> => {
  if (!pool || !pool.connected) {
    return await connectDB();
  }
  return pool;
};

export const closeConnection = async (): Promise<void> => {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('🔌 Database connection closed');
  }
};

// Initialize required tables if they don't exist
const initializeTables = async (): Promise<void> => {
  try {
    const connection = await getConnection();
    
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
        is_verified BIT DEFAULT 1,
        email_verified BIT DEFAULT 0,
        phone_verified BIT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

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
        admin_approval_status NVARCHAR(20) DEFAULT 'approved',
        admin_approval_reason NVARCHAR(MAX),
        admin_approved_at DATETIME,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Restaurants table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Restaurants' AND xtype='U')
      CREATE TABLE Restaurants (
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
        admin_approval_status NVARCHAR(20) DEFAULT 'approved',
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
        admin_approval_status NVARCHAR(20) DEFAULT 'approved',
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Bookings table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Bookings' AND xtype='U')
      CREATE TABLE Bookings (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        service_id INT NOT NULL,
        service_type NVARCHAR(50) NOT NULL,
        booking_reference NVARCHAR(20) UNIQUE NOT NULL,
        
        -- Homestay specific fields
        check_in_date DATE,
        check_out_date DATE,
        guests INT,
        rooms INT,
        
        -- Restaurant specific fields
        reservation_date DATE,
        reservation_time TIME,
        party_size INT,
        
        -- Driver specific fields
        pickup_date DATE,
        pickup_time TIME,
        pickup_location NVARCHAR(500),
        dropoff_location NVARCHAR(500),
        passengers INT,
        
        -- Common fields
        guest_name NVARCHAR(255) NOT NULL,
        guest_phone NVARCHAR(20) NOT NULL,
        guest_email NVARCHAR(255) NOT NULL,
        special_requests NVARCHAR(MAX),
        total_amount DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        coupon_code NVARCHAR(50),
        status NVARCHAR(20) DEFAULT 'pending',
        payment_status NVARCHAR(20) DEFAULT 'pending',
        payment_id NVARCHAR(100),
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);

    // Create Platform Stats table
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PlatformStats' AND xtype='U')
      CREATE TABLE PlatformStats (
        id INT IDENTITY(1,1) PRIMARY KEY,
        total_vendors INT DEFAULT 0,
        total_orders INT DEFAULT 0,
        average_rating DECIMAL(3,2) DEFAULT 0,
        total_cities INT DEFAULT 0,
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);

    // Insert initial platform stats if empty
    await connection.request().query(`
      IF NOT EXISTS (SELECT * FROM PlatformStats)
      INSERT INTO PlatformStats (total_vendors, total_orders, average_rating, total_cities, updated_at)
      VALUES (0, 0, 0, 4, GETDATE())
    `);

    console.log('📋 Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing tables:', error);
    throw error;
  }
};

// Update platform stats function
export const updatePlatformStats = async (): Promise<void> => {
  try {
    const connection = await getConnection();
    
    // Calculate stats from actual data
    const vendorCount = await connection.request().query(`
      SELECT 
        (SELECT COUNT(*) FROM Homestays WHERE is_active = 1) +
        (SELECT COUNT(*) FROM Restaurants WHERE is_active = 1) +
        (SELECT COUNT(*) FROM Drivers WHERE is_active = 1) as total_vendors
    `);

    const orderCount = await connection.request().query(`
      SELECT COUNT(*) as total_orders FROM Bookings WHERE status IN ('confirmed', 'completed')
    `);

    const avgRating = await connection.request().query(`
      SELECT AVG(rating) as avg_rating FROM (
        SELECT rating FROM Homestays WHERE rating > 0 AND is_active = 1
        UNION ALL
        SELECT rating FROM Restaurants WHERE rating > 0 AND is_active = 1
        UNION ALL
        SELECT rating FROM Drivers WHERE rating > 0 AND is_active = 1
      ) as all_ratings
    `);

    const cityCount = await connection.request().query(`
      SELECT COUNT(DISTINCT location) as total_cities FROM (
        SELECT location FROM Homestays WHERE is_active = 1
        UNION
        SELECT location FROM Restaurants WHERE is_active = 1
        UNION
        SELECT location FROM Drivers WHERE is_active = 1
      ) as all_locations
    `);

    // Update platform stats
    await connection.request()
      .input('vendors', vendorCount.recordset[0]?.total_vendors || 0)
      .input('orders', orderCount.recordset[0]?.total_orders || 0)
      .input('rating', avgRating.recordset[0]?.avg_rating || 0)
      .input('cities', cityCount.recordset[0]?.total_cities || 4)
      .query(`
        UPDATE PlatformStats 
        SET total_vendors = @vendors,
            total_orders = @orders,
            average_rating = @rating,
            total_cities = @cities,
            updated_at = GETDATE()
      `);

  } catch (error) {
    console.error('Error updating platform stats:', error);
  }
};

export default { connectDB, getConnection, closeConnection, updatePlatformStats };
