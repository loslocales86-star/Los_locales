import { ArrowRight, Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SHOW_PRICES } from "@/lib/site-config"
import { TourReservation } from "./tour-reservation"

export type Tour = {
  slug: string
  title: string
  description: string
  image: string
  duration: string
  group: string
  price: string
  accent: "gold" | "jungle" | "red" | "blue"
}

export const TOURS: Tour[] = [
  {
    slug: "atv-tours",
    title: "ATV Adventures",
    description:
      "Rip through jungle trails, river crossings and secret lookout points.",
    image: "/tour.jpg",
    duration: "3 hrs",
    group: "1-6 people",
    price: "from $120",
    accent: "red",
  },
  {
    slug: "kayak-tours",
    title: "Kayak Tours",
    description:
      "Glide through the Nosara mangrove estuary and spot tropical wildlife.",
    image: "/paddle.jpg",
    duration: "2.5 hrs",
    group: "1-8 people",
    price: "from $55",
    accent: "jungle",
  },
  {
    slug: "nature-adventures",
    title: "Nature Adventures",
    description:
      "Monkeys, toucans and waterfalls — guided rainforest hikes off the map.",
    image: "/adventure.jpg",
    duration: "4 hrs",
    group: "1-8 people",
    price: "from $75",
    accent: "jungle",
  },
  {
    slug: "beach-tours",
    title: "Beach Tours",
    description:
      "A full-day tasting of Nosara's best beaches — from Guiones to Ostional.",
    image: "/guiones.jpg",
    duration: "5 hrs",
    group: "2-10 people",
    price: "from $95",
    accent: "gold",
  },
  {
    slug: "sunset-tours",
    title: "Sunset Tours",
    description:
      "Golden hour from our favourite hidden cliff — drinks and tapas included.",
    image: "/sunset.jpg",
    duration: "2 hrs",
    group: "2-6 people",
    price: "from $65",
    accent: "gold",
  },
  {
    slug: "surf-lessons",
    title: "Surf Lessons",
    description:
      "Learn on the legendary Playa Guiones break with certified local instructors.",
    image: "/surfs.jpg",
    duration: "2 hrs",
    group: "1-4 people",
    price: "from $60",
    accent: "blue",
  },
]

const ACCENT: Record<Tour["accent"], string> = {
  gold: "bg-[color:var(--gold)] text-[color:var(--gold-foreground)]",
  jungle: "bg-[color:var(--jungle)] text-[color:var(--jungle-foreground)]",
  red: "bg-[color:var(--cr-red)] text-[color:var(--cr-red-foreground)]",
  blue: "bg-[color:var(--cr-blue)] text-[color:var(--cr-blue-foreground)]",
}

export function Tours() {
  return (
    <section
      id="tours"
      className="relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background py-24 sm:py-32 lg:py-36"
    >
      {/* Layered tropical wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-32 -z-10 size-[28rem] rounded-full bg-[color:var(--cr-blue)]/10 blur-3xl float-slower"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-32 -z-10 size-[26rem] rounded-full bg-[color:var(--jungle)]/15 blur-3xl float-slow"
      />

      <div className="mx-auto w-[min(1240px,94%)]">
        {/* Section header --------------------------------------------------*/}
        <div className="reveal mx-auto max-w-2xl text-center">
          <div className="eyebrow mx-auto">
            <span className="size-1.5 rounded-full bg-[color:var(--jungle)]" />
            Tours & Experiences
          </div>
          <h2 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Choose your{" "}
            <span className="text-cr-gradient">Pura Vida</span> adventure
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-[1.075rem]">
            From first waves to starlit jungles, every tour is handcrafted by
            locals who know every corner of Nosara.
          </p>
        </div>

        {/* Grid of tours ---------------------------------------------------*/}
        {/*<div className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3"> */}
        <div className="mt-12 grid gap-6 sm:gap-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {TOURS.map((tour, idx) => (
            <article
              key={tour.slug}
              className="reveal hover-lift group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_2px_0_0_color-mix(in_oklch,var(--foreground)_3%,transparent)]"
              style={{ transitionDelay: `${(idx % 3) * 70}ms` }}
            >
              {/* Image area --------------------------------------------------*/}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  loading="lazy"
                  className="size-full scale-[1.02] object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                {/* Bottom-up cinematic gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/85 via-[#0B1B3A]/20 to-transparent" />

                {/* Price badge — hidden until pricing is finalised */}
                {SHOW_PRICES ? (
                  <Badge
                    className={`absolute left-4 top-4 rounded-full border-0 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/20 ${ACCENT[tour.accent]}`}
                  >
                    {tour.price}
                  </Badge>
                ) : (
                  <Badge
                    className={`absolute left-4 top-4 rounded-full border-0 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] shadow-lg shadow-black/20 ${ACCENT[tour.accent]}`}
                  >
                    Inquire for pricing
                  </Badge>
                )}

                {/* Meta chips */}
                <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/95">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 backdrop-blur-md">
                    <Clock className="size-3" />
                    {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 backdrop-blur-md">
                    <Users className="size-3" />
                    {tour.group}
                  </span>
                </div>
              </div>

              {/* Body --------------------------------------------------------*/}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="font-display text-xl font-bold leading-tight tracking-tight sm:text-[1.35rem]">
                  {tour.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tour.description}
                </p>

                <TourReservation
                  tour={tour}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-6 h-11 justify-between rounded-xl border border-transparent bg-secondary/80 px-4 text-sm font-semibold transition hover:border-[color:var(--gold)]/40 hover:bg-[color:var(--gold)]/15 hover:text-foreground"
                    >
                      <span className="flex items-center gap-1.5">
                        Reserve <span className="font-bold">{tour.title}</span>
                      </span>
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  }
                />
              </div>

              {/* Top hairline accent that lights up on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold)]/0 to-transparent transition-all duration-500 group-hover:via-[color:var(--gold)]/70"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
