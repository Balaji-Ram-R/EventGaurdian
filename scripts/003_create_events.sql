-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'academic', 'cultural', 'sports', 'workshop', etc.
  venue TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_opens_at TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_closes_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_by UUID NOT NULL REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (ends_at > starts_at),
  CHECK (registration_closes_at <= starts_at),
  CHECK (registration_opens_at < registration_closes_at)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policies for events - scoped by college
CREATE POLICY "events_select_own_college" 
  ON public.events FOR SELECT 
  USING (
    college_id::text = (
      SELECT raw_user_meta_data->>'college_id' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "events_insert_admin" 
  ON public.events FOR INSERT 
  WITH CHECK (
    college_id::text = (
      SELECT raw_user_meta_data->>'college_id' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
    AND auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
    )
  );

CREATE POLICY "events_update_admin" 
  ON public.events FOR UPDATE 
  USING (
    college_id::text = (
      SELECT raw_user_meta_data->>'college_id' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
    AND auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
    )
  );

CREATE POLICY "events_delete_admin" 
  ON public.events FOR DELETE 
  USING (
    college_id::text = (
      SELECT raw_user_meta_data->>'college_id' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
    AND auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_college_id ON public.events(college_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(type);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON public.events(starts_at);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
