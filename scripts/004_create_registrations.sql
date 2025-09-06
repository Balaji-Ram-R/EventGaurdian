-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'waitlisted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate registrations
  UNIQUE(event_id, student_id)
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Policies for registrations
CREATE POLICY "registrations_select_own_college" 
  ON public.registrations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.events e 
      WHERE e.id = registrations.event_id 
      AND e.college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "registrations_insert_student" 
  ON public.registrations FOR INSERT 
  WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM public.events e 
      WHERE e.id = registrations.event_id 
      AND e.college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "registrations_update_own" 
  ON public.registrations FOR UPDATE 
  USING (
    auth.uid() = student_id 
    OR auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
      AND college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "registrations_delete_own" 
  ON public.registrations FOR DELETE 
  USING (
    auth.uid() = student_id 
    OR auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
      AND college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student_id ON public.registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at);
