-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to prevent duplicate feedback
  UNIQUE(registration_id)
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies for feedback
CREATE POLICY "feedback_select_own_college" 
  ON public.feedback FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.registrations r
      JOIN public.events e ON e.id = r.event_id
      WHERE r.id = feedback.registration_id 
      AND e.college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "feedback_insert_own_student" 
  ON public.feedback FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.registrations r
      JOIN public.attendance a ON a.registration_id = r.id
      WHERE r.id = feedback.registration_id 
      AND r.student_id = auth.uid() -- Only the student who attended can give feedback
    )
  );

CREATE POLICY "feedback_update_own_student" 
  ON public.feedback FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.registrations r
      WHERE r.id = feedback.registration_id 
      AND r.student_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_registration_id ON public.feedback(registration_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at);
