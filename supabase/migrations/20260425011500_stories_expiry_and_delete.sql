/*
  # Stories: expiration and author-controlled delete

  1. Schema changes
    - `stories.expires_at` (timestamptz, nullable) — when the story should disappear from the public list. NULL means it stays forever.
    - `stories.delete_token` (text, nullable) — random token saved by the author's browser; required to delete the story later.
    - Index on `expires_at` to make filtering active stories cheap.
  2. Security
    - DELETE on `stories` is locked down (no public delete policy). All deletes must go through the `delete_story_with_token` SECURITY DEFINER function below.
    - `delete_story_with_token(p_id, p_token)` only deletes the row when both id and delete_token match exactly. Returns true on success, false otherwise.
*/

ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS expires_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS delete_token text NULL;

CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories (expires_at);

CREATE OR REPLACE FUNCTION delete_story_with_token(p_id uuid, p_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted int;
BEGIN
  IF p_token IS NULL OR length(p_token) < 8 THEN
    RETURN false;
  END IF;

  DELETE FROM stories
  WHERE id = p_id AND delete_token = p_token;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted > 0;
END;
$$;

REVOKE ALL ON FUNCTION delete_story_with_token(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION delete_story_with_token(uuid, text) TO anon, authenticated;
