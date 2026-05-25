import { useEffect, useState } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Eye,
  MapPin,
  Mountain,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SHOW_PRICES } from "@/lib/site-config"
import { TourReservation } from "./tour-reservation"

/* ---------------------------------------------------------------------------
 * Tour data model
 * -------------------------------------------------------------------------*/
export type Tour = {
  slug: string
  title: string
  description: string
  longDescription?: string
  image: string
  gallery?: string[]
  duration: string
  group: string
  price: string
  category?: string
  difficulty?: "Easy" | "Moderate" | "Challenging"
  meetingPoint?: string
  highlights?: string[]
  included?: string[]
  bring?: string[]
  accent: "gold" | "jungle" | "red" | "blue"
}

/* ---------------------------------------------------------------------------
 * TOURS — every image referenced below exists under /public so the build
 * never breaks and the new HD photographs take centre stage.
 * -------------------------------------------------------------------------*/
export const TOURS: Tour[] = [
  {
    slug: "atv-tours",
    title: "ATV Adventures",
    description:
      "Rip through jungle trails, river crossings and secret lookout points.",
    longDescription:
      "Strap in for a half-day ride through Nosara's hidden ridges, river crossings and dense rainforest single-tracks only locals know. We'll stop at a jungle waterfall, a panoramic mirador over Playa Guiones and a typical roadside soda for a fresh coconut. Beginners welcome — every guest gets a 15-minute briefing and a tail guide watching their back.",
    image: "/cuadras.jpeg",
    gallery: ["/cuadras.jpeg", "/gpeladas_playa.png", "/island_cuadra.jpg"],
    duration: "3 hrs",
    group: "1-6 people",
    price: "from $120",
    category: "Adrenaline",
    difficulty: "Moderate",
    meetingPoint: "Los Locales HQ — Nosara",
    highlights: [
      "Hidden jungle single-tracks",
      "River-crossing photo stop",
      "Panoramic mirador over Playa Guiones",
      "Fresh coconut at a local soda",
    ],
    included: [
      "Bilingual local guide + tail guide",
      "ATV, helmet & goggles",
      "Fuel & insurance",
      "Cold water + fresh coconut",
    ],
    bring: ["Closed shoes", "Sunglasses", "Buff or bandana", "Camera / GoPro"],
    accent: "red",
  },
  {
    slug: "kayak-tours",
    title: "Kayak Tours",
    description:
      "Glide through the Nosara mangrove estuary and spot tropical wildlife.",
    longDescription:
      "Paddle in glassy water through the Río Nosara mangroves at the calmest hour of the day. We move slow, listening for howler monkeys, watching herons stalk crabs and counting the iguanas sunning on the branches. Tour ends with a relaxed drift to the river mouth where the estuary meets Playa Guiones.",
    image: "/gemini_kayakk.png",
    gallery: ["/gemini_kayakk.png", "/gemini_kayakk2.png", "/gemini_kayakk3.png"],
    duration: "2.5 hrs",
    group: "1-8 people",
    price: "from $55",
    category: "Nature",
    difficulty: "Easy",
    meetingPoint: "Río Nosara launch point",
    highlights: [
      "Calm mangrove waters, no currents",
      "Howler monkeys, herons & iguanas",
      "Drift to the river mouth",
      "Great for first-time kayakers",
    ],
    included: [
      "Bilingual naturalist guide",
      "Kayak, paddle, life vest",
      "Dry bag for valuables",
      "Bottled water + fresh fruit",
    ],
    bring: ["Quick-dry clothes", "Reef-safe sunscreen", "Hat", "Water sandals"],
    accent: "jungle",
  },
  // {
  //   slug: "nature-adventures",
  //   title: "Nature Adventures",
  //   description:
  //     "Monkeys, toucans and waterfalls — guided rainforest hikes off the map.",
  //   longDescription:
  //     "A guided hike with a local naturalist into the Nosara Biological Reserve and beyond. Expect three different ecosystems in one morning, a hidden waterfall swim and the kind of birdlist you can't get on your own — toucans, motmots, trogons, scarlet macaws on a lucky day.",
  //   image: "/hi3.png",
  //   gallery: ["/hi3.png", "/adventure.jpg", "/chi4.png", "/chi2.png"],
  //   duration: "4 hrs",
  //   group: "1-8 people",
  //   price: "from $75",
  //   category: "Wildlife",
  //   difficulty: "Moderate",
  //   meetingPoint: "Nosara Biological Reserve",
  //   highlights: [
  //     "Three rainforest ecosystems",
  //     "Hidden waterfall swim",
  //     "Howler & white-faced monkeys",
  //     "Birdlife: toucans, motmots, trogons",
  //   ],
  //   included: [
  //     "Local naturalist guide",
  //     "Binoculars & spotting scope",
  //     "Park entrance fees",
  //     "Fresh fruit + water",
  //   ],
  //   bring: [
  //     "Hiking shoes",
  //     "Long pants for the trail",
  //     "Bug repellent",
  //     "Swimsuit + towel",
  //   ],
  //   accent: "jungle",
  // },
  // {
  //   slug: "beach-tours",
  //   title: "Beach Tours",
  //   description:
  //     "A full-day tasting of Nosara's best beaches — from Guiones to Ostional.",
  //   longDescription:
  //     "From the long open sands of Playa Guiones, to the secret coves of Playa Pelada, to the wildlife refuge of Playa Ostional, we drive you to the right beach at the right hour. Includes a local lunch, the best vantage points for photos and tide-pool exploration when the ocean allows.",
  //   image: "/peladas_playa.png",
  //   gallery: [
  //     "/peladas_playa.png",
  //     "/peladas.jpg",
  //     "/guiones.jpg",
  //     "/ostional.jpg",
  //     "/nosara-beach.jpg",
  //     "/chi1.png",
  //   ],
  //   duration: "5 hrs",
  //   group: "2-10 people",
  //   price: "from $95",
  //   category: "Coastline",
  //   difficulty: "Easy",
  //   meetingPoint: "Playa Guiones north access",
  //   highlights: [
  //     "Playa Guiones, Pelada & Ostional",
  //     "Sea turtle refuge (seasonal)",
  //     "Tide-pool exploration",
  //     "Local lunch at a beachfront soda",
  //   ],
  //   included: [
  //     "Private 4x4 transport",
  //     "Bilingual local guide",
  //     "Lunch + drinks",
  //     "Beach towels",
  //   ],
  //   bring: ["Swimsuit", "Sunscreen", "Hat & sunglasses", "Camera"],
  //   accent: "gold",
  // },
  // {
  //   slug: "sunset-tours",
  //   title: "Sunset Tours",
  //   description:
  //     "Golden hour from our favourite hidden cliff — drinks and tapas included.",
  //   longDescription:
  //     "We take you to the cliff above Playa Pelada when the light turns gold and the Pacific lights up in pinks and oranges. Cocktails, tropical tapas and a guitar if you want one. The most photographed sunset of Nosara — without the crowd.",
  //   image: "/chi1.png",
  //   gallery: ["/chi1.png", "/peladas.jpg", "/chi2.png", "/nosara-beach-gemini.png"],
  //   duration: "2 hrs",
  //   group: "2-6 people",
  //   price: "from $65",
  //   category: "Sunset & food",
  //   difficulty: "Easy",
  //   meetingPoint: "Playa Pelada cliff (we drive you)",
  //   highlights: [
  //     "Sunset over the Pacific cliff",
  //     "Cocktails & tropical tapas",
  //     "Photo-friendly viewpoints",
  //     "Quiet, away from the crowds",
  //   ],
  //   included: [
  //     "Round-trip transport",
  //     "2 cocktails or mocktails",
  //     "Tapas board",
  //     "Local guide / host",
  //   ],
  //   bring: ["Light jacket", "Camera", "Good vibes"],
  //   accent: "gold",
  // },
  {
    slug: "surf-lessons",
    title: "Surf Lessons",
    description:
      "Learn on the legendary Playa Guiones break with certified local instructors.",
    longDescription:
      "Playa Guiones is one of the world's most consistent beginner-friendly breaks — a long, sandy point that breaks gently every day of the year. Our ISA-certified local instructors teach safety, paddling and pop-ups in shallow water before pushing you into your first real waves. Most guests stand up on day one.",
    image: "/surfs.jpg",
    gallery: ["/surfs.jpg", "/guiones.jpg", "/peladas_playa.png", "/nosara-beach.jpg"],
    duration: "2 hrs",
    group: "1-4 people",
    price: "from $60",
    category: "Surf & ocean",
    difficulty: "Easy",
    meetingPoint: "Playa Guiones — beach access #2",
    highlights: [
      "ISA-certified local instructors",
      "Soft-top boards in beginner-friendly waves",
      "1:2 instructor-to-student ratio",
      "Action photos by your guide",
    ],
    included: [
      "Surfboard & rash guard",
      "Reef-safe sunscreen",
      "Bottled water",
      "Photos of your session",
    ],
    bring: ["Swimsuit", "Towel", "Goggles (optional)", "Stoke"],
    accent: "blue",
  },
]

