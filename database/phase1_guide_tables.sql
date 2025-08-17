-- Phase 1 Guide Tables
-- This migration creates the essential tables for the CoastalConnect Phase 1 Visitor Guide

-- Create guide_categories table
CREATE TABLE IF NOT EXISTS guide_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create guide_items table
CREATE TABLE IF NOT EXISTS guide_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES guide_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT CHECK (city IN ('Udupi', 'Manipal')),
  area TEXT,
  phone TEXT,
  website TEXT,
  gmaps_url TEXT,
  price_range TEXT,
  cuisine_or_type TEXT,
  tags TEXT[],
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create guide_feedback table
CREATE TABLE IF NOT EXISTS guide_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  message TEXT,
  want_all_in_one BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guide_items_category_id ON guide_items(category_id);
CREATE INDEX IF NOT EXISTS idx_guide_items_city ON guide_items(city);
CREATE INDEX IF NOT EXISTS idx_guide_items_featured ON guide_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_guide_items_verified ON guide_items(is_verified);
CREATE INDEX IF NOT EXISTS idx_guide_categories_sort_order ON guide_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_guide_items_sort_order ON guide_items(sort_order);

-- Enable Row Level Security (RLS)
ALTER TABLE guide_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guide_categories
-- Allow public read access
CREATE POLICY "Allow public read access on guide_categories"
  ON guide_categories FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Only service role can modify
CREATE POLICY "Only service role can modify guide_categories"
  ON guide_categories FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for guide_items
-- Allow public read access to active and verified items
CREATE POLICY "Allow public read access on guide_items"
  ON guide_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can modify
CREATE POLICY "Only service role can modify guide_items"
  ON guide_items FOR ALL
  TO service_role
  USING (true);

-- RLS Policies for guide_feedback
-- Allow public insert (anyone can submit feedback)
CREATE POLICY "Allow public insert on guide_feedback"
  ON guide_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read/modify feedback
CREATE POLICY "Only service role can read guide_feedback"
  ON guide_feedback FOR SELECT
  TO service_role
  USING (true);

-- Insert sample categories
INSERT INTO guide_categories (name, slug, sort_order, active) VALUES
  ('Restaurants', 'restaurants', 1, true),
  ('Stays', 'stays', 2, true),
  ('Places', 'places', 3, true),
  ('Experiences', 'experiences', 4, true),
  ('Transport', 'transport', 5, true),
  ('Festivals', 'festivals', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample guide items for each category
INSERT INTO guide_items (category_id, title, description, address, city, area, phone, price_range, cuisine_or_type, tags, image_url, is_verified, is_featured, sort_order) VALUES
  -- Restaurants
  ((SELECT id FROM guide_categories WHERE slug = 'restaurants'), 
   'Woodlands Restaurant', 
   'Famous South Indian vegetarian restaurant serving authentic Udupi cuisine with traditional flavors.',
   'Car Street, Udupi',
   'Udupi',
   'Car Street',
   '+91 820 252 0187',
   '₹200-500',
   'South Indian Vegetarian',
   ARRAY['vegetarian', 'south-indian', 'traditional', 'family-friendly'],
   'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
   true,
   true,
   1),
   
  ((SELECT id FROM guide_categories WHERE slug = 'restaurants'),
   'Mitra Samaj',
   'Iconic Udupi restaurant known for its masala dosa and filter coffee since 1930.',
   'Car Street, Udupi',
   'Udupi',
   'Car Street',
   '+91 820 252 0099',
   '₹100-300',
   'South Indian Traditional',
   ARRAY['vegetarian', 'breakfast', 'dosa', 'traditional', 'historic'],
   'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400',
   true,
   true,
   2),

  -- Stays
  ((SELECT id FROM guide_categories WHERE slug = 'stays'),
   'The Ocean Pearl',
   'Luxury hotel with modern amenities and excellent service in the heart of Manipal.',
   'Manipal-576104',
   'Manipal',
   'Manipal Center',
   '+91 820 292 0000',
   '₹4000-8000',
   'Luxury Hotel',
   ARRAY['luxury', 'business', 'wifi', 'restaurant', 'pool'],
   'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
   true,
   true,
   1),

  -- Places
  ((SELECT id FROM guide_categories WHERE slug = 'places'),
   'Krishna Temple',
   'Historic temple dedicated to Lord Krishna, famous for its architecture and spiritual significance.',
   'Car Street, Udupi',
   'Udupi',
   'Temple Area',
   '+91 820 252 0020',
   'Free',
   'Religious Temple',
   ARRAY['temple', 'spiritual', 'heritage', 'architecture', 'krishna'],
   'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
   true,
   true,
   1),
   
  ((SELECT id FROM guide_categories WHERE slug = 'places'),
   'Malpe Beach',
   'Beautiful beach with golden sand, water sports, and stunning sunset views.',
   'Malpe, Udupi',
   'Udupi',
   'Malpe',
   '+91 820 252 1234',
   'Free',
   'Beach',
   ARRAY['beach', 'sunset', 'water-sports', 'family', 'photography'],
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
   true,
   true,
   2),

  -- Experiences
  ((SELECT id FROM guide_categories WHERE slug = 'experiences'),
   'Manipal Heritage Village',
   'Cultural village showcasing traditional Karnataka architecture and lifestyle.',
   'Manipal',
   'Manipal',
   'Heritage Area',
   '+91 820 292 1000',
   '₹50-100',
   'Cultural Heritage',
   ARRAY['heritage', 'culture', 'traditional', 'educational', 'family'],
   'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
   true,
   false,
   1),

  -- Transport
  ((SELECT id FROM guide_categories WHERE slug = 'transport'),
   'Udupi Auto Stand',
   'Main auto-rickshaw stand for local transportation within Udupi city.',
   'City Bus Stand, Udupi',
   'Udupi',
   'City Center',
   '+91 820 252 0500',
   '₹20-100',
   'Auto Rickshaw',
   ARRAY['auto', 'local-transport', 'convenient', 'affordable'],
   'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
   true,
   false,
   1),

  -- Festivals
  ((SELECT id FROM guide_categories WHERE slug = 'festivals'),
   'Paryaya Festival',
   'Biennial festival celebrating the transfer of temple administration, featuring grand processions.',
   'Krishna Temple, Udupi',
   'Udupi',
   'Temple Area',
   '+91 820 252 0020',
   'Free',
   'Religious Festival',
   ARRAY['festival', 'religious', 'procession', 'cultural', 'biennial'],
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
   true,
   true,
   1)

ON CONFLICT DO NOTHING;

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_guide_categories_updated_at 
  BEFORE UPDATE ON guide_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_items_updated_at 
  BEFORE UPDATE ON guide_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
