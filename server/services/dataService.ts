/**
 * High-level Data Service Layer
 * Provides business logic and common operations using the database abstraction layer
 * All application code should use this service instead of direct database calls
 */

import { getDatabaseService } from './databaseService';
import { DatabaseAdapter } from './databaseService';

// Type definitions for business entities
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'vendor' | 'customer' | 'event_organizer';
  avatar_url?: string;
  is_verified: boolean;
  is_active: boolean;
  vendor_status?: 'pending' | 'approved' | 'rejected';
  business_name?: string;
  business_type?: 'homestay' | 'restaurant' | 'driver' | 'event_services';
  business_description?: string;
  business_address?: string;
  organization_name?: string;
  organization_type?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Service {
  id: string;
  vendor_id: string;
  category_id?: string;
  service_type: 'homestay' | 'restaurant' | 'driver' | 'event_services';
  name: string;
  description?: string;
  short_description?: string;
  address?: string;
  location_id?: string;
  latitude?: number;
  longitude?: number;
  base_price: number;
  price_per_unit?: number;
  currency: string;
  service_details?: any;
  primary_image_id?: string;
  gallery_images?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_active: boolean;
  is_featured: boolean;
  average_rating: number;
  total_reviews: number;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  customer_id: string;
  vendor_id: string;
  service_id: string;
  service_type: string;
  check_in_date?: string;
  check_out_date?: string;
  guests: number;
  units: number;
  booking_details?: any;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
  base_amount: number;
  tax_amount: number;
  convenience_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  payment_gateway?: string;
  payment_details?: any;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  cancellation_reason?: string;
  cancelled_by?: string;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  cancelled_at?: string;
}

export interface Event {
  id: string;
  organizer_id: string;
  category_id?: string;
  title: string;
  description?: string;
  short_description?: string;
  category?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  duration_hours?: number;
  venue_name?: string;
  venue_address?: string;
  location_id?: string;
  max_capacity: number;
  current_registrations: number;
  ticket_price: number;
  currency: string;
  featured_image_id?: string;
  gallery_images?: string[];
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'published' | 'cancelled' | 'completed';
  is_featured: boolean;
  requires_approval: boolean;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  approved_at?: string;
  approved_by?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  type: 'city' | 'area' | 'landmark';
  parent_id?: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  pincode?: string;
  is_popular: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DropdownOption {
  id: string;
  category: string;
  label: string;
  value: string;
  display_order: number;
  metadata?: any;
  is_active: boolean;
  created_at: string;
}

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  value_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  is_public: boolean;
  updated_at: string;
  updated_by?: string;
}

// Data Service Implementation
export class DataService {
  private db = getDatabaseService();

  constructor() {
    // Initialize database connection if not already done
    this.initialize();
  }

  private async initialize() {
    if (!this.db.isConnected()) {
      await this.db.initialize();
    }
  }

  // ==============================================
  // CONFIGURATION & STATIC DATA
  // ==============================================

  async getServiceCategories(activeOnly = true): Promise<ServiceCategory[]> {
    const options = activeOnly ? { where: { is_active: true } } : {};
    options.orderBy = 'display_order asc';
    
    const result = await this.db.select<ServiceCategory>('service_categories', options);
    return result.data || [];
  }

  async getLocations(popularOnly = false): Promise<Location[]> {
    const options = popularOnly ? { where: { is_popular: true, is_active: true } } : { where: { is_active: true } };
    options.orderBy = 'display_order asc';
    
    const result = await this.db.select<Location>('locations', options);
    return result.data || [];
  }

  async getDropdownOptions(category: string): Promise<DropdownOption[]> {
    const result = await this.db.select<DropdownOption>('dropdown_options', {
      where: { category, is_active: true },
      orderBy: 'display_order asc'
    });
    return result.data || [];
  }

  async getSiteConfig(key?: string, publicOnly = false): Promise<SiteConfig | SiteConfig[]> {
    if (key) {
      const where = publicOnly ? { key, is_public: true } : { key };
      const result = await this.db.select<SiteConfig>('site_config', { where });
      return result.data?.[0] || null;
    } else {
      const where = publicOnly ? { is_public: true } : {};
      const result = await this.db.select<SiteConfig>('site_config', { where });
      return result.data || [];
    }
  }

  async updateSiteConfig(key: string, value: string, updatedBy?: string): Promise<boolean> {
    const result = await this.db.update('site_config', 
      { value, updated_at: new Date().toISOString(), updated_by: updatedBy },
      { key }
    );
    return !result.error;
  }

  // ==============================================
  // USER MANAGEMENT
  // ==============================================

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.select<User>('users', { where: { id } });
    return result.data?.[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.select<User>('users', { where: { email } });
    return result.data?.[0] || null;
  }

