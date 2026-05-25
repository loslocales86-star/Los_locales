import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TodayInNosara } from "./today-in-nosara"

/* ---------------------------------------------------------------------------
 * Hero slides — cinematic HD carousel
 *
 * Goals:
 *  • Photographs are presented at full quality (no whole-image dark wash).
 *  • A scrim only where the text lives, so colors / tone of the image stay
 *    untouched everywhere else.
 *  • Each slide carries an accent color used by chips and the progress bar,
 *    making elements contrast cleanly against any image.
 * -------------------------------------------------------------------------*/
type HeroAccent = "gold" | "jungle" | "cr-red" | "cr-blue"

type HeroSlide = {
  src: string
  alt: string
  location: string
  caption: string
  accent: HeroAccent
}

const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/cuadras.jpeg",
    alt: "Local Nosara streets — pure Pura Vida",
    location: "Pueblo de Nosara",
    caption: "Authentic Pura Vida culture",
    accent: "cr-red",
  },
  {
    src: "/peladas_playa.png",
    alt: "Playa Pelada — golden hour over the Pacific in Nosara, Costa Rica",
    location: "Playa Pelada",
    caption: "Hidden coves & golden hour",
    accent: "gold",
  },
  {
    src: "/gemini_kayakk.png",
    alt: "Kayaking the Río Nosara mangroves at sunrise",
    location: "Río Nosara",
    caption: "Mangroves & wildlife paddle",
    accent: "jungle",
  },
  {
    src: "/chi1.png",
    alt: "Cliffside Pacific sunset above Nosara",
    location: "Pacific cliffs",
    caption: "Cliff sunsets above Nosara",
    accent: "cr-blue",
  },
  // {
  //   src: "/ostional.jpg",
  //   alt: "beach",
  //   location: "ostional beach",
  //   caption: "Ostional beach",
  //   accent: "gold",
  // },
]

const SLIDE_DURATION_MS = 6500

/* ---------------------------------------------------------------------------
 * Accent helpers — every slide drives chips, the progress bar and the rule
 * underneath the headline. Only CR flag tones are used (red / blue), with
 * "deep" variants giving subtle differentiation between slides.
 * -------------------------------------------------------------------------*/
const ACCENT_BG: Record<HeroAccent, string> = {
  gold: "bg-[color:var(--cr-red)]",
  jungle: "bg-[color:var(--cr-blue)]",
  "cr-red": "bg-[color:var(--cr-red-deep)]",
  "cr-blue": "bg-[color:var(--cr-blue-deep)]",
}

const ACCENT_TEXT: Record<HeroAccent, string> = {
  gold: "text-[color:var(--cr-red)]",
  jungle: "text-[color:var(--cr-blue)]",
  "cr-red": "text-[color:var(--cr-red-deep)]",
  "cr-blue": "text-[color:var(--cr-blue-deep)]",
}

const ACCENT_GLOW: Record<HeroAccent, string> = {
  gold: "color-mix(in oklch, var(--cr-red) 60%, transparent)",
  jungle: "color-mix(in oklch, var(--cr-blue) 60%, transparent)",
  "cr-red": "color-mix(in oklch, var(--cr-red-deep) 60%, transparent)",
  "cr-blue": "color-mix(in oklch, var(--cr-blue-deep) 60%, transparent)",
}

