-- Create Payments table for tracking live payment transactions
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Payments' AND xtype='U')
BEGIN
    CREATE TABLE Payments (
        id INT IDENTITY(1,1) PRIMARY KEY,
        payment_id NVARCHAR(255) NOT NULL UNIQUE,
        order_id NVARCHAR(255) NOT NULL,
        gateway NVARCHAR(50) NOT NULL CHECK (gateway IN ('razorpay', 'stripe')),
        booking_id NVARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        amount INT NOT NULL, -- Amount in smallest currency unit (paise, cents)
        currency NVARCHAR(10) NOT NULL DEFAULT 'INR',
        status NVARCHAR(50) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'cancelled', 'refunded')),
        refund_id NVARCHAR(255) NULL,
        gateway_response NVARCHAR(MAX) NULL, -- JSON response from gateway
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        
        -- Indexes
        INDEX IX_Payments_PaymentId (payment_id),
        INDEX IX_Payments_OrderId (order_id),
        INDEX IX_Payments_BookingId (booking_id),
        INDEX IX_Payments_UserId (user_id),
        INDEX IX_Payments_Status (status),
        INDEX IX_Payments_Gateway (gateway)
    );
    
    PRINT 'Payments table created successfully';
END
ELSE
BEGIN
    PRINT 'Payments table already exists';
END;

-- Add payment_id and payment_status columns to ProfessionalBookings table if they don't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ProfessionalBookings' AND COLUMN_NAME = 'payment_id')
BEGIN
    ALTER TABLE ProfessionalBookings ADD payment_id NVARCHAR(255) NULL;
    PRINT 'Added payment_id column to ProfessionalBookings table';
END;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ProfessionalBookings' AND COLUMN_NAME = 'payment_status')
BEGIN
    ALTER TABLE ProfessionalBookings ADD payment_status NVARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
    PRINT 'Added payment_status column to ProfessionalBookings table';
END;

-- Add payment gateway configuration table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PaymentGatewayConfig' AND xtype='U')
BEGIN
    CREATE TABLE PaymentGatewayConfig (
        id INT IDENTITY(1,1) PRIMARY KEY,
        gateway_name NVARCHAR(50) NOT NULL UNIQUE,
        is_enabled BIT DEFAULT 1,
        is_test_mode BIT DEFAULT 1,
        currency_supported NVARCHAR(500) DEFAULT 'INR', -- Comma-separated currencies
        countries_supported NVARCHAR(500) DEFAULT 'IN', -- Comma-separated country codes
        fee_percentage DECIMAL(5,2) DEFAULT 0.0, -- Gateway fee percentage
        config_json NVARCHAR(MAX) NULL, -- Gateway-specific configuration
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
    );
    
    -- Insert default gateway configurations
    INSERT INTO PaymentGatewayConfig (gateway_name, currency_supported, countries_supported, fee_percentage)
    VALUES 
        ('razorpay', 'INR', 'IN', 2.0),
        ('stripe', 'USD,EUR,GBP,INR', 'US,GB,EU,IN', 2.9);
    
    PRINT 'PaymentGatewayConfig table created with default configurations';
END
ELSE
BEGIN
    PRINT 'PaymentGatewayConfig table already exists';
END;

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ProfessionalBookings_PaymentId')
BEGIN
    CREATE INDEX IX_ProfessionalBookings_PaymentId ON ProfessionalBookings (payment_id);
    PRINT 'Created index on ProfessionalBookings.payment_id';
END;

-- Add vendor_status column to Users table if it doesn't exist (for role-based system)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'vendor_status')
BEGIN
    ALTER TABLE Users ADD vendor_status NVARCHAR(50) NULL CHECK (vendor_status IN ('pending', 'approved', 'rejected'));
    PRINT 'Added vendor_status column to Users table';
END;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'business_name')
BEGIN
    ALTER TABLE Users ADD business_name NVARCHAR(255) NULL;
    PRINT 'Added business_name column to Users table';
END;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'business_type')
BEGIN
    ALTER TABLE Users ADD business_type NVARCHAR(50) NULL CHECK (business_type IN ('homestay', 'restaurant', 'driver', 'event_services'));
    PRINT 'Added business_type column to Users table';
END;

-- Update Users table role column to support new roles
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS WHERE CONSTRAINT_NAME LIKE '%Users%role%')
BEGIN
    -- Drop existing check constraint on role column
    DECLARE @ConstraintName NVARCHAR(255);
    SELECT @ConstraintName = CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.CHECK_CONSTRAINTS 
    WHERE CONSTRAINT_NAME LIKE '%Users%role%';
    
    DECLARE @SQL NVARCHAR(MAX) = 'ALTER TABLE Users DROP CONSTRAINT ' + @ConstraintName;
    EXEC sp_executesql @SQL;
    
    -- Add new check constraint with updated roles
    ALTER TABLE Users ADD CONSTRAINT CK_Users_Role CHECK (role IN ('admin', 'vendor', 'customer', 'event_organizer'));
    PRINT 'Updated Users table role constraint to support new roles';
END;

PRINT 'Payment system database setup completed successfully!';
