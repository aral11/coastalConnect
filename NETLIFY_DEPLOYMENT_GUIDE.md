# Netlify Deployment Guide for CoastalConnect

## Environment Variables Setup

To deploy CoastalConnect on Netlify with Supabase integration, you need to configure the following environment variables in your Netlify dashboard:

### Required Supabase Variables

1. **VITE_SUPABASE_URL**
   - Your Supabase project URL
   - Format: `https://your-project-id.supabase.co`
   - Found in: Supabase Dashboard > Settings > API

2. **VITE_SUPABASE_ANON_KEY**
   - Your Supabase anonymous/public key
   - This is safe to expose in frontend
   - Found in: Supabase Dashboard > Settings > API

### Additional Environment Variables

3. **VITE_APP_NAME** = `CoastalConnect`
4. **VITE_APP_DESCRIPTION** = `Your gateway to coastal Karnataka experiences`
5. **VITE_CONTACT_EMAIL** = `support@coastalconnect.com`
6. **VITE_CONTACT_PHONE** = `+91-9876543210`

### Backend/Server Variables (if using Netlify Functions)

7. **DB_TYPE** = `supabase`
8. **SUPABASE_SERVICE_ROLE_KEY** (for server-side operations)
9. **ADMIN_SECRET_KEY** = `your-admin-secret-key`
10. **STRIPE_PUBLISHABLE_KEY** = `pk_test_...` (for payments)
11. **STRIPE_SECRET_KEY** = `sk_test_...` (for payments)

## How to Set Environment Variables in Netlify

### Method 1: Netlify Dashboard
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Click **Add variable** for each required variable
4. Enter the key-value pairs from above

### Method 2: Netlify CLI
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Set environment variables
netlify env:set VITE_SUPABASE_URL "https://your-project-id.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set VITE_APP_NAME "CoastalConnect"
netlify env:set VITE_APP_DESCRIPTION "Your gateway to coastal Karnataka experiences"
netlify env:set VITE_CONTACT_EMAIL "support@coastalconnect.com"
netlify env:set VITE_CONTACT_PHONE "+91-9876543210"
netlify env:set DB_TYPE "supabase"
netlify env:set ADMIN_SECRET_KEY "your-admin-secret-key"
```

### Method 3: netlify.toml Configuration
Add to your `netlify.toml` file (Note: Don't include sensitive keys here):

```toml
[build.environment]
  VITE_APP_NAME = "CoastalConnect"
  VITE_APP_DESCRIPTION = "Your gateway to coastal Karnataka experiences"
  VITE_CONTACT_EMAIL = "support@coastalconnect.com"
  VITE_CONTACT_PHONE = "+91-9876543210"
  DB_TYPE = "supabase"
```

## Supabase Setup Steps

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down your URL and anon key

2. **Run Database Setup**
   - In Supabase SQL Editor, run the contents of `database/supabase.sql`
   - This creates all tables, RLS policies, and storage buckets

3. **Configure Authentication**
   - Enable Email authentication in Supabase Dashboard
   - Optionally enable Google/Facebook providers
   - Set up redirect URLs for your Netlify domain

4. **Configure Storage**
   - Storage buckets are created automatically by the SQL script
   - Set up appropriate RLS policies for file access

## Build Configuration

Your `netlify.toml` is already configured for the build:

```toml
[build]
  command = "npm run build:client"
  functions = "netlify/functions"
  publish = "dist/spa"

[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"
  
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"
```

## Deployment Process

1. **Push to Repository**
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **Connect to Netlify**
   - Link your GitHub/GitLab repository
   - Set build command: `npm run build:client`
   - Set publish directory: `dist/spa`

3. **Configure Environment Variables**
   - Add all environment variables listed above
   - Use your actual Supabase URL and keys

4. **Deploy**
   - Netlify will automatically build and deploy
   - Check build logs for any issues

## Domain Configuration

1. **Custom Domain** (optional)
   - Add your custom domain in Netlify dashboard
   - Configure DNS settings
   - Enable HTTPS (automatic with Netlify)

2. **Supabase Redirect URLs**
   - Add your Netlify domain to Supabase auth settings
   - Include both `yourdomain.netlify.app` and custom domain

## Testing the Deployment

1. **Verify Environment Variables**
   - Check that all variables are set correctly
   - Test authentication flow
   - Verify database connections

2. **Test Core Features**
   - User registration and login
   - Service browsing and search
   - Booking functionality
   - Admin dashboard access

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all environment variables are set
   - Ensure Supabase credentials are correct
   - Review build logs for specific errors

2. **Authentication Issues**
   - Verify Supabase redirect URLs
   - Check that auth is enabled in Supabase
   - Ensure anon key is correct

3. **Database Connection Issues**
   - Verify Supabase URL format
   - Check that database tables exist
   - Ensure RLS policies are properly configured

### Debug Commands

```bash
# Test environment variables
netlify env:list

# Check build logs
netlify build

# Test functions locally
netlify dev
```

## Security Notes

1. **Environment Variables**
   - Never commit sensitive keys to repository
   - Use Netlify's secure environment variable storage
   - Prefix client-side variables with `VITE_`

2. **Supabase Security**
   - RLS policies are enforced on all tables
   - Use service role key only for server-side operations
   - Regularly rotate API keys

3. **Content Security Policy**
   - Configure CSP headers for production
   - Allow Supabase domains in CSP

## Performance Optimization

1. **Build Optimization**
   - Enable build caching in Netlify
   - Optimize bundle size with tree shaking
   - Use lazy loading for routes

2. **CDN Configuration**
   - Netlify CDN is enabled by default
   - Configure caching headers
   - Optimize image delivery

3. **Monitoring**
   - Set up Netlify Analytics
   - Monitor Supabase usage and performance
   - Track Core Web Vitals

---

For more help, refer to:
- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
