// Environment Variables Verification Script
// This script checks if all required environment variables are properly set

console.log('🔍 Environment Variables Verification\n');

// Required environment variables for production
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_NAME',
  'VITE_APP_URL',
  'VITE_ENABLE_ANALYTICS'
];

// Check Vite environment variables (frontend)
console.log('📱 Frontend Environment Variables (Vite):');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const displayValue = value ? 
    (varName.includes('KEY') ? `${value.substring(0, 10)}...` : value) : 
    'NOT SET';
  
  console.log(`  ${status} ${varName}: ${displayValue}`);
});

// Check if Supabase URL is valid
const supabaseUrl = process.env.VITE_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
  console.log('  ✅ Supabase URL format is valid');
} else {
  console.log('  ❌ Supabase URL format is invalid or missing');
}

// Check if Supabase key format is correct
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (supabaseKey && supabaseKey.startsWith('eyJ')) {
  console.log('  ✅ Supabase Anonymous Key format is valid (JWT)');
} else {
  console.log('  ❌ Supabase Anonymous Key format is invalid or missing');
}

console.log('\n🛠️ Backend Environment Variables:');

// Check backend environment variables if they exist
const backendVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_USER'
];

backendVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '⚠️';
  const displayValue = value ? 
    (varName.includes('SECRET') || varName.includes('PASSWORD') ? '***' : value) : 
    'NOT SET (Optional for frontend)';
  
  console.log(`  ${status} ${varName}: ${displayValue}`);
});

console.log('\n📊 Summary:');
const frontendSet = requiredVars.filter(v => process.env[v]).length;
const frontendTotal = requiredVars.length;

console.log(`Frontend: ${frontendSet}/${frontendTotal} required variables set`);

if (frontendSet === frontendTotal) {
  console.log('✅ All required frontend environment variables are set!');
} else {
  console.log('❌ Some required frontend environment variables are missing!');
}

console.log('\n🔧 Missing variables should be set in:');
console.log('  - .env.local (for local development)');
console.log('  - Netlify dashboard (for production deployment)');
