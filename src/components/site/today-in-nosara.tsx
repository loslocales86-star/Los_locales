import { useEffect, useState } from "react"
import { Loader2, Waves, Wind } from "lucide-react"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
 * Today in Nosara — live conditions card
 * Data: Open-Meteo (free, keyless). Cached in localStorage for 30 min.
 *  - Weather:  https://api.open-meteo.com/v1/forecast
 *  - Marine:   https://marine-api.open-meteo.com/v1/marine
 *
 * Coordinates target Playa Guiones, Nosara, Guanacaste.
 * -------------------------------------------------------------------------*/

const NOSARA_LAT = 9.9525
const NOSARA_LON = -85.6664
const MARINE_LAT = 9.93
const MARINE_LON = -85.72

const CACHE_KEY = "ll:today-in-nosara:v1"
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 min

/** Playa Guiones faces roughly WSW (~250°). Offshore wind blows FROM ~70°. */
const COAST_NORMAL_OUT = 70

type Conditions = {
  tempF: number
  tempC: number
  weatherCode: number
  windKmh: number
  windDirDeg: number
  /** Significant wave height in meters; null if marine endpoint failed. */
  waveM: number | null
  fetchedAt: number
}

type CardState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: Conditions }

const weatherText = (code: number): string => {
  if (code === 0) return "Clear sky"
  if (code === 1) return "Mostly clear"
  if (code === 2) return "Partly cloudy"
  if (code === 3) return "Overcast"
  if ([45, 48].includes(code)) return "Foggy"
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle"
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy"
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow"
  if ([95, 96, 99].includes(code)) return "Storm"
  return "Tropical"
}

type WindTone = "good" | "ok" | "bad"

const windQuality = (
  dirDeg: number,
  speedKmh: number
): { label: string; tone: WindTone } => {
  // Circular distance between wind FROM direction and offshore reference (70°)
  const diff = Math.min(
    Math.abs(dirDeg - COAST_NORMAL_OUT),
    360 - Math.abs(dirDeg - COAST_NORMAL_OUT)
  )

  let label: string
  let tone: WindTone

  if (diff <= 55) {
    label = "Offshore"
    tone = "good"
  } else if (diff >= 125) {
    label = "Onshore"
    tone = "bad"
  } else {
    label = "Cross-shore"
    tone = "ok"
  }

  if (speedKmh >= 28 && tone === "good") tone = "ok"
  if (speedKmh >= 35) tone = "bad"

  return { label, tone }
}

const surfNote = (
  wave: number | null,
  wind: ReturnType<typeof windQuality>
): string => {
  if (wave == null) {
    if (wind.tone === "good") return "Clean local winds for the lineup."
    if (wind.tone === "bad") return "Choppy day — better for swimming."
    return "Mixed wind — check the tides."
  }
  const w = wave
  if (w < 0.6) return "Tiny day — perfect for first lessons."
  if (w < 1.0) return "Mellow swell — great for beginners."
  if (w < 1.6) return "Fun, playful waves all day."
  if (w < 2.2) return "Solid swell — bring your board."
  return "Heavy swell — for confident surfers."
}

/* ---------------- Data fetching ------------------------------------------*/

const readCache = (): Conditions | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Conditions
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

const writeCache = (c: Conditions) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c))
  } catch {
    /* ignore quota errors */
  }
}

