/*
  # Add messaging system tables
  
  1. New Tables
    - conversations: Stores chat conversations between creators and actors
      - id (uuid, primary key)
      - creator_id (uuid, foreign key to profiles)
      - actor_id (uuid, foreign key to profiles)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - messages: Stores individual messages within conversations
      - id (uuid, primary key)
      - conversation_id (uuid, foreign key to conversations)
      - sender_id (uuid, foreign key to profiles)
      - content (text)
      - read_at (timestamp)
      - created_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and creating conversations
    - Add policies for viewing and sending messages

  3. Triggers
    - Add updated_at trigger for conversations
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(creator_id, actor_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations
  FOR SELECT
  USING (auth.uid() IN (creator_id, actor_id));

CREATE POLICY "Users can create conversations they're part of"
  ON public.conversations
  FOR INSERT
  WITH CHECK (auth.uid() IN (creator_id, actor_id));

-- Policies for messages
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

-- Add updated_at trigger for conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();