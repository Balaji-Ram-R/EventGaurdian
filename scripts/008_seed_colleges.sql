-- Seed colleges table with sample data
INSERT INTO public.colleges (id, name, timezone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Massachusetts Institute of Technology', 'America/New_York'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Stanford University', 'America/Los_Angeles'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Harvard University', 'America/New_York'),
  ('550e8400-e29b-41d4-a716-446655440004', 'University of California, Berkeley', 'America/Los_Angeles'),
  ('550e8400-e29b-41d4-a716-446655440005', 'California Institute of Technology', 'America/Los_Angeles')
ON CONFLICT (id) DO NOTHING;
