# Reservation Email Notifications

This function sends a transactional email each time a new row is inserted in `public.reservations`.

## Architecture

1. Landing page inserts reservation into Supabase (`public.reservations`).
2. DB trigger (`public.notify_new_reservation`) sends an HTTP POST via `pg_net`.
3. Edge Function `send-reservation-email` receives payload.
4. Edge Function sends email through **Brevo** (preferred if `BREVO_API_KEY` is set) or **Resend** (if only `RESEND_API_KEY` is set).
5. Notification arrives to `loslocales86@gmail.com` (or `RESERVATION_NOTIFICATION_TO`).

## 1) Create required secrets (Supabase)

**Webhook (always):**

```bash
supabase secrets set MAILER_WEBHOOK_SECRET="replace-with-long-random-string"
supabase secrets set RESERVATION_NOTIFICATION_TO="loslocales86@gmail.com"
```

**From address (use your verified domain, e.g. loslocalesnosara.com):**

```bash
supabase secrets set MAIL_FROM="Los Locales <reservas@loslocalesnosara.com>"
```

(`RESEND_FROM` still works as a fallback alias for the same value.)

### Option A — Brevo (good free tier, fast DNS flow for many teams)

1. Create account at [Brevo](https://www.brevo.com/).
2. **Senders & IP** → **Domains** → add `loslocalesnosara.com` and copy DNS records.
3. In Supabase:

```bash
supabase secrets set BREVO_API_KEY="xkeysib-..."
```

Remove or unset `RESEND_API_KEY` if you only want Brevo (optional).

**Namecheap DNS (typical):**

- SPF (single TXT on `@`): merge with only one SPF line, e.g.  
  `v=spf1 include:spf.brevo.com ~all`  
  (If you must keep another provider in the same SPF, use one TXT with multiple `include:` — ask before stacking.)
- DKIM: add the CNAME/TXT rows **exactly** as Brevo shows.
- DMARC (TXT on `_dmarc`):  
  `v=DMARC1; p=none; rua=mailto:loslocales86@gmail.com; adkim=s; aspf=s`

### Option B — Resend

```bash
supabase secrets set RESEND_API_KEY="re_xxx"
```

SPF uses `include:spf.resend.com` (see Resend domain page).

## 2) Deploy Edge Function

```bash
supabase functions deploy send-reservation-email --no-verify-jwt
```

`--no-verify-jwt` is required because PostgreSQL trigger calls this endpoint server-to-server and does not attach a Supabase JWT.

## 3) Configure DB endpoint + webhook secret

After deployment, store endpoint + secret used by the trigger:

```sql
insert into private.app_config (key, value)
values
  (
    'reservation_mailer_endpoint',
    'https://<PROJECT-REF>.supabase.co/functions/v1/send-reservation-email'
  ),
  (
    'reservation_mailer_secret',
    '<same-value-as-MAILER_WEBHOOK_SECRET>'
  )
on conflict (key)
do update set value = excluded.value, updated_at = now();
```

## 4) Gmail rule (Primary inbox)

Inside `loslocales86@gmail.com`:

1. Settings → Filters → Create filter
2. From: `reservas@loslocalesnosara.com`
3. Never send it to Spam; Categorize as Primary

## 5) Quick test

Insert a reservation from the website and verify:

- New row exists in `public.reservations`
- Function logs show status 200
- Email reaches Gmail Primary inbox
