type ReservationPayload = {
  id: string
  full_name: string
  email: string
  whatsapp: string
  tour_selected: string
  preferred_date: string | null
  number_of_people: number
  message: string
  created_at: string
}

const json = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")

/** Parse "Name <email@domain.com>" or plain email */
function parseMailFrom(from: string): { name: string; email: string } {
  const trimmed = from.trim()
  const m = trimmed.match(/^(.+?)\s*<([^>]+)>$/)
  if (m) return { name: m[1].trim(), email: m[2].trim() }
  return { name: "Los Locales", email: trimmed }
}

const renderEmailHtml = (r: ReservationPayload) => {
  const preferredDate = r.preferred_date ?? "No date selected"
  const customerMessage = r.message.trim() || "No additional notes."

  return `
  <div style="font-family: Inter, Arial, sans-serif; background: #f8fafc; padding: 20px;">
    <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5e7eb;">
      <div style="padding: 14px 20px; background: linear-gradient(90deg, #123a7a 0%, #d63638 52%, #123a7a 100%); color: #fff; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; font-weight: 700;">
        New Reservation · Los Locales
      </div>
      <div style="padding: 22px 20px;">
        <h2 style="margin: 0 0 14px; font-size: 22px; line-height: 1.2; color: #0f172a;">
          ${escapeHtml(r.full_name)} requested ${escapeHtml(r.tour_selected)}
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #475569; width: 180px;">Customer email</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(r.email)}</td></tr>
          <tr><td style="padding: 8px 0; color: #475569;">WhatsApp</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(r.whatsapp)}</td></tr>
          <tr><td style="padding: 8px 0; color: #475569;">Tour</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(r.tour_selected)}</td></tr>
          <tr><td style="padding: 8px 0; color: #475569;">Preferred date</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(preferredDate)}</td></tr>
          <tr><td style="padding: 8px 0; color: #475569;">People</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${r.number_of_people}</td></tr>
          <tr><td style="padding: 8px 0; color: #475569;">Reservation ID</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${escapeHtml(r.id)}</td></tr>
        </table>
        <div style="margin-top: 18px; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px;">Message</div>
          <div style="font-size: 14px; color: #0f172a; white-space: pre-wrap;">${escapeHtml(customerMessage)}</div>
        </div>
      </div>
    </div>
  </div>
  `
}

const renderEmailText = (r: ReservationPayload) => {
  const preferredDate = r.preferred_date ?? "No date selected"
  const customerMessage = r.message.trim() || "No additional notes."
  return [
    "New reservation - Los Locales",
    "",
    `Customer: ${r.full_name}`,
    `Email: ${r.email}`,
    `WhatsApp: ${r.whatsapp}`,
    `Tour: ${r.tour_selected}`,
    `Preferred date: ${preferredDate}`,
    `People: ${r.number_of_people}`,
    `Reservation ID: ${r.id}`,
    "",
    "Message:",
    customerMessage,
  ].join("\n")
}

async function sendViaResend(
  apiKey: string,
  from: string,
  to: string,
  payload: ReservationPayload,
  subject: string,
  html: string,
  text: string
): Promise<Response> {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject,
      html,
      text,
    }),
  })
}

async function sendViaBrevo(
  apiKey: string,
  from: string,
  to: string,
  payload: ReservationPayload,
  subject: string,
  html: string,
  text: string
): Promise<Response> {
  const sender = parseMailFrom(from)
  return fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: sender.name, email: sender.email },
      to: [{ email: to }],
      replyTo: { email: payload.email },
      subject,
      htmlContent: html,
      textContent: text,
    }),
  })
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 })
  }

  const webhookSecret = Deno.env.get("MAILER_WEBHOOK_SECRET")
  if (!webhookSecret) {
    return json(
      { error: "MAILER_WEBHOOK_SECRET is not configured" },
      { status: 500 }
    )
  }

  const providedSecret = req.headers.get("x-webhook-secret") ?? ""
  if (providedSecret !== webhookSecret) {
    return json({ error: "Unauthorized webhook request" }, { status: 401 })
  }

  const brevoKey = Deno.env.get("BREVO_API_KEY")
  const resendKey = Deno.env.get("RESEND_API_KEY")

  if (!brevoKey && !resendKey) {
    return json(
      {
        error:
          "No mail provider configured: set BREVO_API_KEY or RESEND_API_KEY",
      },
      { status: 500 }
    )
  }

  const from =
    Deno.env.get("MAIL_FROM") ??
    Deno.env.get("RESEND_FROM") ??
    "Los Locales <reservas@loslocalesnosara.com>"
  const to =
    Deno.env.get("RESERVATION_NOTIFICATION_TO") ?? "loslocales86@gmail.com"

  let payload: ReservationPayload
  try {
    payload = (await req.json()) as ReservationPayload
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!payload?.email || !payload?.full_name || !payload?.tour_selected) {
    return json({ error: "Missing required reservation fields" }, { status: 400 })
  }

  const subject = `Nueva reservacion - ${payload.tour_selected} - ${payload.full_name}`
  const html = renderEmailHtml(payload)
  const text = renderEmailText(payload)

  const useBrevo = Boolean(brevoKey)
  const mailResponse = useBrevo
    ? await sendViaBrevo(brevoKey!, from, to, payload, subject, html, text)
    : await sendViaResend(resendKey!, from, to, payload, subject, html, text)

  if (!mailResponse.ok) {
    const errorText = await mailResponse.text()
    return json(
      {
        error: useBrevo ? "Brevo request failed" : "Resend request failed",
        status: mailResponse.status,
        details: errorText,
      },
      { status: 502 }
    )
  }

  return json({ ok: true })
})
