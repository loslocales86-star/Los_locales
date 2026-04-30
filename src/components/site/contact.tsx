import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  type LucideProps,
} from "lucide-react"
import { FacebookIcon as Facebook, InstagramIcon as Instagram } from "./brand-icons"
import { Button } from "@/components/ui/button"

type Channel = {
  icon: React.ComponentType<LucideProps>
  label: string
  handle: string
  cta: string
  href: string
  /** CSS variable name (without var()) used as the channel's signature color */
  brand: "jungle" | "cr-red" | "cr-blue" | "gold"
}

const CHANNELS: Channel[] = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    handle: "+506 8606 8903",
    cta: "Chat with a local",
    href: "https://wa.me/50686068903",
    brand: "jungle",
  },
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@loslocales86",
    cta: "Follow our adventures",
    href: "https://instagram.com/loslocales86",
    brand: "cr-red",
  },
  {
    icon: Facebook,
    label: "Facebook",
    handle: "Los Locales Kayak",
    cta: "Connect with us",
    href: "https://www.facebook.com/profile.php?id=61560176768852",
    brand: "cr-blue",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "loslocales86@gmail.com",
    cta: "Send us a message",
    href: "mailto:loslocales86@gmail.com",
    brand: "gold",
  },
]

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-36"
    >
      {/* Layered tropical wash --------------------------------------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[color:var(--cr-blue)]/8 via-background to-[color:var(--sand)]/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-24 -z-10 size-[30rem] rounded-full bg-[color:var(--cr-blue)]/15 blur-3xl float-slower"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 -z-10 size-[26rem] rounded-full bg-[color:var(--gold)]/20 blur-3xl float-slow"
      />
      {/* Subtle CR flag accent bar at the top of the section */}
      <div
        aria-hidden
        className="cr-stripe pointer-events-none absolute inset-x-0 top-0 -z-10 h-[2px] opacity-50"
      />

      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="reveal mx-auto max-w-2xl text-center">
          <div className="eyebrow mx-auto">
            <span className="size-1.5 rounded-full bg-[color:var(--cr-blue)]" />
            Get in touch
          </div>
          <h2 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Say <span className="text-cr-gradient">Pura Vida</span> — we'll
            answer fast
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Questions, custom itineraries or last-minute plans? The locals are
            one tap away.
          </p>
        </div>

        <div className="mt-16 grid gap-7 lg:grid-cols-[1.15fr_1fr]">
          {/* Map card -------------------------------------------------- */}
          <div className="reveal hover-lift overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-[0_24px_60px_-30px_color-mix(in_oklch,var(--cr-blue)_25%,transparent)] backdrop-blur">
            <div className="relative aspect-[16/10] w-full">
              <iframe
                title="Los Locales Nosara location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-85.6715%2C9.9455%2C-85.6355%2C9.9775&layer=mapnik&marker=9.9615%2C-85.6535"
                className="size-full border-0 grayscale-[0.15] saturate-[0.9] transition-all duration-700 hover:grayscale-0 hover:saturate-100"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Gradient overlays */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/15 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold)]/40 to-transparent" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7">
              <div className="flex items-start gap-3.5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <MapPin className="size-5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base font-bold tracking-tight">
                    Main office
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    Playa Guiones, Nosara, Guanacaste — Costa Rica
                  </div>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full border-border/80 px-5 text-sm font-semibold transition hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/10"
              >
                <a
                  href="https://maps.google.com/?q=Playa+Guiones+Nosara+Costa+Rica"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Maps
                </a>
              </Button>
            </div>
          </div>

          {/* Channel cards (CR-branded, themed per channel) ----------- */}
          <div className="reveal reveal-delay-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {CHANNELS.map((c, idx) => (
              <ChannelCard key={c.label} channel={c} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * ChannelCard — premium, CR-themed contact card.
 * Each card is fully tinted in its channel's signature color (no flat white).
 * Visuals: branded gradient surface, top color rail, glowing icon block,
 * pulsing dot, animated arrow, and a CR flag stripe that emerges on hover.
 * -------------------------------------------------------------------------*/
