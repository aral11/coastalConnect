import { getConnection } from '../db/connection';
import fs from 'fs';
import path from 'path';

export async function setupPaymentSystem() {
  try {
    console.log('🏦 Setting up payment system database tables...');
    
    const connection = await getConnection();
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../db/createPaymentTables.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the script by GO statements (if any) and execute
    const statements = sqlScript.split(/\nGO\n/i);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.request().query(statement);
      }
    }
    
    console.log('✅ Payment system database setup completed successfully!');
    
    // Verify tables were created
    const tablesCheck = await connection.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME IN ('Payments', 'PaymentGatewayConfig')
    `);
    
    console.log('📋 Payment tables verified:', tablesCheck.recordset.map(r => r.TABLE_NAME));
    
    return {
      success: true,
      message: 'Payment system setup completed',
      tables: tablesCheck.recordset.map(r => r.TABLE_NAME)
    };
    
  } catch (error) {
    console.error('❌ Payment system setup failed:', error);
    
    // Fallback: Log what we would have done
    console.log('📝 Payment system would include:');
    console.log('  - Payments table for transaction tracking');
    console.log('  - PaymentGatewayConfig for gateway settings');
    console.log('  - Enhanced Users table with vendor/business fields');
    console.log('  - Updated ProfessionalBookings with payment fields');
    
    return {
      success: false,
      message: 'Payment system setup failed, using fallback mode',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Environment variable check
export function validatePaymentEnvironment() {
  const config = {
    razorpay: {
      configured: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
      keyId: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing',
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Missing'
    },
    stripe: {
      configured: !!process.env.STRIPE_SECRET_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing',
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing'
    }
  };
  
  console.log('💳 Payment Gateway Configuration:');
  console.log('  Razorpay:', config.razorpay.configured ? '✅ Configured' : '❌ Not configured');
  console.log('    Key ID:', config.razorpay.keyId);
  console.log('    Key Secret:', config.razorpay.keySecret);
  console.log('  Stripe:', config.stripe.configured ? '✅ Configured' : '❌ Not configured');
  console.log('    Secret Key:', config.stripe.secretKey);
  console.log('    Publishable Key:', config.stripe.publishableKey);
  console.log('    Webhook Secret:', config.stripe.webhookSecret);
  
  if (!config.razorpay.configured && !config.stripe.configured) {
    console.log('⚠️  No payment gateways configured. Add environment variables:');
    console.log('    RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET');
    console.log('    STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET');
  }
  
  return config;
}