const fetchConditions = async (signal: AbortSignal): Promise<Conditions> => {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${NOSARA_LAT}&longitude=${NOSARA_LON}` +
    `&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m` +
    `&temperature_unit=fahrenheit&wind_speed_unit=kmh&timezone=auto`

  const marineUrl =
    `https://marine-api.open-meteo.com/v1/marine` +
    `?latitude=${MARINE_LAT}&longitude=${MARINE_LON}` +
    `&current=wave_height&timezone=auto`

  const [wxRes, mxRes] = await Promise.allSettled([
    fetch(weatherUrl, { signal }),
    fetch(marineUrl, { signal }),
  ])

  if (wxRes.status !== "fulfilled" || !wxRes.value.ok) {
    throw new Error("weather-failed")
  }
  const wx = (await wxRes.value.json()) as {
    current: {
      temperature_2m: number
      weather_code: number
      wind_speed_10m: number
      wind_direction_10m: number
    }
  }

  let waveM: number | null = null
  if (mxRes.status === "fulfilled" && mxRes.value.ok) {
    try {
      const mx = (await mxRes.value.json()) as {
        current?: { wave_height?: number | null }
      }
      const w = mx.current?.wave_height
      if (typeof w === "number" && Number.isFinite(w)) waveM = w
    } catch {
      /* ignore — marine is optional */
    }
  }

  const tempF = Math.round(wx.current.temperature_2m)
  const tempC = Math.round(((tempF - 32) * 5) / 9)

  return {
    tempF,
    tempC,
    weatherCode: wx.current.weather_code,
    windKmh: Math.round(wx.current.wind_speed_10m),
    windDirDeg: Math.round(wx.current.wind_direction_10m),
    waveM,
    fetchedAt: Date.now(),
  }
}

/* ---------------- Component ---------------------------------------------*/

type Props = {
  variant?: "full" | "compact"
  className?: string
}

export function TodayInNosara({ variant = "full", className }: Props) {
  const [state, setState] = useState<CardState>(() => {
    const cached = readCache()
    return cached ? { status: "ready", data: cached } : { status: "loading" }
  })

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      setState({ status: "ready", data: cached })
      return
    }

    const ctrl = new AbortController()
    fetchConditions(ctrl.signal)
      .then((data) => {
        writeCache(data)
        setState({ status: "ready", data })
      })
      .catch(() => {
        setState({ status: "error" })
      })

    return () => ctrl.abort()
  }, [])

  /* Shared CR-themed surface (deep ocean → jungle gradient, never white) */
  const surface =
    "relative isolate overflow-hidden rounded-2xl text-white " +
    "ring-1 ring-white/20 " +
    "shadow-[0_24px_60px_-20px_color-mix(in_oklch,var(--cr-blue)_70%,transparent)] " +
    "[background:linear-gradient(135deg,color-mix(in_oklch,var(--cr-blue)_92%,black)_0%,color-mix(in_oklch,var(--cr-blue)_78%,var(--jungle))_60%,color-mix(in_oklch,var(--jungle)_92%,black)_100%)]"

  const Decor = (
    <>
      {/* CR flag stripe at the top edge */}
      <span
        aria-hidden
        className="cr-stripe pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-90"
      />
      {/* Gold halo (top-right) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-[color:var(--gold)]/40 blur-3xl"
      />
      {/* Red ember (bottom-left) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 -bottom-12 size-36 rounded-full bg-[color:var(--cr-red)]/25 blur-3xl"
      />
      {/* Subtle dotted texture */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "14px 14px",
        }}
      />
      {/* Bottom hairline accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold)]/55 to-transparent"
      />
    </>
  )

  if (variant === "compact") {
    return (
      <div className={cn(surface, "px-4 py-3.5", className)}>
        {Decor}
        <CompactBody state={state} />
      </div>
    )
  }

  return (
    <div className={cn(surface, "float-slower p-6", className)}>
      {Decor}
      <FullHeader />
      {state.status === "loading" && <SkeletonBody />}
      {state.status === "error" && <FallbackBody />}
      {state.status === "ready" && <LiveBody data={state.data} />}
    </div>
  )
}

/* ---------------- Sub-views ---------------------------------------------*/

function FullHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--gold)]">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--gold)]/70" />
          <span className="relative inline-flex size-2 rounded-full bg-[color:var(--gold)] shadow-[0_0_10px_color-mix(in_oklch,var(--gold)_70%,transparent)]" />
        </span>
        Today in Nosara
      </div>
      <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
        Live
      </span>
    </div>
  )
}

