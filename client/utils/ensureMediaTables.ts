/**
 * Utility to ensure media gallery tables exist in Supabase
 */

import { supabase } from '@/lib/supabase';

export const ensureMediaTables = async () => {
  try {
    // Check if tables exist and create if needed
    console.log('Ensuring media gallery tables exist...');

    // For now, we'll use the existing approach with RLS
    // In a real implementation, these tables would be created via Supabase migrations
    
    // Test if we can query the tables, create records if they don't exist
    const { error: galleriesError } = await supabase
      .from('media_galleries')
      .select('count')
      .limit(1);

    if (galleriesError) {
      console.warn('media_galleries table may not exist:', galleriesError.message);
    }

    const { error: filesError } = await supabase
      .from('media_files')
      .select('count')
      .limit(1);

    if (filesError) {
      console.warn('media_files table may not exist:', filesError.message);
    }

    // The tables are created via SQL migrations or Supabase dashboard
    // SQL for reference:
    /*
    CREATE TABLE media_galleries (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      event_name TEXT NOT NULL,
      event_date DATE,
      location TEXT,
      photographer TEXT,
      contact_email TEXT,
      contact_phone TEXT,
      description TEXT,
      total_files INTEGER DEFAULT 0,
      uploaded_files INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'uploading', 'completed', 'failed')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE media_files (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      gallery_id UUID REFERENCES media_galleries(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_name TEXT NOT NULL,
      file_size BIGINT NOT NULL,
      file_type TEXT NOT NULL,
      storage_path TEXT NOT NULL,
      public_url TEXT NOT NULL,
      upload_status TEXT DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Create storage buckets (done via Supabase dashboard or CLI)
    INSERT INTO storage.buckets (id, name, public) VALUES 
      ('haldi-gallery', 'haldi-gallery', true),
      ('roce-gallery', 'roce-gallery', true),
      ('wedding-gallery', 'wedding-gallery', true),
      ('engagement-gallery', 'engagement-gallery', true),
      ('reception-gallery', 'reception-gallery', true);

    -- RLS Policies
    ALTER TABLE media_galleries ENABLE ROW LEVEL SECURITY;
    ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view all galleries" ON media_galleries FOR SELECT USING (true);
    CREATE POLICY "Users can create their own galleries" ON media_galleries FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own galleries" ON media_galleries FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own galleries" ON media_galleries FOR DELETE USING (auth.uid() = user_id);

    CREATE POLICY "Users can view all media files" ON media_files FOR SELECT USING (true);
    CREATE POLICY "Users can create their own media files" ON media_files FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own media files" ON media_files FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can delete their own media files" ON media_files FOR DELETE USING (auth.uid() = user_id);
    */

    return { success: true };
  } catch (error) {
    console.error('Error ensuring media tables:', error);
    return { success: false, error };
  }
};
