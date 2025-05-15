/*
  # Authentication and User Profile Tables

  1. New Tables
    - `public.profiles`
      - `id` (uuid, primary key) - References auth.users
      - `full_name` (text) - User's full name
      - `avatar_url` (text) - Profile picture URL
      - `user_type` (text) - Type of user (creator/actor/admin)
      - `email_verified` (boolean) - Email verification status
      - `created_at` (timestamptz) - Account creation date
      - `updated_at` (timestamptz) - Last profile update
    
    - `public.actor_profiles`
      - `id` (uuid, primary key) - References profiles
      - `professional_name` (text) - Stage/professional name
      - `tagline` (text) - Short professional description
      - `bio` (text) - Detailed biography
      - `languages` (text[]) - Spoken languages
      - `video_types` (text[]) - Types of videos offered
      - `tones` (text[]) - Available presentation tones
      - `base_price` (integer) - Starting price in cents
      - `express_delivery_price` (integer) - Express service price
      - `express_delivery_time` (integer) - Express delivery days
      - `standard_delivery_time` (integer) - Standard delivery days
      - `verified` (boolean) - Account verification status
      - `featured` (boolean) - Featured status
      - `timezone` (text) - Actor's timezone
      - `working_hours` (jsonb) - Availability schedule
      - `created_at` (timestamptz) - Profile creation date
      - `updated_at` (timestamptz) - Last profile update

  2. Security
    - Enable RLS on all tables
    - Add policies for secure data access
    - Implement row-level security for user data protection

  3. Triggers
    - Automatic profile creation on user signup
    - Update timestamps on record modifications
*/

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  user_type text CHECK (user_type IN ('creator', 'actor', 'admin')) NOT NULL DEFAULT 'creator',
  email_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create actor_profiles table
CREATE TABLE public.actor_profiles (
  id uuid PRIMARY KEY REFERENCES public.profiles ON DELETE CASCADE,
  professional_name text,
  tagline text,
  bio text,
  languages text[] DEFAULT '{}',
  video_types text[] DEFAULT '{}',
  tones text[] DEFAULT '{}',
  base_price integer DEFAULT 0,
  express_delivery_price integer,
  express_delivery_time integer,
  standard_delivery_time integer DEFAULT 3,
  verified boolean DEFAULT false,
  featured boolean DEFAULT false,
  timezone text DEFAULT 'UTC',
  working_hours jsonb DEFAULT '{"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": false, "sunday": false, "start": "09:00", "end": "17:00"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_prices CHECK (base_price >= 0 AND (express_delivery_price IS NULL OR express_delivery_price >= 0)),
  CONSTRAINT valid_delivery_times CHECK (standard_delivery_time > 0 AND (express_delivery_time IS NULL OR express_delivery_time > 0))
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actor_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for actor_profiles
CREATE POLICY "Actor profiles are viewable by everyone"
  ON public.actor_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Actors can update own profile"
  ON public.actor_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email_verified)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email_confirmed
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_actor_profiles_updated_at
  BEFORE UPDATE ON public.actor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX profiles_user_type_idx ON public.profiles (user_type);
CREATE INDEX actor_profiles_verified_idx ON public.actor_profiles (verified);
CREATE INDEX actor_profiles_featured_idx ON public.actor_profiles (featured);