/*
  Send reservation notifications via Edge Function.

  Flow:
    reservations INSERT -> pg trigger -> HTTP POST to Edge Function
    Edge Function -> Resend -> Gmail inbox
*/

CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON TABLE private.app_config FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.get_app_config(config_key text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT value
  FROM private.app_config
  WHERE key = config_key
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_reservation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  endpoint text;
  webhook_secret text;
  payload jsonb;
BEGIN
  endpoint := private.get_app_config('reservation_mailer_endpoint');
  webhook_secret := private.get_app_config('reservation_mailer_secret');

  IF endpoint IS NULL OR endpoint = '' THEN
    RAISE WARNING 'reservation_mailer_endpoint not configured. Skipping email send for reservation %', NEW.id;
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'id', NEW.id,
    'full_name', NEW.full_name,
    'email', NEW.email,
    'whatsapp', NEW.whatsapp,
    'tour_selected', NEW.tour_selected,
    'preferred_date', NEW.preferred_date,
    'number_of_people', NEW.number_of_people,
    'message', NEW.message,
    'created_at', NEW.created_at
  );

  PERFORM net.http_post(
    url := endpoint,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', COALESCE(webhook_secret, '')
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'notify_new_reservation failed for reservation %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reservations_send_notification ON public.reservations;

CREATE TRIGGER reservations_send_notification
AFTER INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_reservation();
