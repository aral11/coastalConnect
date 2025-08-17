# Phase 1 Deployment Guide

## Overview

This guide covers deploying CoastalConnect Phase 1 - the Udupi & Manipal Visitor Guide to Netlify.

## Pre-Deployment Checklist

### 1. Database Setup (Supabase)

- [ ] Apply the Phase 1 database schema from `database/phase1_guide_tables.sql`
- [ ] Verify RLS policies are enabled
- [ ] Populate sample data for guide categories and items
- [ ] Test database access with anon key

### 2. Environment Variables

Configure these in Netlify > Site Settings > Environment Variables:

#### Required for Frontend (VITE\_ prefix)

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_APP_URL=https://coastalconnect.in
```

#### Required for PDF Generation (Netlify Functions)

```
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
```

#### Optional (for feedback email notifications)

```
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NOTIFY_TO_EMAIL=admin@coastalconnect.in
```

### 3. Build Configuration

Create/verify `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

## Deployment Steps

### 1. Database Migration

```sql
-- Run this in Supabase SQL Editor
-- (Contents of database/phase1_guide_tables.sql)
```

### 2. Deploy to Netlify

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Netlify (if using CLI)
netlify deploy --prod
```

### 3. Verify Environment Variables

In Netlify dashboard:

1. Go to Site Settings > Environment Variables
2. Add all required variables listed above
3. Redeploy the site after adding variables

### 4. Test Deployment

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Guide page displays categories and items
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] PDF download button works
- [ ] Feedback form submission works
- [ ] Contact page accessible
- [ ] SEO meta tags present
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

## Domain Configuration

### 1. Custom Domain (Optional)

In Netlify dashboard:

1. Go to Site Settings > Domain Management
2. Add custom domain `coastalconnect.in`
3. Configure DNS records with your domain provider

### 2. HTTPS & Security

- [ ] HTTPS automatically enabled by Netlify
- [ ] Security headers configured
- [ ] CORS properly configured for API calls

## Performance Optimization

### 1. Build Optimization

- [ ] CSS and JS minified
- [ ] Images optimized and lazy-loaded
- [ ] Unused code eliminated

### 2. Caching Strategy

- [ ] Static assets cached with long TTL
- [ ] API responses cached appropriately
- [ ] PDF generation cached for 1 hour

## Monitoring & Analytics

### 1. Error Tracking

- Monitor Netlify function logs for PDF generation errors
- Check browser console for client-side errors

### 2. Performance Monitoring

- Use Netlify Analytics (if enabled)
- Monitor Core Web Vitals
- Track PDF download success rate

## Troubleshooting

### Common Issues

#### PDF Generation Fails

1. Check `SUPABASE_SERVICE_ROLE` environment variable
2. Verify Supabase connection in function logs
3. Check if puppeteer is properly installed

#### Guide Data Not Loading

1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Check database RLS policies
3. Verify table names match code expectations

#### Form Submissions Failing

1. Check RLS policies on `guide_feedback` table
2. Verify anon users can insert feedback
3. Check network requests in browser dev tools

### Deployment Commands

```bash
# Fresh deployment
npm ci
npm run build
netlify deploy --prod

# Function-only deployment
netlify deploy --functions

# Environment variable check
netlify env:list
```

## Post-Deployment Tasks

### 1. Content Management

- [ ] Add real guide items via Supabase dashboard
- [ ] Update categories as needed
- [ ] Monitor feedback submissions

### 2. SEO & Marketing

- [ ] Submit sitemap to Google Search Console
- [ ] Verify structured data with Google Rich Results Test
- [ ] Test social media sharing (Open Graph tags)

### 3. User Testing

- [ ] Test on mobile devices
- [ ] Verify all links work correctly
- [ ] Test PDF download on different browsers
- [ ] Gather initial user feedback

## Success Criteria

Phase 1 deployment is successful when:

- ✅ Homepage loads and displays visitor guide focus
- ✅ Guide page shows categories from Supabase
- ✅ Search and filtering work properly
- ✅ PDF generation and download work
- ✅ Feedback form submits to Supabase
- ✅ SEO metadata is present and correct
- ✅ Site is mobile-responsive
- ✅ No console errors
- ✅ All Phase 2 features are properly hidden

## Support & Maintenance

- Monitor Netlify function execution for PDF generation
- Regular database backups via Supabase
- Review feedback submissions weekly
- Plan Phase 2 features based on user feedback

---

**Next Phase**: Based on feedback collected, prioritize Phase 2 features like online bookings, event management, and driver booking platform.
