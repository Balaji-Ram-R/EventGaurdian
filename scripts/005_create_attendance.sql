-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  method TEXT NOT NULL DEFAULT 'qr' CHECK (method IN ('qr', 'manual')),
  checked_in_by UUID REFERENCES public.user_profiles(id), -- Admin who marked manually
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate attendance
  UNIQUE(registration_id)
);

-- Enable RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Policies for attendance
CREATE POLICY "attendance_select_own_college" 
  ON public.attendance FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.registrations r
      JOIN public.events e ON e.id = r.event_id
      WHERE r.id = attendance.registration_id 
      AND e.college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "attendance_insert_own_or_admin" 
  ON public.attendance FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.registrations r
      JOIN public.events e ON e.id = r.event_id
      WHERE r.id = attendance.registration_id 
      AND e.college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
      AND (
        r.student_id = auth.uid() -- Student checking themselves in
        OR auth.uid() IN (
          SELECT id FROM public.user_profiles 
          WHERE role = 'admin'
        ) -- Admin marking attendance
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_registration_id ON public.attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_attendance_checked_in_at ON public.attendance(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_attendance_method ON public.attendance(method);
