-- Check and create profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE public.profiles (
      id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      full_name text,
      avatar_url text,
      user_type text CHECK (user_type IN ('creator', 'actor', 'admin')) NOT NULL DEFAULT 'creator',
      email_verified boolean DEFAULT false,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Check and create actor_profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'actor_profiles') THEN
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
  END IF;
END $$;

-- Check and create conversations table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversations') THEN
    CREATE TABLE public.conversations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      actor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(creator_id, actor_id)
    );
  END IF;
END $$;

-- Check and create messages table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'messages') THEN
    CREATE TABLE public.messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
      sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
      content text NOT NULL,
      read_at timestamptz,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create or replace handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create or replace handle_new_user function
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

-- Drop existing triggers if they exist and create new ones
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_actor_profiles_updated_at ON public.actor_profiles;
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_actor_profiles_updated_at
  BEFORE UPDATE ON public.actor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

  -- Actor profiles policies
  DROP POLICY IF EXISTS "Actor profiles are viewable by everyone" ON public.actor_profiles;
  DROP POLICY IF EXISTS "Actors can update own profile" ON public.actor_profiles;

  -- Conversations policies
  DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
  DROP POLICY IF EXISTS "Users can create conversations they're part of" ON public.conversations;

  -- Messages policies
  DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
  DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
END $$;

-- Create new policies
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

CREATE POLICY "Actor profiles are viewable by everyone"
  ON public.actor_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Actors can update own profile"
  ON public.actor_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own conversations"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() IN (creator_id, actor_id));

CREATE POLICY "Users can create conversations they're part of"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid() IN (creator_id, actor_id));

CREATE POLICY "Users can view messages in their conversations"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND auth.uid() IN (c.creator_id, c.actor_id)
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND auth.uid() IN (c.creator_id, c.actor_id)
    )
    AND auth.uid() = sender_id
  );

-- Drop existing indexes if they exist and create new ones
DROP INDEX IF EXISTS profiles_user_type_idx;
DROP INDEX IF EXISTS actor_profiles_verified_idx;
DROP INDEX IF EXISTS actor_profiles_featured_idx;

CREATE INDEX profiles_user_type_idx ON public.profiles (user_type);
CREATE INDEX actor_profiles_verified_idx ON public.actor_profiles (verified);
CREATE INDEX actor_profiles_featured_idx ON public.actor_profiles (featured);