export function Hero() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<number | null>(null)

  const goTo = useCallback((idx: number) => {
    setActiveIdx(((idx % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  /* Auto-advance — pause on hover/focus, restart cleanly when slide changes. */
  useEffect(() => {
    if (isPaused) return
    timerRef.current = window.setTimeout(() => {
      setActiveIdx((i) => (i + 1) % HERO_SLIDES.length)
    }, SLIDE_DURATION_MS)
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [activeIdx, isPaused])

  /* Pre-load every hero photo immediately so HD frames are ready before
   * their slide takes the stage — avoids low-quality crossfades. */
  useEffect(() => {
    HERO_SLIDES.forEach((s) => {
      const img = new Image()
      img.src = s.src
    })
  }, [])

  const active = HERO_SLIDES[activeIdx]

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-24 pt-32 sm:items-center sm:pb-32 sm:pt-36"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      style={{ ["--hero-accent-glow" as string]: ACCENT_GLOW[active.accent] }}
    >
      {/* ----------------------------------------------------------------- *
       * Cinematic carousel — full-quality photographs, crossfading.
       * ----------------------------------------------------------------- */}
      <div className="absolute inset-0 -z-10">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeIdx
          return (
            <div
              key={slide.src}
              className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0,
              }}
              aria-hidden={!isActive}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="size-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding={idx === 0 ? "sync" : "async"}
                draggable={false}
                style={{ imageRendering: "auto" }}
              />
            </div>
          )
        })}

        {/* Discreet scrims — keep the photograph mostly untouched. The left
         * column gets a CR-navy wash so white type stays legible against any
         * frame; the bottom edge gets a softer rail for the progress bar. */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[color:var(--cr-blue-deep)]/30 via-[color:var(--cr-blue-deep)]/5 to-transparent sm:from-[color:var(--cr-blue-deep)]/24 sm:via-[color:var(--cr-blue-deep)]/2" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-[22%] bg-gradient-to-t from-[color:var(--cr-blue-deep)]/24 via-[color:var(--cr-blue-deep)]/3 to-transparent" />
      </div>

      {/* Costa Rica flag accent line --------------------------------------*/}
      <div className="cr-stripe pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] opacity-90" />

      {/* ----------------------------------------------------------------- *
       * Slide caption — top-right minimalist chip
       * ----------------------------------------------------------------- */}
      <div className="pointer-events-none absolute right-[5%] top-24 z-20 hidden sm:block">
        <div
          key={active.src}
          className="fade-up flex items-center gap-3 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/95 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
          <span className="text-white/55 tabular-nums">
            {String(activeIdx + 1).padStart(2, "0")}
            <span className="px-1 text-white/30">/</span>
            {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
          <span className="h-3 w-px bg-white/25" />
          <span className={`size-1.5 rounded-full ${ACCENT_BG[active.accent]} shadow-[0_0_10px_var(--hero-accent-glow)]`} />
          <span className="text-white">{active.location}</span>
          <span className="hidden text-white/55 normal-case tracking-normal md:inline">
            · {active.caption}
          </span>
        </div>
      </div>

      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="max-w-3xl fade-up">
          {/* Eyebrow location chip — uses the slide accent (always CR red/blue) */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-[color:var(--cr-blue-deep)]/45 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_-10px_rgba(3,11,34,0.65)] backdrop-blur-md">
            <span className="relative flex size-2">
              <span
                className={`absolute inline-flex size-full animate-ping rounded-full ${ACCENT_BG[active.accent]} opacity-70`}
              />
              <span
                className={`relative inline-flex size-2 rounded-full ${ACCENT_BG[active.accent]}`}
              />
            </span>
            Nosara · Guanacaste · Costa Rica
          </div>

          {/* Hero headline — white title with subtle BCR blue/red glow.
           * Keeps premium contrast over photos while adding brand color depth. */}
          <h1 className="mt-6 font-display font-black uppercase leading-[0.92] tracking-[-0.02em] [text-shadow:0_2px_10px_rgba(0,0,0,0.45),-8px_0_22px_color-mix(in_oklch,var(--cr-blue)_42%,transparent),8px_0_22px_color-mix(in_oklch,var(--cr-red)_42%,transparent)]">
            <span className="block text-[1.3rem] tracking-[0.09em] sm:text-[1.45rem] md:text-[1.6rem] lg:text-[1.75rem]">
              <span className="text-[color:var(--cr-red)]">LO</span>
              <span className="text-white">S</span>
            </span>
            <span className="-mt-1 block text-[2.6rem] sm:text-[3.6rem] md:text-[4.6rem] lg:text-[5.4rem]">
              <span className="text-[color:var(--cr-red)]">LO</span>
              <span className="text-white">CA</span>
              <span className="text-[color:var(--cr-blue)]">LES</span>
            </span>
          </h1>

          {/* CR-flag accent rule — three short stripes anchor the headline. */}
          <div className="mt-5 flex items-center gap-1.5">
            <span className="h-[3px] w-10 rounded-full bg-[color:var(--cr-blue)] shadow-[0_0_14px_color-mix(in_oklch,var(--cr-blue)_55%,transparent)] sm:w-14" />
            <span className="h-[3px] w-6 rounded-full bg-white/95 sm:w-8" />
            <span className="h-[3px] w-10 rounded-full bg-[color:var(--cr-red)] shadow-[0_0_14px_color-mix(in_oklch,var(--cr-red)_55%,transparent)] sm:w-14" />
          </div>

          {/* Lede + supporting copy — pure white with a soft halo. */}
          <p className="mt-6 max-w-2xl text-balance text-xl font-semibold text-white text-shadow-body sm:text-2xl md:text-[1.55rem] md:leading-snug">
            Discover and enjoy the beauty of Nosara.
          </p>

          <p className="mt-4 max-w-xl text-pretty text-base font-medium leading-relaxed text-white text-shadow-body sm:text-lg">
            With the best and most experienced tour guides of Nosara, we give
            you the most authentic experience of the town — the way only the
            locals can.
          </p>

          {/* Primary actions — CR red CTA and a glass white outline. Hovers
           * are minimal: a quiet color shift and shadow swell, no big jumps. */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="btn-shine group h-[52px] rounded-full bg-[color:var(--cr-red)] px-7 text-[15px] font-semibold tracking-wide text-[color:var(--cr-red-foreground)] shadow-[0_18px_40px_-14px_color-mix(in_oklch,var(--cr-red)_72%,transparent)] transition-all duration-500 hover:bg-[color:var(--cr-red-deep)] hover:shadow-[0_22px_50px_-14px_color-mix(in_oklch,var(--cr-red)_78%,transparent)]"
            >
              <a href="#reserve">
                Book Your Adventure
                <ArrowRight className="ml-1.5 size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[52px] rounded-full border border-white/55 bg-white/10 px-6 text-[15px] font-semibold tracking-wide text-white shadow-[0_10px_28px_-14px_rgba(3,11,34,0.55)] backdrop-blur-md transition-all duration-500 hover:border-white hover:bg-white/18 hover:text-white"
            >
              <a href="#contact">
                <MessageCircle className="mr-1.5 size-4" />
                WhatsApp Us
              </a>
            </Button>
          </div>

          {/* Trust strip — white stars on a navy chip read on any photo. */}
          <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white">
            <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-[color:var(--cr-blue-deep)]/55 px-3 py-1.5 backdrop-blur-md">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="size-4 fill-white text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]"
                />
              ))}
              <span className="ml-1.5 font-bold tracking-tight text-white">
                4.9
              </span>
              <span className="text-white/85">· 300+ travelers</span>
            </div>
            <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white text-shadow-body">
              Top Rated Local Experience
            </span>
          </div>

          {/* Live conditions — compact strip on mobile/tablet --------------*/}
          <div className="mt-7 max-w-md lg:hidden">
            <TodayInNosara variant="compact" />
          </div>
        </div>

        {/* Floating live conditions card — desktop only -------------------*/}
        <div className="absolute bottom-28 right-[5%] hidden w-72 lg:block">
          <TodayInNosara />
        </div>
      </div>

      {/* ----------------------------------------------------------------- *
       * Carousel control rail — Tesla / SpaceX inspired thin segments
       * ----------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex w-[min(1240px,94%)] items-end justify-between gap-6 pb-6">
          {/* Mobile caption — visible only on small screens */}
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:hidden">
            <span className="tabular-nums text-white">
              {String(activeIdx + 1).padStart(2, "0")}
            </span>
            <span className="text-white/50">/</span>
            <span className="tabular-nums text-white/70">
              {String(HERO_SLIDES.length).padStart(2, "0")}
            </span>
            <span className={`ml-1 size-1.5 rounded-full ${ACCENT_BG[active.accent]}`} />
            <span className="ml-1 text-white/85 tracking-[0.22em]">
              {active.location}
            </span>
          </div>

          {/* Scroll cue — tucked away on the left for sm+ */}
          <div className="hidden flex-col items-start gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/65 sm:flex">
            <span>Scroll</span>
            <span className="h-8 w-px bg-gradient-to-b from-white/70 to-transparent" />
          </div>

          {/* Progress segments */}
          <div
            className="pointer-events-auto flex flex-1 items-center justify-end gap-2.5 sm:gap-3"
            role="tablist"
            aria-label="Hero slides"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === activeIdx
              const isPast = idx < activeIdx
              return (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${idx + 1}: ${slide.location} — ${slide.caption}`}
                  onClick={() => goTo(idx)}
                  className="group/slide relative h-8 cursor-pointer focus:outline-none"
                  style={{ flexBasis: "clamp(40px, 9vw, 96px)" }}
                >
                  <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-white/30 transition group-hover/slide:bg-white/55 group-focus-visible/slide:bg-white/70" />
                  <span
                    className={`absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 origin-left transition-transform duration-700 ease-out ${
                      isPast ? "scale-x-100 bg-white" : "scale-x-0 bg-white"
                    }`}
                  />
                  {isActive && !isPaused && (
                    <span
                      key={`progress-${activeIdx}`}
                      className={`hero-progress-fill absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 ${ACCENT_BG[slide.accent]} ${ACCENT_TEXT[slide.accent]} shadow-[0_0_12px_currentColor]`}
                      style={
                        {
                          ["--hero-slide-duration"]: `${SLIDE_DURATION_MS}ms`,
                        } as React.CSSProperties
                      }
                    />
                  )}
                  {isActive && isPaused && (
                    <span className={`absolute inset-x-0 top-1/2 block h-[2px] -translate-y-1/2 ${ACCENT_BG[slide.accent]}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