/* ---------------------------------------------------------------------------
 * Accent maps — every tone here is drawn from the Costa Rica flag (BLUE ·
 * WHITE · RED) with a "deep" variant on each side for tonal differentiation.
 * The legacy "gold" / "jungle" keys map onto warm (red) / cool (blue) so all
 * existing tour data continues to work.
 * -------------------------------------------------------------------------*/
const ACCENT_BG: Record<Tour["accent"], string> = {
  gold: "bg-[color:var(--cr-red)] text-[color:var(--cr-red-foreground)]",
  jungle: "bg-[color:var(--cr-blue)] text-[color:var(--cr-blue-foreground)]",
  red: "bg-[color:var(--cr-red-deep)] text-[color:var(--cr-red-foreground)]",
  blue: "bg-[color:var(--cr-blue-deep)] text-[color:var(--cr-blue-foreground)]",
}

const ACCENT_HAIRLINE: Record<Tour["accent"], string> = {
  gold: "group-hover:via-[color:var(--cr-red)]/80",
  jungle: "group-hover:via-[color:var(--cr-blue)]/80",
  red: "group-hover:via-[color:var(--cr-red-deep)]/85",
  blue: "group-hover:via-[color:var(--cr-blue-deep)]/85",
}

const ACCENT_TITLE_HOVER: Record<Tour["accent"], string> = {
  gold: "group-hover:text-[color:var(--cr-red)]",
  jungle: "group-hover:text-[color:var(--cr-blue)]",
  red: "group-hover:text-[color:var(--cr-red-deep)]",
  blue: "group-hover:text-[color:var(--cr-blue-deep)]",
}

