import { Award, Compass, Leaf, Users } from "lucide-react"

const FEATURES = [
  {
    icon: Users,
    title: "Born & raised locals",
    desc: "We grew up on these beaches. Every trail, wave and sunset is part of our story.",
    accent: "blue",
  },
  {
    icon: Award,
    title: "Certified guides",
    desc: "Licensed, bilingual and insured — safety and quality on every single tour.",
    accent: "red",
  },
  {
    icon: Leaf,
    title: "Eco-conscious",
    desc: "We protect Nosara's wildlife and communities with responsible, low-impact tours.",
    accent: "green",
  },
  {
    icon: Compass,
    title: "Authentic Pura Vida",
    desc: "Hidden spots, real stories and the warmest hospitality you'll find in Guanacaste.",
    accent: "gold",
  },
] as const

const ACCENT_TINT: Record<(typeof FEATURES)[number]["accent"], string> = {
  blue: "bg-[color:var(--cr-blue)]/10 text-[color:var(--cr-blue)] group-hover:bg-[color:var(--cr-blue)]/15",
  red: "bg-[color:var(--cr-red)]/10 text-[color:var(--cr-red)] group-hover:bg-[color:var(--cr-red)]/15",
  green:
    "bg-[color:var(--jungle)]/10 text-[color:var(--jungle)] group-hover:bg-[color:var(--jungle)]/15",
  gold: "bg-[color:var(--gold)]/15 text-[color:var(--gold-foreground)] group-hover:bg-[color:var(--gold)]/25",
}

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32 lg:py-36">
      {/* Subtle wash to avoid flat white */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-50"
      />

      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
          {/* Image collage --------------------------------------------------*/}
          <div className="reveal relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_color-mix(in_oklch,var(--cr-blue)_40%,transparent)] ring-1 ring-foreground/5">
              <img
                src="/peladas.jpg"
                alt="Los Locales tour guides in Nosara"
                className="size-full object-cover transition-transform duration-[1.4s] ease-out hover:scale-[1.04]"
                loading="lazy"
              />
              {/* Soft inner gradient to reinforce depth */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/35 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-8 -right-4 hidden w-60 sm:block">
              <div className="glass float-slow rounded-2xl border border-border/60 p-5 shadow-xl">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold leading-none text-primary">
                    10+
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    years
                  </span>
                </div>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Sharing Nosara with travelers from around the world.
                </div>
                <div className="mt-3 flex gap-1">
                  <span className="h-1 flex-1 rounded-full bg-[color:var(--cr-blue)]" />
                  <span className="h-1 flex-1 rounded-full bg-white ring-1 ring-border" />
                  <span className="h-1 flex-1 rounded-full bg-[color:var(--cr-red)]" />
                  <span className="h-1 flex-1 rounded-full bg-[color:var(--jungle)]" />
                </div>
              </div>
            </div>

            {/* Atmospheric blobs */}
            <div
              aria-hidden
              className="absolute -left-10 -top-10 -z-10 size-56 rounded-full bg-[color:var(--gold)]/35 blur-3xl float-slow"
            />
            <div
              aria-hidden
              className="absolute -bottom-12 left-12 -z-10 size-56 rounded-full bg-[color:var(--jungle)]/30 blur-3xl float-slower"
            />
          </div>

          {/* Copy -----------------------------------------------------------*/}
          <div className="reveal reveal-delay-1">
            <div className="eyebrow">
              <span className="size-1.5 rounded-full bg-[color:var(--cr-red)]" />
              About Los Locales
            </div>

            <h2 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Nosara, through the eyes of the people who call it{" "}
              <span className="text-cr-gradient">home</span>.
            </h2>

            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Los Locales is a family of Nosarenos passionate about sharing the
              wild beauty of our town — its empty beaches, turquoise breaks,
              hidden jungle trails and legendary sunsets. We design every
              experience around authenticity, safety and Pura Vida.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {FEATURES.map((f, idx) => (
                <div
                  key={f.title}
                  className="hover-lift group relative overflow-hidden rounded-2xl border border-border/70 bg-card/95 p-5 backdrop-blur-sm"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {/* Decorative corner accent */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full bg-gradient-to-br from-[color:var(--gold)]/0 to-[color:var(--gold)]/15 opacity-0 transition group-hover:opacity-100"
                  />
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl transition-colors duration-300 ${ACCENT_TINT[f.accent]}`}
                  >
                    <f.icon className="size-5" strokeWidth={2.2} />
                  </div>
                  <div className="mt-4 font-display text-[1.05rem] font-bold leading-tight tracking-tight">
                    {f.title}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
