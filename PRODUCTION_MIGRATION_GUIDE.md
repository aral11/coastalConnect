# CoastalConnect Production Migration Guide

## Overview

This guide provides comprehensive instructions for migrating CoastalConnect to production with full database-agnostic architecture, supporting both Supabase (PostgreSQL) and SQL Server deployments.

## Table of Contents

1. [Pre-Migration Requirements](#pre-migration-requirements)
2. [Database Setup](#database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Security Implementation](#security-implementation)
5. [Performance Optimization](#performance-optimization)
6. [Migration Steps](#migration-steps)
7. [Testing & Validation](#testing--validation)
8. [Post-Migration Tasks](#post-migration-tasks)
9. [Troubleshooting](#troubleshooting)

## Pre-Migration Requirements

### System Requirements

- **Node.js**: 18.x or higher
- **Memory**: Minimum 4GB RAM, Recommended 8GB
- **Storage**: Minimum 20GB available space
- **Network**: Stable internet connection for cloud services

### Required Accounts & Services

- [ ] Supabase account (if using Supabase)
- [ ] Azure/SQL Server instance (if using SQL Server)
- [ ] Domain name and SSL certificate
- [ ] Email service (SMTP provider)
- [ ] Payment gateway accounts (Razorpay, Stripe)
- [ ] Redis instance (optional, for caching)

### Tools Required

- [ ] Git client
- [ ] Docker (optional, for containerized deployment)
- [ ] SSL certificate tool (Let's Encrypt recommended)
- [ ] Database client (pgAdmin for PostgreSQL, SSMS for SQL Server)

## Database Setup

### Option A: Supabase (PostgreSQL) Setup

#### 1. Create Supabase Project

```bash
# 1. Go to https://supabase.com and create new project
# 2. Note down the following values:
#    - Project URL
#    - Anon Key
#    - Service Role Key
```

#### 2. Run Supabase DDL Script

```sql
-- Execute the contents of database/supabase.sql
-- This includes:
-- - All table structures
-- - Indexes and constraints
-- - Row Level Security (RLS) policies
-- - Storage buckets
-- - Functions and triggers
```

#### 3. Configure Storage Buckets

```sql
-- Storage buckets are created automatically
-- Configure additional policies if needed
```

#### 4. Set Up RLS Policies

```sql
-- RLS policies are included in the DDL script
-- Verify they're working correctly
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

### Option B: SQL Server Setup

#### 1. Create Database Instance

```sql
-- Create database
CREATE DATABASE CoastalConnect_Prod;
USE CoastalConnect_Prod;
```

#### 2. Run SQL Server DDL Script

```sql
-- Execute the contents of database/sqlserver.sql
-- This includes:
-- - All table structures
-- - Indexes and constraints
-- - Stored procedures
-- - Views for analytics
-- - Triggers for automation
```

#### 3. Create Database User

```sql
-- Create application user with limited permissions
CREATE LOGIN coastalconnect_app WITH PASSWORD = 'your-secure-password';
CREATE USER coastalconnect_app FOR LOGIN coastalconnect_app;

-- Grant necessary permissions
ALTER ROLE db_datareader ADD MEMBER coastalconnect_app;
ALTER ROLE db_datawriter ADD MEMBER coastalconnect_app;
GRANT EXECUTE ON SCHEMA::dbo TO coastalconnect_app;
```

#### 4. Configure Backup Strategy

```sql
-- Set up automated backups
EXEC sp_addumpdevice 'disk', 'CoastalConnect_Backup', 
'C:\Backups\CoastalConnect_Full.bak';

-- Schedule regular backups
```

## Environment Configuration

### 1. Copy Environment Template

```bash
# Copy the production environment template
cp .env.production.example .env.production
```

### 2. Configure Database Settings

#### For Supabase:
```env
# Database Configuration
DB_TYPE=supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### For SQL Server:
```env
# Database Configuration
DB_TYPE=sqlserver
SQLSERVER_HOST=your-server.database.windows.net
SQLSERVER_DATABASE=CoastalConnect_Prod
SQLSERVER_USER=coastalconnect_app
SQLSERVER_PASSWORD=your-secure-password
SQLSERVER_PORT=1433
SQLSERVER_ENCRYPT=true
SQLSERVER_TRUST_CERT=false
```

### 3. Generate Secure Secrets

```bash
# Generate JWT secret (32+ characters)
openssl rand -base64 32

# Generate admin secret
openssl rand -base64 32

# Generate session secret
openssl rand -base64 32
```

Update `.env.production`:
```env
JWT_SECRET=your-generated-jwt-secret
ADMIN_SECRET_KEY=your-generated-admin-secret
SESSION_SECRET=your-generated-session-secret
```

### 4. Configure External Services

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateways
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret

# Other Services
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## Security Implementation

### 1. SSL/TLS Configuration

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 2. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 3001/tcp   # Block direct app access
```

### 3. Environment Security

```bash
# Secure the environment file
chmod 600 .env.production
chown app:app .env.production

# Set up log rotation
sudo logrotate -d /etc/logrotate.d/coastalconnect
```

### 4. Database Security

#### Supabase:
- RLS policies are automatically enforced
- Use service role key only on server
- Configure IP restrictions in Supabase dashboard

#### SQL Server:
```sql
-- Enable encryption
ALTER DATABASE CoastalConnect_Prod SET ENCRYPTION ON;

-- Disable unnecessary protocols
EXEC sp_configure 'remote access', 0;
RECONFIGURE;
```

## Performance Optimization

### 1. Database Optimization

#### Supabase:
```sql
-- Create additional indexes for performance
CREATE INDEX CONCURRENTLY idx_services_location_type 
ON services(location_id, service_type) WHERE status = 'approved';

CREATE INDEX CONCURRENTLY idx_bookings_vendor_date 
ON bookings(vendor_id, created_at) WHERE status IN ('confirmed', 'completed');

CREATE INDEX CONCURRENTLY idx_analytics_events_type_date 
ON analytics_events(event_type, created_at);
```

#### SQL Server:
```sql
-- Create additional indexes
CREATE NONCLUSTERED INDEX IX_Services_Performance 
ON services(location_id, service_type, status)
INCLUDE (name, base_price, average_rating)
WHERE status = 'approved';

-- Update statistics
UPDATE STATISTICS services WITH FULLSCAN;
```

### 2. Caching Configuration

```env
# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379
CACHE_TTL=300
CACHE_MAX_ITEMS=1000
```

### 3. CDN Setup

```bash
# Configure CloudFlare or AWS CloudFront
# Update static asset URLs in environment
CDN_URL=https://cdn.yourdomain.com
STATIC_ASSETS_BASE_URL=https://assets.yourdomain.com
```

## Migration Steps

### Step 1: Pre-Migration Testing

```bash
# 1. Run tests in development
npm run test
npm run typecheck
npm run build

# 2. Test database connectivity
node -e "
const { getDatabaseService } = require('./server/services/databaseService.js');
getDatabaseService().initialize().then(() => console.log('DB Connected')).catch(console.error);
"
```

### Step 2: Backup Current System

```bash
# Backup current database (if migrating from existing system)
# For PostgreSQL:
pg_dump existing_db > backup_$(date +%Y%m%d_%H%M%S).sql

# For SQL Server:
sqlcmd -S server -Q "BACKUP DATABASE existing_db TO DISK = 'backup.bak'"
```

### Step 3: Deploy Application

```bash
# 1. Clone repository to production server
git clone https://github.com/yourusername/coastalconnect.git
cd coastalconnect

# 2. Install dependencies
npm install --production

# 3. Build application
npm run build

# 4. Set up environment
cp .env.production.example .env.production
# Edit .env.production with your values

# 5. Start application with PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Step 4: Database Migration

```bash
# 1. Run database schema creation
npm run db:migrate

# 2. Seed initial data
npm run db:seed

# 3. Verify data integrity
npm run db:verify
```

### Step 5: DNS & SSL Configuration

```bash
# 1. Update DNS records
# Point A record to server IP
# Point CNAME for www to main domain

# 2. Configure Nginx
sudo cp deployment/nginx.conf /etc/nginx/sites-available/coastalconnect
sudo ln -s /etc/nginx/sites-available/coastalconnect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 3. Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com
```

## Testing & Validation

### 1. Automated Tests

```bash
# Run full test suite
npm run test:production

# Run security tests
npm run test:security

# Run performance tests
npm run test:performance
```

### 2. Manual Testing Checklist

#### Core Functionality
- [ ] User registration and login
- [ ] Service browsing and search
- [ ] Booking flow (complete transaction)
- [ ] Payment processing
- [ ] Admin dashboard access
- [ ] Email notifications

#### Security Testing
- [ ] SQL injection attempts
- [ ] XSS vulnerability checks
- [ ] Authentication bypass attempts
- [ ] Rate limiting verification
- [ ] HTTPS enforcement

#### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API response times < 200ms
- [ ] Database query optimization
- [ ] Caching effectiveness
- [ ] Concurrent user handling

#### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast compliance
- [ ] Alt text on images
- [ ] Form label associations

### 3. Load Testing

```bash
# Install Artillery for load testing
npm install -g artillery

# Run load tests
artillery run deployment/load-test.yml
```

### 4. Database Integrity Check

```sql
-- Supabase/PostgreSQL
SELECT schemaname, tablename, attname, typname, attnotnull 
FROM pg_attribute 
JOIN pg_type ON atttypid = pg_type.oid 
JOIN pg_class ON attrelid = pg_class.oid 
JOIN pg_namespace ON relnamespace = pg_namespace.oid 
WHERE schemaname = 'public' AND attnum > 0;

-- SQL Server
SELECT 
    t.name AS TableName,
    c.name AS ColumnName,
    typ.name AS DataType,
    c.is_nullable
FROM sys.tables t
JOIN sys.columns c ON t.object_id = c.object_id
JOIN sys.types typ ON c.user_type_id = typ.user_type_id
ORDER BY t.name, c.column_id;
```

## Post-Migration Tasks

### 1. Monitoring Setup

```bash
# Set up application monitoring
npm install -g @pm2/pm2-plus
pm2 plus

# Configure log aggregation
sudo apt install rsyslog
```

### 2. Backup Automation

```bash
# Create backup script
cat > /opt/coastalconnect/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/coastalconnect"

# Database backup
if [ "$DB_TYPE" = "supabase" ]; then
    # Supabase backup using their CLI
    supabase db dump --file "$BACKUP_DIR/db_$DATE.sql"
else
    # SQL Server backup
    sqlcmd -S $SQLSERVER_HOST -U $SQLSERVER_USER -P $SQLSERVER_PASSWORD \
           -Q "BACKUP DATABASE $SQLSERVER_DATABASE TO DISK = '$BACKUP_DIR/db_$DATE.bak'"
fi

# Application backup
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" /opt/coastalconnect --exclude=node_modules

# Clean old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete
EOF

chmod +x /opt/coastalconnect/backup.sh

# Schedule daily backups
echo "0 2 * * * /opt/coastalconnect/backup.sh" | crontab -
```

### 3. Health Checks

```bash
# Create health check script
cat > /opt/coastalconnect/health-check.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://yourdomain.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Health check PASSED"
else
    echo "$(date): Health check FAILED (HTTP $RESPONSE)"
    # Restart application if needed
    pm2 restart coastalconnect
fi
EOF

chmod +x /opt/coastalconnect/health-check.sh

# Schedule health checks every 5 minutes
echo "*/5 * * * * /opt/coastalconnect/health-check.sh >> /var/log/coastalconnect-health.log" | crontab -
```

### 4. Analytics & Reporting

```bash
# Set up analytics data aggregation
cat > /opt/coastalconnect/analytics-aggregation.sh << 'EOF'
#!/bin/bash
# Run daily analytics aggregation
node /opt/coastalconnect/scripts/aggregate-analytics.js
EOF

chmod +x /opt/coastalconnect/analytics-aggregation.sh

# Schedule daily at 1 AM
echo "0 1 * * * /opt/coastalconnect/analytics-aggregation.sh" | crontab -
```

## Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Failures

**Symptom**: Application cannot connect to database

**Solutions**:
```bash
# Check database service status
# For Supabase: Check project status in dashboard
# For SQL Server: 
sudo systemctl status mssql-server

# Test connectivity
telnet your-db-host 5432  # PostgreSQL
telnet your-db-host 1433  # SQL Server

# Check firewall rules
sudo ufw status

# Verify credentials
echo $DB_PASSWORD | base64  # Check for hidden characters
```

#### 2. SSL Certificate Issues

**Symptom**: HTTPS not working or certificate errors

**Solutions**:
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --dry-run

# Check Nginx configuration
sudo nginx -t

# Restart services
sudo systemctl restart nginx
```

#### 3. Performance Issues

**Symptom**: Slow response times or high server load

**Solutions**:
```bash
# Check server resources
htop
df -h
free -m

# Analyze slow queries
# PostgreSQL:
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# SQL Server:
SELECT TOP 10 
    total_elapsed_time/execution_count AS avg_time_ms,
    text
FROM sys.dm_exec_query_stats 
CROSS APPLY sys.dm_exec_sql_text(sql_handle)
ORDER BY avg_time_ms DESC;

# Check cache performance
redis-cli info stats  # If using Redis
```

#### 4. Payment Gateway Issues

**Symptom**: Payment processing failures

**Solutions**:
```bash
# Check API credentials
curl -X POST https://api.razorpay.com/v1/payments \
  -u $RAZORPAY_KEY_ID:$RAZORPAY_KEY_SECRET \
  -H "Content-Type: application/json"

# Verify webhook endpoints
curl -X POST https://yourdomain.com/api/payments/webhook/razorpay

# Check payment logs
pm2 logs coastalconnect | grep payment
```

### Emergency Procedures

#### 1. Complete Application Failure

```bash
# Stop application
pm2 stop coastalconnect

# Check logs
pm2 logs coastalconnect --lines 100

# Restart with latest working version
git checkout last-known-good-commit
npm install
npm run build
pm2 restart coastalconnect
```

#### 2. Database Corruption

```bash
# Restore from latest backup
# PostgreSQL:
psql -d coastalconnect_prod -f latest_backup.sql

# SQL Server:
sqlcmd -S server -Q "RESTORE DATABASE CoastalConnect_Prod FROM DISK = 'latest_backup.bak'"
```

#### 3. Security Breach

```bash
# Immediate actions:
1. Change all passwords and API keys
2. Revoke and regenerate JWT secrets
3. Check logs for suspicious activity
4. Inform users if data was compromised
5. Contact security team/authorities if required

# Rotate secrets
openssl rand -base64 32 > new_jwt_secret
# Update environment variables and restart
```

## Rollback Procedure

If migration fails, follow these steps to rollback:

```bash
# 1. Stop new application
pm2 stop coastalconnect

# 2. Restore previous application version
git checkout previous-stable-version
npm install
npm run build

# 3. Restore database from backup
# (Use appropriate restore commands for your database)

# 4. Update DNS to point back to old server (if applicable)

# 5. Restart application
pm2 restart coastalconnect

# 6. Verify functionality
curl https://yourdomain.com/health
```

## Support & Maintenance

### Regular Maintenance Tasks

- **Daily**: Monitor logs and health checks
- **Weekly**: Review performance metrics and optimize queries
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Full backup verification and disaster recovery testing

### Monitoring Dashboards

1. **Application Health**: `https://yourdomain.com/api/health`
2. **Performance Stats**: `https://yourdomain.com/api/performance/stats`
3. **Analytics Dashboard**: `https://yourdomain.com/admin/analytics`

### Contact Information

- **Technical Support**: tech-support@coastalconnect.in
- **Emergency Contact**: +91-8105003858
- **Documentation**: https://docs.coastalconnect.in

---

## Migration Checklist

Use this checklist to ensure all steps are completed:

### Pre-Migration
- [ ] Server requirements verified
- [ ] All accounts and services set up
- [ ] Environment variables configured
- [ ] SSL certificates obtained
- [ ] Backup procedures tested

### Database Setup
- [ ] Database instance created
- [ ] DDL scripts executed successfully
- [ ] Indexes and constraints verified
- [ ] RLS policies configured (Supabase)
- [ ] Initial data seeded

### Security
- [ ] Firewall configured
- [ ] SSL/TLS enabled
- [ ] Secrets rotated and secured
- [ ] Rate limiting enabled
- [ ] Audit logging configured

### Application Deployment
- [ ] Code deployed to production server
- [ ] Dependencies installed
- [ ] Application built successfully
- [ ] Process manager configured
- [ ] Health checks enabled

### Testing
- [ ] Automated tests passed
- [ ] Manual functionality testing completed
- [ ] Performance benchmarks met
- [ ] Security testing completed
- [ ] Load testing performed

### Post-Migration
- [ ] Monitoring configured
- [ ] Backup automation enabled
- [ ] Analytics tracking verified
- [ ] Documentation updated
- [ ] Team training completed

### Final Verification
- [ ] All services accessible via HTTPS
- [ ] Payment processing working
- [ ] Email notifications working
- [ ] Search functionality working
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness verified

**Migration completed successfully!** 🎉

Date: ________________  
Signed by: ________________  
Position: ________________