const ACCENT_GHOST: Record<Tour["accent"], string> = {
  gold: "hover:border-[color:var(--cr-red)]/55 hover:bg-[color:var(--cr-red)]/8 hover:text-[color:var(--cr-red)]",
  jungle: "hover:border-[color:var(--cr-blue)]/55 hover:bg-[color:var(--cr-blue)]/8 hover:text-[color:var(--cr-blue)]",
  red: "hover:border-[color:var(--cr-red-deep)]/55 hover:bg-[color:var(--cr-red-deep)]/8 hover:text-[color:var(--cr-red-deep)]",
  blue: "hover:border-[color:var(--cr-blue-deep)]/55 hover:bg-[color:var(--cr-blue-deep)]/8 hover:text-[color:var(--cr-blue-deep)]",
}

const ACCENT_CTA: Record<Tour["accent"], string> = {
  gold: "bg-[color:var(--cr-red)] text-[color:var(--cr-red-foreground)] shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--cr-red)_70%,transparent)] hover:bg-[color:var(--cr-red-deep)]",
  jungle: "bg-[color:var(--cr-blue)] text-[color:var(--cr-blue-foreground)] shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--cr-blue)_70%,transparent)] hover:bg-[color:var(--cr-blue-deep)]",
  red: "bg-[color:var(--cr-red-deep)] text-[color:var(--cr-red-foreground)] shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--cr-red-deep)_70%,transparent)] hover:bg-[color:var(--cr-red)]",
  blue: "bg-[color:var(--cr-blue-deep)] text-[color:var(--cr-blue-foreground)] shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--cr-blue-deep)_70%,transparent)] hover:bg-[color:var(--cr-blue)]",
}

