/*
  # Update user handling and policies
  
  1. Updates
    - Recreates handle_new_user function with improved user type handling
    - Updates trigger for user creation
    - Ensures RLS policies exist with proper checks
  
  2. Changes
    - Drops and recreates user creation trigger
    - Updates handle_new_user function
    - Safely manages RLS policies
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
    NEW.raw_user_meta_data->>'full_name',
    NEW.email_confirmed,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'creator'),
    NOW(),
    NOW()
  );

  -- If user is an actor, create actor profile
  IF (NEW.raw_user_meta_data->>'user_type' = 'actor') THEN
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

-- Update RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);