function ChannelCard({ channel, index }: { channel: Channel; index: number }) {
  const { icon: Icon, label, handle, cta, href, brand } = channel
  const brandVar = `var(--${brand})`
  const brandFgVar = `var(--${brand}-foreground)`
  const isExternal = !href.startsWith("mailto:")

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      aria-label={`${label}: ${handle}`}
      className="hover-lift group relative isolate flex min-w-0 flex-col gap-5 overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all duration-500 sm:p-6"
      style={
        {
          ["--brand" as string]: brandVar,
          ["--brand-fg" as string]: brandFgVar,
          background: `linear-gradient(135deg,
            color-mix(in oklch, var(--brand) 6%, var(--card)) 0%,
            color-mix(in oklch, var(--brand) 14%, var(--card)) 55%,
            color-mix(in oklch, var(--brand) 8%, var(--card)) 100%)`,
          borderColor: `color-mix(in oklch, var(--brand) 28%, var(--border))`,
          boxShadow: `0 1px 0 0 color-mix(in oklch, var(--foreground) 4%, transparent),
                      0 18px 36px -22px color-mix(in oklch, var(--brand) 45%, transparent)`,
          transitionDelay: `${index * 60}ms`,
        } as React.CSSProperties
      }
    >
      {/* Hover wash — color blooms on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg,
            color-mix(in oklch, var(--brand) 16%, transparent) 0%,
            color-mix(in oklch, var(--brand) 6%, transparent) 60%,
            color-mix(in oklch, var(--brand) 22%, transparent) 100%)`,
        }}
      />

      {/* Top color rail (full bleed) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{
          background: `linear-gradient(90deg,
            color-mix(in oklch, var(--brand) 70%, transparent) 0%,
            var(--brand) 50%,
            color-mix(in oklch, var(--brand) 70%, transparent) 100%)`,
        }}
      />

      {/* CR flag micro-stripe — appears on hover under the top rail */}
      <span
        aria-hidden
        className="cr-stripe pointer-events-none absolute inset-x-0 top-1 h-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-90"
      />

      {/* Soft brand glow blob — top-right corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-12 -z-10 size-48 rounded-full opacity-40 blur-3xl transition-all duration-700 group-hover:opacity-70 group-hover:scale-110"
        style={{
          background: `radial-gradient(circle at center, var(--brand) 0%, transparent 70%)`,
        }}
      />

      {/* Subtle dotted texture overlay — adds depth without noise */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "12px 12px",
          color: "var(--foreground)",
        }}
      />

      {/* Header row: icon block + arrow */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-[1.06] group-hover:-rotate-3"
          style={{
            background: `linear-gradient(135deg,
              var(--brand) 0%,
              color-mix(in oklch, var(--brand) 80%, var(--foreground)) 100%)`,
            color: brandFgVar,
            boxShadow: `0 12px 28px -10px color-mix(in oklch, var(--brand) 65%, transparent),
                        inset 0 1px 0 0 color-mix(in oklch, white 25%, transparent)`,
          }}
        >
          <Icon className="size-6" strokeWidth={2.3} />
          {/* Pulsing live dot */}
          <span
            aria-hidden
            className="absolute -right-1 -top-1 flex size-3"
          >
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-70"
              style={{ background: brandVar }}
            />
            <span
              className="relative inline-flex size-3 rounded-full ring-2 ring-card"
              style={{ background: brandVar }}
            />
          </span>
        </div>

        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background/70 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{
            borderColor: `color-mix(in oklch, var(--brand) 28%, var(--border))`,
          }}
        >
          <ArrowUpRight
            className="size-4 transition-colors duration-300 group-hover:text-[color:var(--brand)]"
            strokeWidth={2.4}
          />
        </span>
      </div>

      {/* Handle + meta */}
      <div className="min-w-0">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.22em]"
          style={{
            color: `color-mix(in oklch, var(--brand) 80%, var(--muted-foreground))`,
          }}
        >
          {label}
        </div>
        <div className="mt-1.5 truncate font-display text-lg font-bold tracking-tight sm:text-xl">
          {handle}
        </div>
        <div className="mt-1 truncate text-sm text-muted-foreground">
          {cta}
        </div>
      </div>

      {/* Bottom hairline that lights up in the channel's color on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-5 bottom-0 h-px scale-x-50 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100 sm:inset-x-6"
        style={{
          background: `linear-gradient(90deg, transparent, color-mix(in oklch, var(--brand) 80%, transparent), transparent)`,
        }}
      />
    </a>
  )
}
