/*
  # Create reservations table for Los Locales tours

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `full_name` (text) - customer full name
      - `email` (text) - customer email
      - `whatsapp` (text) - customer whatsapp number
      - `tour_selected` (text) - name of the selected tour
      - `preferred_date` (date) - preferred date for the tour
      - `number_of_people` (int) - number of people
      - `message` (text) - optional message
      - `created_at` (timestamptz) - creation timestamp
  2. Security
    - Enable RLS on `reservations`
    - Allow anonymous INSERT so public users can submit reservations from the landing page
    - No public SELECT/UPDATE/DELETE - reservation data is private to the business
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  tour_selected text NOT NULL DEFAULT '',
  preferred_date date,
  number_of_people int NOT NULL DEFAULT 1,
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a reservation"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
