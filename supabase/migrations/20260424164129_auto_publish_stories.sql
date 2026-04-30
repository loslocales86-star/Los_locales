/*
  # Auto-publish submitted stories

  1. Changes
    - `stories.approved` default flipped to `true` so new stories appear immediately
    - Replace restrictive SELECT policy with an "anyone can read" policy, since stories are intentionally public content on the landing page
  2. Notes
    - Existing rows keep their current `approved` value, but the SELECT policy no longer filters on it
*/

ALTER TABLE stories ALTER COLUMN approved SET DEFAULT true;

UPDATE stories SET approved = true WHERE approved = false;

DROP POLICY IF EXISTS "Anyone can read approved stories" ON stories;

CREATE POLICY "Anyone can read stories"
  ON stories FOR SELECT
  TO anon, authenticated
  USING (true);
