// Development startup validation and logging
export function validateDevelopmentSetup() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    return; // Skip validation in production
  }

  console.log('\n🔧 ========== DEVELOPMENT MODE STARTUP ==========');
  console.log('📍 Running CoastalConnect in Development Mode');
  console.log('📱 All external services will use fallback/mock data\n');

  // Database validation
  const dbMode = process.env.DB_MODE;
  if (dbMode === 'mock') {
    console.log('✅ Database: Mock data mode (no SQL Server required)');
  } else {
    console.log('⚠️  Database: Attempting real connection (may fail gracefully)');
  }

  // Email validation
  const emailDisabled = process.env.DISABLE_EMAIL_SENDING === 'true';
  const hasEmailCredentials = process.env.SMTP_USER && process.env.SMTP_PASSWORD;
  
  if (emailDisabled || !hasEmailCredentials) {
    console.log('✅ Email Service: Development mode (console logging)');
  } else {
    console.log('📧 Email Service: Attempting real SMTP connection');
  }

  // SMS validation
  const smsDisabled = process.env.DISABLE_SMS_SENDING === 'true';
  const hasSMSCredentials = process.env.SMS_API_KEY && process.env.SMS_API_KEY !== 'your-api-key';
  
  if (smsDisabled || !hasSMSCredentials) {
    console.log('✅ SMS Service: Development mode (console logging)');
  } else {
    console.log('📱 SMS Service: Attempting real SMS provider connection');
  }

  // Google Services validation
  const hasGoogleAPIKey = process.env.GOOGLE_PLACES_API_KEY && process.env.GOOGLE_PLACES_API_KEY.length > 10;
  
  if (!hasGoogleAPIKey) {
    console.log('✅ Google APIs: Using fallback data (no API key required)');
  } else {
    console.log('🌐 Google APIs: Using real API key');
  }

  // Payment gateway validation
  const paymentMode = process.env.RAZORPAY_MODE || 'test';
  console.log(`✅ Payment Gateway: ${paymentMode} mode`);

  console.log('\n📋 Expected Behavior:');
  console.log('   • Homepage loads with comprehensive mock data');
  console.log('   • All navigation and booking flows work');
  console.log('   • Email/SMS notifications logged to console');
  console.log('   • Database operations use fallback data');
  console.log('   • External API failures handled gracefully');

  console.log('\n🚀 Application starting... All systems ready!');
  console.log('================================================\n');
}

export function logDevelopmentNotification(type: 'email' | 'sms', details: any) {
  if (process.env.NODE_ENV !== 'development') return;
  
  const timestamp = new Date().toLocaleString();
  
  if (type === 'email') {
    console.log(`\n📧 [${timestamp}] EMAIL NOTIFICATION (Development Mode)`);
    console.log(`   To: ${details.to}`);
    console.log(`   Subject: ${details.subject}`);
    console.log(`   Preview: ${details.text ? details.text.substring(0, 100) + '...' : 'HTML content'}`);
    console.log('   ✅ In production, this email would be sent via SMTP\n');
  }
  
  if (type === 'sms') {
    console.log(`\n📱 [${timestamp}] SMS NOTIFICATION (Development Mode)`);
    console.log(`   To: ${details.phone}`);
    console.log(`   Message: ${details.message.substring(0, 80)}${details.message.length > 80 ? '...' : ''}`);
    console.log('   ✅ In production, this SMS would be sent via SMS provider\n');
  }
}

export function logDevelopmentAPI(service: string, endpoint: string, fallback: boolean = false) {
  if (process.env.NODE_ENV !== 'development') return;
  
  const timestamp = new Date().toLocaleString();
  
  if (fallback) {
    console.log(`\n🔄 [${timestamp}] API FALLBACK`);
    console.log(`   Service: ${service}`);
    console.log(`   Endpoint: ${endpoint}`);
    console.log(`   Status: Using enhanced fallback data`);
    console.log('   ✅ In production, this would use real API integration\n');
  } else {
    console.log(`\n🌐 [${timestamp}] API CALL`);
    console.log(`   Service: ${service}`);
    console.log(`   Endpoint: ${endpoint}`);
    console.log(`   Status: Attempting real API call\n`);
  }
}
