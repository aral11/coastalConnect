export interface EventOrganizer {
  id: number;
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  password_hash: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  organization_type: 'individual' | 'ngo' | 'government' | 'private' | 'religious' | 'cultural' | 'sports' | 'educational';
  website_url?: string;
  social_media_links?: string; // JSON string
  registration_number?: string;
  tax_id?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_documents?: string; // JSON string for document URLs
  admin_notes?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  total_events_organized: number;
  rating?: number;
  specialization?: string; // comma-separated categories they specialize in
}

export interface Event {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  category: 'kambala' | 'festival' | 'cultural' | 'religious' | 'sports' | 'educational' | 'workshop' | 'conference' | 'concert' | 'exhibition' | 'competition' | 'community' | 'charity' | 'other';
  subcategory?: string;
  location: 'udupi' | 'manipal' | 'malpe' | 'kaup' | 'other';
  detailed_address: string;
  venue_name?: string;
  venue_capacity?: number;
  event_date: Date;
  start_time: string;
  end_time: string;
  is_multi_day: boolean;
  end_date?: Date;
  entry_fee: number;
  is_free: boolean;
  registration_required: boolean;
  registration_url?: string;
  registration_deadline?: Date;
  max_attendees?: number;
  current_registrations: number;
  image_url?: string;
  gallery_images?: string; // JSON string for multiple images
  contact_phone: string;
  contact_email: string;
  website_url?: string;
  social_media_links?: string; // JSON string
  requirements?: string; // What attendees need to bring/know
  amenities?: string; // What's provided (parking, food, etc.)
  accessibility_info?: string;
  cancellation_policy?: string;
  refund_policy?: string;
  terms_conditions?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published' | 'cancelled' | 'completed';
  admin_approval_status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  rejection_reason?: string;
  is_featured: boolean;
  featured_until?: Date;
  priority_level: 'low' | 'medium' | 'high';
  tags?: string; // comma-separated tags
  age_restrictions?: string;
  languages?: string; // Languages used in event
  certificates_provided: boolean;
  ceu_credits?: number;
  sponsorship_info?: string; // JSON string
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
  last_modified_by: 'organizer' | 'admin';
  view_count: number;
  interested_count: number;
  going_count: number;
  weather_dependency: boolean;
  backup_plan?: string;
  live_streaming: boolean;
  recording_allowed: boolean;
  media_contact?: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  participant_age?: number;
  participant_gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  participant_city: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  dietary_restrictions?: string;
  special_requirements?: string;
  how_did_you_hear?: string;
  registration_date: Date;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_amount: number;
  payment_method?: string;
  payment_reference?: string;
  attendance_status: 'registered' | 'attended' | 'no_show' | 'cancelled';
  check_in_time?: Date;
  feedback_rating?: number;
  feedback_comments?: string;
  certificate_issued: boolean;
  certificate_url?: string;
}

export interface EventUpdate {
  id: number;
  event_id: number;
  organizer_id: number;
  update_type: 'announcement' | 'schedule_change' | 'venue_change' | 'cancellation' | 'general';
  title: string;
  content: string;
  is_important: boolean;
  sent_to_registered: boolean;
  created_at: Date;
}

export interface EventFeedback {
  id: number;
  event_id: number;
  participant_email: string;
  participant_name?: string;
  overall_rating: number;
  venue_rating?: number;
  organization_rating?: number;
  content_rating?: number;
  value_rating?: number;
  comments?: string;
  suggestions?: string;
  would_recommend: boolean;
  attend_future_events: boolean;
  favorite_aspects?: string;
  improvement_areas?: string;
  created_at: Date;
  is_public: boolean;
}

export interface EventAnalytics {
  event_id: number;
  date: Date;
  page_views: number;
  unique_visitors: number;
  registrations: number;
  cancellations: number;
  social_shares: number;
  click_through_rate?: number;
  conversion_rate?: number;
  referral_source?: string; // JSON string with sources
  demographics?: string; // JSON string with age, gender, location data
}
