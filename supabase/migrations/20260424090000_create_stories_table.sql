/*
  # Create stories table for public testimonials

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `author_name` (text)
      - `country` (text)
      - `tour_name` (text)
      - `rating` (int)
      - `story` (text)
      - `email` (text)
      - `approved` (boolean)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `stories`
    - Allow anonymous INSERT so public users can submit stories
    - Allow anonymous SELECT only for approved stories (later migration broadens this)
*/

CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  tour_name text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  story text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a story" ON stories;
CREATE POLICY "Anyone can submit a story"
  ON stories
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read approved stories" ON stories;
CREATE POLICY "Anyone can read approved stories"
  ON stories
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);
