/*
  # Fix user signup and profile policies

  1. Changes
    - Drop existing trigger and policies
    - Update handle_new_user function with better NULL handling
    - Recreate trigger and policies with proper checks
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for public viewing and user management
*/

-- Drop existing trigger and policies
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create the user profile
  INSERT INTO public.profiles (
    id,
    full_name,
    email_verified,
    user_type,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email_confirmed, false),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'creator'),
    NOW(),
    NOW()
  );

  -- If user is an actor, create actor profile
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', 'creator') = 'actor' THEN
    INSERT INTO public.actor_profiles (
      id,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NOW(),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);