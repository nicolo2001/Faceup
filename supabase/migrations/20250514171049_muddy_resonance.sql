/*
  # Authentication System Setup

  1. New Tables
    - `auth_attempts` - Track login attempts for rate limiting
    - `verification_codes` - Store OTP codes
    - `user_sessions` - Track active sessions
    
  2. Security
    - Rate limiting for login attempts
    - OTP verification
    - Session management
    - Password security rules
*/

-- Track login attempts for rate limiting
CREATE TABLE auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  ip_address text NOT NULL,
  attempt_time timestamptz DEFAULT now(),
  success boolean DEFAULT false
);

CREATE INDEX auth_attempts_email_idx ON auth_attempts (email);
CREATE INDEX auth_attempts_ip_idx ON auth_attempts (ip_address);

-- Store verification codes
CREATE TABLE verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  code text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  used_at timestamptz,
  CONSTRAINT valid_code CHECK (length(code) = 6 AND code ~ '^[0-9]+$')
);

CREATE INDEX verification_codes_user_id_idx ON verification_codes (user_id);

-- Track user sessions
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  device_info jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz
);

CREATE INDEX user_sessions_user_id_idx ON user_sessions (user_id);

-- Update profiles table
ALTER TABLE profiles
ADD COLUMN phone_number text,
ADD COLUMN phone_verified boolean DEFAULT false,
ADD COLUMN failed_attempts integer DEFAULT 0,
ADD COLUMN last_failed_attempt timestamptz,
ADD COLUMN account_locked_until timestamptz,
ADD COLUMN terms_accepted boolean DEFAULT false,
ADD COLUMN terms_accepted_at timestamptz,
ADD COLUMN privacy_accepted boolean DEFAULT false,
ADD COLUMN privacy_accepted_at timestamptz;

-- Enable RLS
ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own verification codes"
  ON verification_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Functions for OTP handling
CREATE OR REPLACE FUNCTION generate_verification_code(user_id uuid, code_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code text;
BEGIN
  -- Generate 6-digit code
  new_code := lpad(floor(random() * 1000000)::text, 6, '0');
  
  -- Insert new code
  INSERT INTO verification_codes (user_id, code, type, expires_at)
  VALUES (user_id, new_code, code_type, now() + interval '15 minutes');
  
  RETURN new_code;
END;
$$;