  async createUser(userData: Partial<User>): Promise<User | null> {
    const result = await this.db.insert<User>('users', {
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return result.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const result = await this.db.update<User>('users', 
      { ...userData, updated_at: new Date().toISOString() },
      { id }
    );
    return result.data?.[0] || null;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    const result = await this.db.select<User>('users', { 
      where: { role, is_active: true },
      orderBy: 'created_at desc'
    });
    return result.data || [];
  }

  async getPendingVendors(): Promise<User[]> {
    const result = await this.db.select<User>('users', { 
      where: { role: 'vendor', vendor_status: 'pending' },
      orderBy: 'created_at desc'
    });
    return result.data || [];
  }

  // ==============================================
  // SERVICE MANAGEMENT
  // ==============================================

  async getServices(options: {
    type?: string;
    status?: string;
    vendorId?: string;
    locationId?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<Service[]> {
    const where: any = {};
    
    if (options.type) where.service_type = options.type;
    if (options.status) where.status = options.status;
    if (options.vendorId) where.vendor_id = options.vendorId;
    if (options.locationId) where.location_id = options.locationId;
    if (options.featured !== undefined) where.is_featured = options.featured;

    const result = await this.db.select<Service>('services', {
      where,
      orderBy: 'created_at desc',
      limit: options.limit,
      offset: options.offset
    });
    return result.data || [];
  }

  async getServiceById(id: string): Promise<Service | null> {
    const result = await this.db.select<Service>('services', { where: { id } });
    return result.data?.[0] || null;
  }

  async createService(serviceData: Partial<Service>): Promise<Service | null> {
    const result = await this.db.insert<Service>('services', {
      ...serviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return result.data;
  }

  async updateService(id: string, serviceData: Partial<Service>): Promise<Service | null> {
    const result = await this.db.update<Service>('services', 
      { ...serviceData, updated_at: new Date().toISOString() },
      { id }
    );
    return result.data?.[0] || null;
  }

  async approveService(id: string, approvedBy: string): Promise<Service | null> {
    const result = await this.db.update<Service>('services', {
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: approvedBy,
      updated_at: new Date().toISOString()
    }, { id });
    return result.data?.[0] || null;
  }

  async searchServices(query: string, type?: string, locationId?: string): Promise<Service[]> {
    // For SQL Server
    if (this.db.getType() === 'sqlserver') {
      const sql = `
        SELECT * FROM services 
        WHERE status = 'approved' 
        AND is_active = 1
        AND (name LIKE @param1 OR description LIKE @param1)
        ${type ? 'AND service_type = @param2' : ''}
        ${locationId ? `AND location_id = @param${type ? '3' : '2'}` : ''}
        ORDER BY is_featured DESC, average_rating DESC
      `;
      
      const params = [`%${query}%`];
      if (type) params.push(type);
      if (locationId) params.push(locationId);
      
      const result = await this.db.query<Service>(sql, params);
      return result.data || [];
    } else {
      // For Supabase, use text search
      const where: any = {
        status: 'approved',
        is_active: true
      };
      
      if (type) where.service_type = type;
      if (locationId) where.location_id = locationId;
      
      const result = await this.db.select<Service>('services', {
        where,
        orderBy: 'is_featured desc, average_rating desc'
      });
      
      // Filter by query on client side for Supabase
      const filtered = result.data?.filter(service => 
        service.name.toLowerCase().includes(query.toLowerCase()) ||
        service.description?.toLowerCase().includes(query.toLowerCase())
      ) || [];
      
      return filtered;
    }
  }

  // ==============================================
  // BOOKING MANAGEMENT
  // ==============================================

  async getBookings(options: {
    customerId?: string;
    vendorId?: string;
    serviceId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Booking[]> {
    const where: any = {};
    
    if (options.customerId) where.customer_id = options.customerId;
    if (options.vendorId) where.vendor_id = options.vendorId;
    if (options.serviceId) where.service_id = options.serviceId;
    if (options.status) where.status = options.status;

    const result = await this.db.select<Booking>('bookings', {
      where,
      orderBy: 'created_at desc',
      limit: options.limit,
      offset: options.offset
    });
    return result.data || [];
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const result = await this.db.select<Booking>('bookings', { where: { id } });
    return result.data?.[0] || null;
  }

  async getBookingByReference(reference: string): Promise<Booking | null> {
    const result = await this.db.select<Booking>('bookings', { where: { booking_reference: reference } });
    return result.data?.[0] || null;
  }

  async createBooking(bookingData: Partial<Booking>): Promise<Booking | null> {
    const result = await this.db.insert<Booking>('bookings', {
      ...bookingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return result.data;
  }

  async updateBooking(id: string, bookingData: Partial<Booking>): Promise<Booking | null> {
    const result = await this.db.update<Booking>('bookings', 
      { ...bookingData, updated_at: new Date().toISOString() },
      { id }
    );
    return result.data?.[0] || null;
  }

  async confirmBooking(id: string): Promise<Booking | null> {
    const result = await this.db.update<Booking>('bookings', {
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { id });
    return result.data?.[0] || null;
  }

  async cancelBooking(id: string, reason: string, cancelledBy: string): Promise<Booking | null> {
    const result = await this.db.update<Booking>('bookings', {
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_by: cancelledBy,
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { id });
    return result.data?.[0] || null;
  }

  // ==============================================
  // EVENT MANAGEMENT
  // ==============================================

  async getEvents(options: {
    organizerId?: string;
    status?: string;
    featured?: boolean;
    upcoming?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<Event[]> {
    const where: any = {};
    
    if (options.organizerId) where.organizer_id = options.organizerId;
    if (options.status) where.status = options.status;
    if (options.featured !== undefined) where.is_featured = options.featured;
    if (options.upcoming) {
      where.event_date = { gte: new Date().toISOString().split('T')[0] };
    }

    const result = await this.db.select<Event>('events', {
      where,
      orderBy: 'event_date asc',
      limit: options.limit,
      offset: options.offset
    });
    return result.data || [];
  }

  async getEventById(id: string): Promise<Event | null> {
    const result = await this.db.select<Event>('events', { where: { id } });
    return result.data?.[0] || null;
  }

  async createEvent(eventData: Partial<Event>): Promise<Event | null> {
    const result = await this.db.insert<Event>('events', {
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return result.data;
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
    const result = await this.db.update<Event>('events', 
      { ...eventData, updated_at: new Date().toISOString() },
      { id }
    );
    return result.data?.[0] || null;
  }

  async approveEvent(id: string, approvedBy: string): Promise<Event | null> {
    const result = await this.db.update<Event>('events', {
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: approvedBy,
      updated_at: new Date().toISOString()
    }, { id });
    return result.data?.[0] || null;
  }

  async publishEvent(id: string): Promise<Event | null> {
    const result = await this.db.update<Event>('events', {
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { id });
    return result.data?.[0] || null;
  }

  // ==============================================
  // ANALYTICS
  // ==============================================

  async trackEvent(eventData: {
    event_type: string;
    event_name?: string;
    user_id?: string;
    session_id?: string;
    properties?: any;
    page_url?: string;
    page_title?: string;
    referrer?: string;
    user_agent?: string;
    ip_address?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    country?: string;
    city?: string;
  }): Promise<boolean> {
    const result = await this.db.insert('analytics_events', {
      ...eventData,
      created_at: new Date().toISOString()
    });
    return !result.error;
  }

  async getAnalyticsSummary(days = 30): Promise<any> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    
    const sql = `
      SELECT 
        event_type,
        COUNT(*) as event_count,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM analytics_events 
      WHERE created_at >= @param1
      GROUP BY event_type
      ORDER BY event_count DESC
    `;
    
    const result = await this.db.query(sql, [dateFrom.toISOString()]);
    return result.data || [];
  }

  async getDashboardStats(): Promise<any> {
    const stats = {
      totalUsers: 0,
      totalServices: 0,
      totalBookings: 0,
      totalEvents: 0,
      recentBookings: [],
      pendingApprovals: 0
    };

    // Get counts
    const userCount = await this.db.select('users', { select: 'count(*)', where: { is_active: true } });
    const serviceCount = await this.db.select('services', { select: 'count(*)', where: { status: 'approved' } });
    const bookingCount = await this.db.select('bookings', { select: 'count(*)' });
    const eventCount = await this.db.select('events', { select: 'count(*)', where: { status: 'published' } });

    stats.totalUsers = userCount.count || 0;
    stats.totalServices = serviceCount.count || 0;
    stats.totalBookings = bookingCount.count || 0;
    stats.totalEvents = eventCount.count || 0;

    // Get recent bookings
    const recentBookings = await this.getBookings({ limit: 5 });
    stats.recentBookings = recentBookings;

    // Get pending approvals
    const pendingServices = await this.db.select('services', { select: 'count(*)', where: { status: 'pending' } });
    const pendingEvents = await this.db.select('events', { select: 'count(*)', where: { status: 'pending_approval' } });
    stats.pendingApprovals = (pendingServices.count || 0) + (pendingEvents.count || 0);

    return stats;
  }

  // ==============================================
  // UTILITY METHODS
  // ==============================================

  async executeTransaction<T>(fn: (tx: DatabaseAdapter) => Promise<T>): Promise<T> {
    return this.db.transaction(fn);
  }

  async healthCheck(): Promise<{ status: string; database: string; connected: boolean }> {
    return {
      status: 'ok',
      database: this.db.getType(),
      connected: this.db.isConnected()
    };
  }
}

// Singleton instance
let dataService: DataService | null = null;

export function getDataService(): DataService {
  if (!dataService) {
    dataService = new DataService();
  }
  return dataService;
}

export default DataService;