/* Difficulty maps onto blue (Easy) → red (Moderate) → red-deep (Challenging),
 * keeping the difficulty rail strictly inside the CR palette. */
const DIFFICULTY_DOT: Record<NonNullable<Tour["difficulty"]>, string> = {
  Easy: "bg-[color:var(--cr-blue)]",
  Moderate: "bg-[color:var(--cr-red)]",
  Challenging: "bg-[color:var(--cr-red-deep)]",
}

/* ---------------------------------------------------------------------------
 * Section background carousel — crossfading photographs behind the heading
 * -------------------------------------------------------------------------*/
const BG_SLIDES = [
  "/peladas_playa.png",
  "/cuadras.jpeg",
  "/chi1.png",
]
const BG_DURATION_MS = 7000

function useAutoIndex(length: number, durationMs: number) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (length <= 1) return
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % length)
    }, durationMs)
    return () => window.clearInterval(t)
  }, [length, durationMs])
  return idx
}

/* ---------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------*/
export function tourHref(slug: string) {
  return `#/tour/${slug}`
}

/* ---------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------*/
export function Tours() {
  const bgIdx = useAutoIndex(BG_SLIDES.length, BG_DURATION_MS)

  return (
    <section
      id="tours"
      className="relative isolate overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background py-24 sm:py-32 lg:py-36"
    >
      {/* Layered tropical wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-32 -z-10 size-[28rem] rounded-full bg-[color:var(--cr-blue)]/12 blur-3xl float-slower"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-32 -z-10 size-[26rem] rounded-full bg-[color:var(--cr-red)]/14 blur-3xl float-slow"
      />

      <div className="mx-auto w-[min(1240px,94%)]">
        {/* ============================================================== *
         *  Section header — full-bleed cinematic banner (mirrors Hero)
         * ============================================================== */}
        <div className="reveal relative overflow-hidden rounded-[28px] border border-border/60 shadow-[0_30px_80px_-40px_rgba(11,27,58,0.45)]">
          {/* Carousel layer */}
          <div className="absolute inset-0">
            {BG_SLIDES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden
                loading={i === 0 ? "eager" : "lazy"}
                decoding={i === 0 ? "sync" : "async"}
                className="absolute inset-0 size-full object-cover transition-opacity duration-[1500ms] ease-out"
                style={{ opacity: i === bgIdx ? 1 : 0 }}
              />
            ))}
            {/* Left-column CR-navy scrim — keeps the heading legible against
             * full-HD imagery without dimming the rest of the photograph. */}
            <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--cr-blue-deep)]/26 via-[color:var(--cr-blue-deep)]/5 to-transparent sm:via-[color:var(--cr-blue-deep)]/2" />
            <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-[color:var(--cr-blue-deep)]/20 to-transparent" />
            <div className="cr-stripe absolute inset-x-0 top-0 h-[2px] opacity-90" />
          </div>

          {/* Content */}
          <div className="relative px-6 py-14 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[color:var(--cr-blue-deep)]/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-[color:var(--cr-red)] shadow-[0_0_10px_color-mix(in_oklch,var(--cr-red)_70%,transparent)]" />
                Tours & Experiences
              </div>
              <h2 className="mt-6 text-balance font-display text-[2.25rem] font-black leading-[1.02] tracking-tight text-white text-shadow-hero sm:text-5xl lg:text-[3.5rem]">
                Choose your{" "}
                <span className="text-cr-on-photo">
                  Pura Vida
                </span>{" "}
                adventure
              </h2>
              <p className="mt-5 max-w-xl text-pretty text-base font-medium leading-relaxed text-white text-shadow-body sm:text-lg">
                From first waves to starlit jungles, every tour is handcrafted
                by locals who know every corner of Nosara. Hand-picked routes,
                small groups, no tourist traps.
              </p>

              {/* Slide indicator — subtle red→white→blue accent on active. */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {BG_SLIDES.map((s, i) => (
                    <span
                      key={s}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === bgIdx ? "w-8 bg-white" : "w-3 bg-white/45"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
                  {String(bgIdx + 1).padStart(2, "0")}
                  <span className="mx-1 text-white/45">/</span>
                  {String(BG_SLIDES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== *
         *  Grid of tours
         * ============================================================== */}
        <div className="mt-14 grid gap-6 sm:mt-16 sm:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {TOURS.map((tour, idx) => (
            <article
              key={tour.slug}
              className="reveal hover-lift group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_2px_0_0_color-mix(in_oklch,var(--foreground)_3%,transparent)]"
              style={{ transitionDelay: `${(idx % 3) * 70}ms` }}
            >
              {/* Image area --------------------------------------------------*/}
              <a
                href={tourHref(tour.slug)}
                aria-label={`Ver detalles del ${tour.title}`}
                className="relative block aspect-[4/3] overflow-hidden"
              >
                <img
                  src={tour.image}
                  alt={tour.title}
                  loading="lazy"
                  className="size-full object-cover"
                  style={{ imageRendering: "auto" }}
                />
                {/* Discreet bottom-up gradient — CR navy, let the photo breathe */}
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--cr-blue-deep)]/26 via-[color:var(--cr-blue-deep)]/3 to-transparent" />

                {/* Top row: category + price */}
                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                  <Badge
                    className={`rounded-full border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_18px_-6px_rgba(3,11,34,0.45)] ${ACCENT_BG[tour.accent]}`}
                  >
                    {tour.category ?? "Tour"}
                  </Badge>
                  <Badge
                    className="rounded-full border-0 bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--cr-blue-deep)] shadow-[0_8px_18px_-6px_rgba(3,11,34,0.4)]"
                  >
                    {SHOW_PRICES ? tour.price : "Inquire"}
                  </Badge>
                </div>

                {/* Bottom: location + open-in-new affordance */}
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[color:var(--cr-blue-deep)]/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                    <MapPin className="size-3" />
                    {tour.meetingPoint?.split("—")[0].trim() ?? "Nosara"}
                  </div>
                  <span
                    aria-hidden
                    className="inline-flex size-9 items-center justify-center rounded-full border border-white/30 bg-[color:var(--cr-blue-deep)]/55 text-white shadow-[0_8px_18px_-6px_rgba(3,11,34,0.5)] backdrop-blur-md transition-all duration-500 group-hover:translate-x-0.5 group-hover:border-white/65"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </a>

              {/* Body --------------------------------------------------------*/}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3
                  className={`font-display text-[1.45rem] font-black leading-[1.08] tracking-[-0.012em] text-foreground transition-colors duration-500 sm:text-[1.6rem] ${ACCENT_TITLE_HOVER[tour.accent]}`}
                >
                  {tour.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted-foreground">
                  {tour.description}
                </p>

                {/* Meta row */}
                <ul className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-foreground/80">
                  <li className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5 text-muted-foreground" />
                    {tour.duration}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5 text-muted-foreground" />
                    {tour.group}
                  </li>
                  {tour.difficulty && (
                    <li className="inline-flex items-center gap-1.5">
                      <Mountain className="size-3.5 text-muted-foreground" />
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${DIFFICULTY_DOT[tour.difficulty]}`}
                        />
                        {tour.difficulty}
                      </span>
                    </li>
                  )}
                </ul>

                {/* Action buttons — outline picks up the card's CR accent on
                 * hover; primary uses the same accent in solid form. Hovers
                 * are kept minimal: no scale, just a quiet color/shadow shift. */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch">
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className={`h-11 flex-1 rounded-xl border-border/70 bg-transparent text-sm font-semibold transition-all duration-500 ${ACCENT_GHOST[tour.accent]}`}
                  >
                    <a href={tourHref(tour.slug)}>
                      <Eye className="mr-1.5 size-4" />
                      Ver Más
                    </a>
                  </Button>
                  <TourReservation
                    tour={tour}
                    trigger={
                      <Button
                        type="button"
                        className={`btn-shine h-11 flex-1 rounded-xl text-sm font-semibold tracking-wide transition-all duration-500 ${ACCENT_CTA[tour.accent]}`}
                      >
                        Reservar
                        <ArrowRight className="ml-1.5 size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                      </Button>
                    }
                  />
                </div>
              </div>

              {/* Top hairline accent that lights up on hover */}
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-transparent to-transparent transition-all duration-500 ${ACCENT_HAIRLINE[tour.accent]}`}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
