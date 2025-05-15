/*
  # Fix user signup process

  1. Changes
    - Modify profiles table to ensure user_type is properly handled during signup
    - Add trigger to handle new user creation
    - Update RLS policies to allow new user creation

  2. Security
    - Maintain existing RLS policies
    - Add policy for auth service to create profiles
*/

-- Ensure the trigger function exists
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    COALESCE((new.raw_user_meta_data->>'user_type')::text, 'creator')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow the trigger function to create profiles
CREATE POLICY "Allow trigger to create profiles"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);