function LiveBody({ data }: { data: Conditions }) {
  const wind = windQuality(data.windDirDeg, data.windKmh)
  const note = surfNote(data.waveM, wind)
  const conditions = weatherText(data.weatherCode)

  const windToneClasses: Record<WindTone, string> = {
    good: "bg-[color:var(--jungle)]/30 text-white ring-[color:var(--jungle)]/50",
    ok: "bg-[color:var(--gold)]/30 text-white ring-[color:var(--gold)]/55",
    bad: "bg-[color:var(--cr-red)]/30 text-white ring-[color:var(--cr-red)]/55",
  }

  return (
    <>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(8,12,24,0.4)]">
          {data.tempC}°C
        </div>
        <div className="text-sm text-white/75">/ {data.tempF}°F</div>
        <div className="ml-auto text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
          {conditions}
        </div>
      </div>

      {/* Conditions chips ------------------------------------------------ */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {data.waveM != null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--cr-blue)]/35 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/20">
            <Waves className="size-3.5" strokeWidth={2.4} />
            {data.waveM.toFixed(1)}m
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
            windToneClasses[wind.tone]
          )}
        >
          <Wind className="size-3.5" strokeWidth={2.4} />
          {wind.label}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80 ring-1 ring-white/15">
          {data.windKmh} km/h
        </span>
      </div>

      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="mt-3 text-xs leading-relaxed text-white/85">{note}</div>
    </>
  )
}

function SkeletonBody() {
  return (
    <>
      <div className="mt-3 flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-white/80" />
        <div className="text-sm text-white/80">Reading the lineup…</div>
      </div>
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="mt-3 h-3 w-3/4 rounded-full bg-white/10" />
    </>
  )
}

function FallbackBody() {
  return (
    <>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(8,12,24,0.4)]">
          28°C
        </div>
        <div className="text-sm text-white/75">/ 82°F</div>
      </div>
      <div className="mt-1 text-sm text-white/85">
        Tropical · steady offshore breeze
      </div>
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="mt-3 text-xs leading-relaxed text-white/80">
        Live data unavailable right now — typical Nosara conditions shown.
      </div>
    </>
  )
}

/* ---------------- Compact (mobile) view ---------------------------------*/

function CompactBody({ state }: { state: CardState }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex size-2.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--gold)]/70" />
        <span className="relative inline-flex size-2.5 rounded-full bg-[color:var(--gold)] shadow-[0_0_10px_color-mix(in_oklch,var(--gold)_70%,transparent)]" />
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--gold)]">
          Live · Nosara
        </span>
      </div>

      {state.status === "loading" && (
        <Loader2 className="size-4 shrink-0 animate-spin text-white/75" />
      )}

      {state.status !== "loading" && (
        <CompactReadout
          data={state.status === "ready" ? state.data : null}
        />
      )}
    </div>
  )
}

function CompactReadout({ data }: { data: Conditions | null }) {
  if (!data) {
    return (
      <div className="flex items-center gap-2 text-white/85">
        <span className="font-display text-base font-bold">28°C</span>
        <span className="text-[11px] text-white/65">offline</span>
      </div>
    )
  }

  const wind = windQuality(data.windDirDeg, data.windKmh)
  const windToneText: Record<WindTone, string> = {
    good: "text-[color:var(--jungle)]",
    ok: "text-[color:var(--gold)]",
    bad: "text-[color:var(--cr-red)]",
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="font-display text-base font-bold tracking-tight text-white">
        {data.tempC}°C
      </span>
      <span className="text-[11px] font-medium text-white/70">
        / {data.tempF}°F
      </span>
      {data.waveM != null && (
        <span className="hidden items-center gap-1 text-[11px] font-semibold text-white/85 min-[360px]:inline-flex">
          <Waves className="size-3.5 text-white/85" />
          {data.waveM.toFixed(1)}m
        </span>
      )}
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[11px] font-semibold",
          windToneText[wind.tone]
        )}
      >
        <Wind className="size-3.5" strokeWidth={2.4} />
        {wind.label}
      </span>
    </div>
  )
}
