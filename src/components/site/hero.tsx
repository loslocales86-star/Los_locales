import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowRight, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TodayInNosara } from "./today-in-nosara"

/* ---------------------------------------------------------------------------
 * Hero slides — cinematic, Tesla / SpaceX-inspired carousel
 * Each slide is a full-bleed photograph with a short location caption.
 * -------------------------------------------------------------------------*/
type HeroSlide = {
  src: string
  alt: string
  location: string
  caption: string
}

const HERO_SLIDES: HeroSlide[] = [
  {
    /*src: "/nosara-beach-gemini.png",*/
    src: "/chi1.png",
    alt: "Playa Peladas at sunset in Nosara, Costa Rica",
    location: "Playa Peladas",
    caption: "Sunset at Nosara, Costa Rica",
  },
  {
    src: "/chi2.png",
    alt: "Surfers paddling out at Playa Guiones",
    location: "Waterfalls río montaña",
    caption: "Camps in the jungle",
  },
  {
    src: "/hi3.png",
    alt: "Cliffside sunset over Playa Pelada",
    location: "Waterfalls",
    caption: "Waterfalls in the jungle",
  },
  {
    src: "/chi4.png",
    alt: "Wildlife refuge at Playa Ostional",
    location: "Waterfalls Mala noche",
    caption: "Mala noche at the waterfalls",
  },
  {
    src: "/paddle.jpg",
    alt: "Kayaking the Nosara mangrove estuary",
    location: "River Nosara",
    caption: "River Nosara",
  },
]

const SLIDE_DURATION_MS = 6500

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

  const active = HERO_SLIDES[activeIdx]

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-24 pt-32 sm:items-center sm:pb-32 sm:pt-36"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* ----------------------------------------------------------------- *
       * Cinematic carousel — crossfading full-bleed photography
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
                className={`size-full object-cover ${
                  isActive ? "ken-burns" : "scale-[1.06]"
                }`}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding={idx === 0 ? "sync" : "async"}
                draggable={false}
              />
            </div>
          )
        })}

        {/* Cinematic gradient stack — preserves text legibility on every slide */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0B1B3A]/35 via-[#0B1B3A]/50 to-[#0B1B3A]/90" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0B1B3A]/65 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/3 z-[2] h-1/2 bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_oklch,var(--gold)_18%,transparent)_0%,transparent_70%)]" />
      </div>

      {/* Costa Rica flag accent line --------------------------------------*/}
      <div className="cr-stripe pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] opacity-90" />

      {/* ----------------------------------------------------------------- *
       * Slide caption — top-right minimalist chip (Tesla-style)
       * ----------------------------------------------------------------- */}
      <div className="pointer-events-none absolute right-[5%] top-24 z-20 hidden sm:block">
        <div
          key={active.src}
          className="fade-up flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/95 backdrop-blur-md"
        >
          <span className="text-white/55 tabular-nums">
            {String(activeIdx + 1).padStart(2, "0")}
            <span className="px-1 text-white/30">/</span>
            {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
          <span className="h-3 w-px bg-white/25" />
          <span className="text-white">{active.location}</span>
          <span className="hidden text-white/55 normal-case tracking-normal md:inline">
            · {active.caption}
          </span>
        </div>
      </div>

      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="max-w-3xl text-background fade-up">
          {/* Eyebrow location chip */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/95 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--gold)]/70" />
              <span className="relative inline-flex size-2 rounded-full bg-[color:var(--gold)]" />
            </span>
            Nosara · Guanacaste · Costa Rica
          </div>

          {/* Hero headline */}
          <h1 className="mt-7 text-balance font-display text-[3.25rem] font-extrabold leading-[0.92] tracking-tight text-white text-shadow-soft sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            Los{" "}
            <span className="bg-gradient-to-r from-[color:var(--gold)] via-[#FBE3A2] to-white bg-clip-text text-transparent">
              Locales
            </span>
          </h1>

          {/* Lede + supporting copy */}
          <p className="mt-6 max-w-2xl text-balance text-xl font-medium text-white/95 sm:text-2xl md:text-[1.6rem] md:leading-snug">
            Discover and enjoy the beauty of Nosara.
          </p>

          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
            With the best and most experienced tour guides of Nosara, we give
            you the most authentic experience of the town — the way only the
            locals can.
          </p>

          {/* Primary actions */}
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="btn-shine h-[52px] rounded-full bg-[color:var(--gold)] px-7 text-[15px] font-semibold text-[color:var(--gold-foreground)] shadow-[0_18px_40px_-12px_color-mix(in_oklch,var(--gold)_70%,transparent)] transition-transform duration-300 hover:scale-[1.03] hover:bg-[color:var(--gold)]/95"
            >
              <a href="#reserve">
                Book Your Adventure
                <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-[52px] rounded-full border-white/30 bg-white/10 px-6 text-[15px] font-semibold text-white backdrop-blur-md transition hover:scale-[1.02] hover:border-white/50 hover:bg-white/20 hover:text-white"
            >
              <a href="#contact">
                <MessageCircle className="mr-1.5 size-4" />
                WhatsApp Us
              </a>
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/85">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="size-4 fill-[color:var(--gold)] text-[color:var(--gold)] drop-shadow-[0_0_6px_color-mix(in_oklch,var(--gold)_50%,transparent)]"
                />
              ))}
              <span className="ml-1.5 font-semibold tracking-tight text-white">
                4.9
              </span>
              <span className="text-white/60">· 300+ travelers</span>
            </div>
            <div className="hidden h-4 w-px bg-white/25 sm:block" />
            <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/70">
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
       * Carousel control rail — full-width thin progress segments
       * (Tesla / SpaceX inspired minimalist navigation)
       * ----------------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex w-[min(1240px,94%)] items-end justify-between gap-6 pb-6">
          {/* Mobile caption — visible only on small screens */}
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/75 sm:hidden">
            <span className="tabular-nums text-white">
              {String(activeIdx + 1).padStart(2, "0")}
            </span>
            <span className="text-white/40">/</span>
            <span className="tabular-nums text-white/60">
              {String(HERO_SLIDES.length).padStart(2, "0")}
            </span>
            <span className="ml-2 text-white/55 tracking-[0.22em]">
              {active.location}
            </span>
          </div>

          {/* Scroll cue — tucked away on the left for sm+ */}
          <div className="hidden flex-col items-start gap-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/55 sm:flex">
            <span>Scroll</span>
            <span className="h-8 w-px bg-gradient-to-b from-white/60 to-transparent" />
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
                  <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-white/25 transition group-hover/slide:bg-white/45 group-focus-visible/slide:bg-white/60" />
                  <span
                    className={`absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 origin-left transition-transform duration-700 ease-out ${
                      isPast ? "scale-x-100 bg-white" : "scale-x-0 bg-white"
                    }`}
                  />
                  {isActive && !isPaused && (
                    <span
                      key={`progress-${activeIdx}`}
                      className="hero-progress-fill absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-[color:var(--gold)]"
                      style={
                        {
                          ["--hero-slide-duration"]: `${SLIDE_DURATION_MS}ms`,
                        } as React.CSSProperties
                      }
                    />
                  )}
                  {isActive && isPaused && (
                    <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-[color:var(--gold)]" />
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
