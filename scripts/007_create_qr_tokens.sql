-- Create QR tokens table for attendance check-in
CREATE TABLE IF NOT EXISTS public.qr_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure token is not expired
  CHECK (expires_at > created_at)
);

-- Enable RLS
ALTER TABLE public.qr_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for QR tokens
CREATE POLICY "qr_tokens_select_own_college" 
  ON public.qr_tokens FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.events e 
      WHERE e.id = qr_tokens.event_id 
      AND e.college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "qr_tokens_insert_admin" 
  ON public.qr_tokens FOR INSERT 
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.user_profiles 
      WHERE role = 'admin'
    )
    AND EXISTS (
      SELECT 1 FROM public.events e 
      WHERE e.id = qr_tokens.event_id 
      AND e.college_id::text = (
        SELECT raw_user_meta_data->>'college_id' 
        FROM auth.users 
        WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_qr_tokens_event_id ON public.qr_tokens(event_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_token ON public.qr_tokens(token);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_expires_at ON public.qr_tokens(expires_at);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_qr_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.qr_tokens WHERE expires_at < NOW();
$$;
