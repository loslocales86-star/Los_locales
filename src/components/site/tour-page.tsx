import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Compass,
  MapPin,
  MessageCircle,
  Mountain,
  Package,
  Sparkles,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LosLocalesLogo } from "./logo"
import { SHOW_PRICES } from "@/lib/site-config"
import { TourReservation } from "./tour-reservation"
import { TOURS, type Tour } from "./tours"

/* ---------------------------------------------------------------------------
 * Stand-alone Tour page — cinematic, mirrors the Hero language so the
 * experience feels like one continuous brand. Opened in a new tab via
 * `#/tour/<slug>`.
 * -------------------------------------------------------------------------*/
/* Accent palette — strictly Costa Rica flag colours. The legacy "gold" /
 * "jungle" keys map onto warm (CR red) / cool (CR blue), with explicit
 * "red" / "blue" tours using the deeper variants so each card is still
 * distinguishable from the one next to it. */
const ACCENT_BG: Record<Tour["accent"], string> = {
  gold: "bg-[color:var(--cr-red)] text-[color:var(--cr-red-foreground)]",
  jungle: "bg-[color:var(--cr-blue)] text-[color:var(--cr-blue-foreground)]",
  red: "bg-[color:var(--cr-red-deep)] text-[color:var(--cr-red-foreground)]",
  blue: "bg-[color:var(--cr-blue-deep)] text-[color:var(--cr-blue-foreground)]",
}

const ACCENT_DOT: Record<Tour["accent"], string> = {
  gold: "bg-[color:var(--cr-red)]",
  jungle: "bg-[color:var(--cr-blue)]",
  red: "bg-[color:var(--cr-red-deep)]",
  blue: "bg-[color:var(--cr-blue-deep)]",
}

const ACCENT_CTA: Record<Tour["accent"], string> = {
  gold: "bg-[color:var(--cr-red)] text-[color:var(--cr-red-foreground)] shadow-[0_18px_40px_-14px_color-mix(in_oklch,var(--cr-red)_72%,transparent)] hover:bg-[color:var(--cr-red-deep)]",
  jungle: "bg-[color:var(--cr-blue)] text-[color:var(--cr-blue-foreground)] shadow-[0_18px_40px_-14px_color-mix(in_oklch,var(--cr-blue)_72%,transparent)] hover:bg-[color:var(--cr-blue-deep)]",
  red: "bg-[color:var(--cr-red-deep)] text-[color:var(--cr-red-foreground)] shadow-[0_18px_40px_-14px_color-mix(in_oklch,var(--cr-red-deep)_72%,transparent)] hover:bg-[color:var(--cr-red)]",
  blue: "bg-[color:var(--cr-blue-deep)] text-[color:var(--cr-blue-foreground)] shadow-[0_18px_40px_-14px_color-mix(in_oklch,var(--cr-blue-deep)_72%,transparent)] hover:bg-[color:var(--cr-blue)]",
}

const ACCENT_GHOST: Record<Tour["accent"], string> = {
  gold: "hover:border-[color:var(--cr-red)]/55 hover:bg-[color:var(--cr-red)]/8 hover:text-[color:var(--cr-red)]",
  jungle: "hover:border-[color:var(--cr-blue)]/55 hover:bg-[color:var(--cr-blue)]/8 hover:text-[color:var(--cr-blue)]",
  red: "hover:border-[color:var(--cr-red-deep)]/55 hover:bg-[color:var(--cr-red-deep)]/8 hover:text-[color:var(--cr-red-deep)]",
  blue: "hover:border-[color:var(--cr-blue-deep)]/55 hover:bg-[color:var(--cr-blue-deep)]/8 hover:text-[color:var(--cr-blue-deep)]",
}

const DIFFICULTY_BADGE: Record<NonNullable<Tour["difficulty"]>, string> = {
  Easy: "bg-[color:var(--cr-blue)]/15 text-[color:var(--cr-blue)]",
  Moderate: "bg-[color:var(--cr-red)]/15 text-[color:var(--cr-red)]",
  Challenging: "bg-[color:var(--cr-red-deep)]/18 text-[color:var(--cr-red-deep)]",
}

