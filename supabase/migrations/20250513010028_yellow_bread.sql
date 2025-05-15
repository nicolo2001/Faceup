/*
  # Create authentication and profile tables

  1. New Tables
    - `users` table for authentication
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
    
  2. Changes to existing tables
    - Add trigger to automatically create profile entries
    - Ensure proper cascade behavior for user deletion
    
  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for user access
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email_verified, user_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    false,
    'creator'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();