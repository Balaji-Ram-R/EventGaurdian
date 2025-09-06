-- Create user profiles table that references auth.users
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  student_id TEXT, -- Only for students
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(email, college_id),
  UNIQUE(student_id, college_id) -- Student ID unique within college
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user profiles - users can only see profiles from their college
CREATE POLICY "user_profiles_select_own_college" 
  ON public.user_profiles FOR SELECT 
  USING (
    college_id::text = (
      SELECT raw_user_meta_data->>'college_id' 
      FROM auth.users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "user_profiles_insert_own" 
  ON public.user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update_own" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_college_id ON public.user_profiles(college_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_student_id ON public.user_profiles(student_id, college_id);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    college_id, 
    role, 
    name, 
    email,
    department,
    student_id
  )
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'college_id')::uuid,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'student_id'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
