-- Create colleges table for multi-tenancy
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Policies for colleges - only admins can manage colleges
CREATE POLICY "colleges_select_own" 
  ON public.colleges FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'college_id' = colleges.id::text
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "colleges_insert_admin" 
  ON public.colleges FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "colleges_update_admin" 
  ON public.colleges FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'college_id' = colleges.id::text
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_colleges_name ON public.colleges(name);