export function findTourBySlug(slug: string | null | undefined): Tour | null {
  if (!slug) return null
  return TOURS.find((t) => t.slug === slug) ?? null
}

type TourPageProps = {
  tour: Tour
}

export function TourPage({ tour }: TourPageProps) {
  const gallery =
    tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.image]
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    document.title = `${tour.title} · Los Locales · Nosara, Costa Rica`
  }, [tour.title])

  /* Pre-load gallery for instant switching. */
  useEffect(() => {
    gallery.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [gallery])

  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* ============================================================== *
       *  Cinematic hero — mirrors site Hero
       * ============================================================== */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {gallery.map((src, idx) => (
            <img
              key={src + idx}
              src={src}
              alt={idx === 0 ? tour.title : ""}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding={idx === 0 ? "sync" : "async"}
              className="absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-out"
              style={{
                opacity: idx === activeImg ? 1 : 0,
                imageRendering: "auto",
              }}
              draggable={false}
            />
          ))}

          {/* Discreet scrims — same recipe as the home Hero. CR-navy wash on
           * the left column for headline legibility, plus a soft bottom rail
           * for the thumbnail bar. The photograph stays largely untouched. */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[color:var(--cr-blue-deep)]/28 via-[color:var(--cr-blue-deep)]/4 to-transparent sm:via-[color:var(--cr-blue-deep)]/2" />
          <div className="absolute inset-x-0 bottom-0 z-[2] h-[24%] bg-gradient-to-t from-[color:var(--cr-blue-deep)]/24 via-[color:var(--cr-blue-deep)]/3 to-transparent" />
        </div>

        {/* Costa Rica flag accent */}
        <div className="cr-stripe pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] opacity-90" />

        {/* Mini header bar (logo + back) ---------------------------------*/}
        <div className="absolute inset-x-0 top-0 z-20 pt-5">
          <div className="mx-auto flex w-[min(1240px,94%)] items-center justify-between">
            <a
              href="#top"
              aria-label="Volver a Los Locales"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-[color:var(--cr-blue-deep)]/45 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-500 hover:border-white/60 hover:bg-[color:var(--cr-blue-deep)]/65"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-500 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Volver al inicio</span>
              <span className="sm:hidden">Volver</span>
            </a>
            <a
              href="#top"
              aria-label="Los Locales home"
              className="hidden sm:block"
            >
              <LosLocalesLogo className="h-9 w-auto text-white" />
            </a>
            <a
              href={`https://wa.me/50686068903?text=${encodeURIComponent(
                `Hi Los Locales! I'd like to know more about the ${tour.title}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-[color:var(--cr-blue-deep)]/45 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md transition-all duration-500 hover:border-white/60 hover:bg-[color:var(--cr-blue-deep)]/65"
            >
              <MessageCircle className="size-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Hero content -------------------------------------------------- */}
        <div className="relative z-10 mx-auto w-[min(1240px,94%)] pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="max-w-3xl fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[color:var(--cr-blue-deep)]/45 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
              <span className="relative flex size-2">
                <span
                  className={`absolute inline-flex size-full animate-ping rounded-full ${ACCENT_DOT[tour.accent]} opacity-70`}
                />
                <span
                  className={`relative inline-flex size-2 rounded-full ${ACCENT_DOT[tour.accent]}`}
                />
              </span>
              <span>{tour.category ?? "Tour"}</span>
              <span className="h-3 w-px bg-white/30" />
              <MapPin className="size-3" />
              <span>{tour.meetingPoint?.split("—")[0].trim() ?? "Nosara"}</span>
            </div>

            {/* Refined tour title — bold and cinematic, all-white with a
             * soft halo so it stays legible against the background photo. */}
            <h1 className="mt-6 text-balance font-display text-[2.25rem] font-black leading-[1] tracking-[-0.02em] text-white text-shadow-hero sm:text-[3rem] md:text-[3.75rem] lg:text-[4.5rem]">
              {tour.title}
            </h1>

            {/* CR-flag accent rule under the title (blue · white · red). */}
            <div className="mt-5 flex items-center gap-1.5">
              <span className="h-[3px] w-10 rounded-full bg-[color:var(--cr-blue)] shadow-[0_0_14px_color-mix(in_oklch,var(--cr-blue)_55%,transparent)] sm:w-14" />
              <span className="h-[3px] w-6 rounded-full bg-white/95 sm:w-8" />
              <span className="h-[3px] w-10 rounded-full bg-[color:var(--cr-red)] shadow-[0_0_14px_color-mix(in_oklch,var(--cr-red)_55%,transparent)] sm:w-14" />
            </div>

            <p className="mt-6 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-white text-shadow-body sm:text-xl">
              {tour.description}
            </p>

            {/* Quick facts row */}
            <ul className="mt-8 flex flex-wrap items-center gap-2.5">
              <Fact icon={<Clock className="size-3.5" />}>{tour.duration}</Fact>
              <Fact icon={<Users className="size-3.5" />}>{tour.group}</Fact>
              {tour.difficulty && (
                <Fact icon={<Mountain className="size-3.5" />}>
                  {tour.difficulty}
                </Fact>
              )}
              {SHOW_PRICES && (
                <Badge
                  className={`rounded-full border-0 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_18px_-6px_rgba(3,11,34,0.45)] ${ACCENT_BG[tour.accent]}`}
                >
                  {tour.price}
                </Badge>
              )}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <TourReservation
                tour={tour}
                trigger={
                  <Button
                    type="button"
                    size="lg"
                    className={`btn-shine group h-[52px] rounded-full px-7 text-[15px] font-semibold tracking-wide transition-all duration-500 ${ACCENT_CTA[tour.accent]}`}
                  >
                    Reservar {tour.title}
                    <ArrowRight className="ml-1.5 size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </Button>
                }
              />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-[52px] rounded-full border border-white/55 bg-white/10 px-6 text-[15px] font-semibold tracking-wide text-white backdrop-blur-md transition-all duration-500 hover:border-white hover:bg-white/18 hover:text-white"
              >
                <a
                  href={`https://wa.me/50686068903?text=${encodeURIComponent(
                    `Hi Los Locales! I'd like to know more about the ${tour.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1.5 size-4" />
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Gallery thumbnail rail (only when multiple images) ------------*/}
        {gallery.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 z-10">
            <div className="mx-auto flex w-[min(1240px,94%)] gap-2 overflow-x-auto pb-1">
              {gallery.map((src, idx) => {
                const isActive = idx === activeImg
                return (
                  <button
                    key={src + idx}
                    type="button"
                    onClick={() => setActiveImg(idx)}
                    aria-label={`Show photo ${idx + 1}`}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition ${
                      isActive
                        ? "border-white/80 opacity-100"
                        : "border-white/20 opacity-65 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== *
       *  Body
       * ============================================================== */}
      <section className="relative isolate overflow-hidden py-20 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-24 -z-10 size-[24rem] rounded-full bg-[color:var(--cr-blue)]/12 blur-3xl float-slower"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-24 -z-10 size-[22rem] rounded-full bg-[color:var(--cr-red)]/14 blur-3xl float-slow"
        />

        <div className="mx-auto grid w-[min(1240px,94%)] gap-12 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
          {/* Left column — narrative ----------------------------------- */}
          <div>
            {/* About */}
            <Block title="About this experience" eyebrow="Overview">
              <p className="text-pretty text-[16px] leading-relaxed text-foreground/85 sm:text-[17px]">
                {tour.longDescription ?? tour.description}
              </p>
            </Block>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Block
                title="What you'll experience"
                eyebrow="Highlights"
                icon={<Sparkles className="size-3.5" />}
              >
                <ul className="grid gap-3 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 text-[15px] leading-snug shadow-[0_2px_0_0_color-mix(in_oklch,var(--foreground)_3%,transparent)]"
                    >
                      <span
                        className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full ${ACCENT_BG[tour.accent]}`}
                      >
                        <Check className="size-3.5" />
                      </span>
                      <span className="text-foreground/90">{h}</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {/* Included + Bring */}
            {(tour.included?.length || tour.bring?.length) && (
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                {tour.included && tour.included.length > 0 && (
                  <Block
                    title="What's included"
                    eyebrow="Included"
                    icon={<Package className="size-3.5" />}
                    compact
                  >
                    <ChecklistList
                      items={tour.included}
                      tone="bg-[color:var(--cr-blue)]/12 text-[color:var(--cr-blue)]"
                    />
                  </Block>
                )}
                {tour.bring && tour.bring.length > 0 && (
                  <Block
                    title="What to bring"
                    eyebrow="Pack"
                    icon={<Compass className="size-3.5" />}
                    compact
                  >
                    <ChecklistList
                      items={tour.bring}
                      tone="bg-[color:var(--cr-red)]/12 text-[color:var(--cr-red)]"
                    />
                  </Block>
                )}
              </div>
            )}
          </div>

          {/* Right column — sticky info card --------------------------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_30px_80px_-40px_rgba(11,27,58,0.45)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  loading="lazy"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--cr-blue-deep)]/24 via-[color:var(--cr-blue-deep)]/2 to-transparent" />
                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                  <Badge
                    className={`rounded-full border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_18px_-6px_rgba(3,11,34,0.45)] ${ACCENT_BG[tour.accent]}`}
                  >
                    {tour.category ?? "Tour"}
                  </Badge>
                  {SHOW_PRICES && (
                    <Badge className="rounded-full border-0 bg-white/95 px-2.5 py-1 text-[11px] font-bold tracking-tight text-[color:var(--cr-blue-deep)] shadow-[0_8px_18px_-6px_rgba(3,11,34,0.4)]">
                      {tour.price}
                    </Badge>
                  )}
                </div>
                <div className="absolute inset-x-4 bottom-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[color:var(--cr-blue-deep)]/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    <MapPin className="size-3" />
                    {tour.meetingPoint ?? "Nosara, Costa Rica"}
                  </div>
                </div>
              </div>
              <div className="space-y-5 p-6 sm:p-7">
                <div className="grid grid-cols-2 gap-3">
                  <SideFact
                    icon={<Clock className="size-4" />}
                    label="Duration"
                    value={tour.duration}
                  />
                  <SideFact
                    icon={<Users className="size-4" />}
                    label="Group"
                    value={tour.group}
                  />
                  <SideFact
                    icon={<Mountain className="size-4" />}
                    label="Level"
                    value={
                      tour.difficulty ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${DIFFICULTY_BADGE[tour.difficulty]}`}
                        >
                          {tour.difficulty}
                        </span>
                      ) : (
                        "All levels"
                      )
                    }
                  />
                  <SideFact
                    icon={<Compass className="size-4" />}
                    label="Meet"
                    value={tour.meetingPoint?.split("—")[0].trim() ?? "Nosara"}
                  />
                </div>

                <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {SHOW_PRICES ? "Starting from" : "Pricing"}
                  </p>
                  <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">
                    {SHOW_PRICES ? tour.price : "Inquire for pricing"}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    Final price depends on group size and add-ons. We confirm
                    every detail on WhatsApp before charging anything.
                  </p>
                </div>

                <div className="space-y-2">
                  <TourReservation
                    tour={tour}
                    trigger={
                      <Button
                        type="button"
                        size="lg"
                        className={`btn-shine group h-12 w-full rounded-full text-sm font-semibold tracking-wide transition-all duration-500 ${ACCENT_CTA[tour.accent]}`}
                      >
                        Reservar {tour.title}
                        <ArrowRight className="ml-1.5 size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                      </Button>
                    }
                  />
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className={`h-11 w-full rounded-full border-border/70 bg-transparent text-sm font-semibold transition-all duration-500 ${ACCENT_GHOST[tour.accent]}`}
                  >
                    <a
                      href={`https://wa.me/50686068903?text=${encodeURIComponent(
                        `Hi Los Locales! I'd like to know more about the ${tour.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-1.5 size-4" />
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ============================================================== *
       *  Other tours strip
       * ============================================================== */}
      <OtherTours currentSlug={tour.slug} />

      {/* ============================================================== *
       *  Sticky footer CTA — mobile-friendly
       * ============================================================== */}
      <div className="sticky bottom-0 z-30 border-t border-border/70 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <div className="mx-auto flex w-[min(1240px,94%)] items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {SHOW_PRICES ? "Starting from" : "Pricing"}
            </p>
            <p className="truncate font-display text-base font-extrabold tracking-tight">
              {SHOW_PRICES ? tour.price : "Inquire"}
            </p>
          </div>
          <TourReservation
            tour={tour}
            trigger={
              <Button
                type="button"
                className={`btn-shine h-11 rounded-full px-5 text-sm font-semibold tracking-wide transition-all duration-500 ${ACCENT_CTA[tour.accent]}`}
              >
                Reservar
                <ArrowRight className="ml-1.5 size-4" />
              </Button>
            }
          />
        </div>
      </div>

      {/* Footer accent */}
      <footer className="border-t border-border/60 bg-background/95 py-8">
        <div className="mx-auto flex w-[min(1240px,94%)] flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-[color:var(--cr-blue)]" />
            <span className="size-1.5 rounded-full bg-white ring-1 ring-border" />
            <span className="size-1.5 rounded-full bg-[color:var(--cr-red)]" />
            <span>Pura Vida · Made in CR</span>
          </div>
          <a
            href="#tours"
            className="text-[12px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
          >
            ← Volver a todos los tours
          </a>
        </div>
      </footer>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Small building blocks
 * -------------------------------------------------------------------------*/
function Fact({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[color:var(--cr-blue-deep)]/45 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
      <span className="text-white/75">{icon}</span>
      {children}
    </li>
  )
}

function Block({
  title,
  eyebrow,
  icon,
  compact,
  children,
}: {
  title: string
  eyebrow: string
  icon?: React.ReactNode
  compact?: boolean
  children: React.ReactNode
}) {
  return (
    <section className={compact ? "" : "mt-12 first:mt-0"}>
      <div className="eyebrow w-fit">
        {icon ?? <span className="size-1.5 rounded-full bg-[color:var(--cr-red)]" />}
        {eyebrow}
      </div>
      <h2 className="mt-3 font-display text-[1.6rem] font-black tracking-[-0.012em] sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function ChecklistList({ items, tone }: { items: string[]; tone: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li
          key={it}
          className="flex items-start gap-2.5 text-[14.5px] leading-snug text-foreground/90"
        >
          <span
            className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full ${tone}`}
          >
            <Check className="size-3" />
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function SideFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-secondary/30 p-3">
      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * "Other tours" suggestion strip
 * -------------------------------------------------------------------------*/
function OtherTours({ currentSlug }: { currentSlug: string }) {
  const others = TOURS.filter((t) => t.slug !== currentSlug).slice(0, 3)
  if (others.length === 0) return null
  return (
    <section className="border-t border-border/60 bg-secondary/20 py-16 sm:py-20">
      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow w-fit">
              <span className="size-1.5 rounded-full bg-[color:var(--cr-red)]" />
              Keep exploring
            </div>
            <h2 className="mt-3 font-display text-[1.6rem] font-black tracking-[-0.012em] sm:text-3xl">
              More Pura Vida adventures
            </h2>
          </div>
          <a
            href="#tours"
            className="hidden items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            Ver todos los tours <ArrowRight className="size-3.5" />
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((t) => (
            <a
              key={t.slug}
              href={`#/tour/${t.slug}`}
              className="hover-lift group relative flex overflow-hidden rounded-2xl border border-border/70 bg-card"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={t.image}
                  alt={t.title}
                  loading="lazy"
                  className="size-full object-cover"
                  style={{ imageRendering: "auto" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--cr-blue-deep)]/24 via-[color:var(--cr-blue-deep)]/2 to-transparent" />
                <div className="absolute inset-x-4 top-4">
                  <Badge
                    className={`rounded-full border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_18px_-6px_rgba(3,11,34,0.45)] ${ACCENT_BG[t.accent]}`}
                  >
                    {t.category ?? "Tour"}
                  </Badge>
                </div>
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white">
                  <h3 className="font-display text-lg font-black tracking-[-0.012em] text-shadow-body">
                    {t.title}
                  </h3>
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
