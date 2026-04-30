import { Mail, MessageCircle } from "lucide-react"
import { FacebookIcon as Facebook, InstagramIcon as Instagram } from "./brand-icons"
import { LosLocalesLogo } from "./logo"

const LINKS = [
  {
    title: "Explore",
    items: [
      { label: "About", href: "#about" },
      { label: "Tours", href: "#tours" },
      { label: "Reviews", href: "#reviews" },
      { label: "Book", href: "#reserve" },
      { label: "Share your story", href: "#reviews" },
    ],
  },
  {
    title: "Experiences",
    items: [
      { label: "Surf Lessons", href: "#tours" },
      { label: "ATV Adventures", href: "#tours" },
      { label: "Kayak Tours", href: "#tours" },
      { label: "Sunset Tours", href: "#tours" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "WhatsApp +506 8606 8903", href: "https://wa.me/50686068903" },
      { label: "loslocales86@gmail.com", href: "mailto:loslocales86@gmail.com" },
      { label: "Playa Guiones, Nosara", href: "#contact" },
    ],
  },
]

const SOCIAL = [
  { icon: Instagram, href: "https://instagram.com/loslocales86", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61560176768852", label: "Facebook" },
  { icon: MessageCircle, href: "https://wa.me/50686068903", label: "WhatsApp" },
  { icon: Mail, href: "mailto:loslocales86@gmail.com", label: "Email" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[color:var(--cr-blue)] text-[color:var(--cr-blue-foreground)]">
      {/* Costa Rica flag accent at the very top */}
      <div className="cr-stripe pointer-events-none absolute inset-x-0 top-0 h-[3px] opacity-80" />

      {/* Tropical ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 8%, var(--gold) 0, transparent 32%), radial-gradient(circle at 82% 92%, var(--jungle) 0, transparent 38%)",
        }}
      />

      <div className="relative mx-auto w-[min(1240px,94%)] py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_repeat(3,_1fr)] lg:gap-10">
          {/* Brand column */}
          <div>
            <a
              href="#top"
              aria-label="Los Locales home"
              className="inline-flex items-center"
            >
              <LosLocalesLogo className="h-12 w-auto text-white" />
            </a>
            <p className="mt-5 max-w-sm text-pretty text-[15px] leading-relaxed text-white/80">
              Discover and enjoy the beauty of Nosara with the most experienced
              local guides. Authentic tours, big smiles, real Pura Vida.
            </p>

            {/* Social row */}
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:scale-110 hover:border-[color:var(--gold)] hover:bg-white/15"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>

            {/* Costa Rica flag mini-accent */}
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-white/80" />
              <span className="size-1.5 rounded-full bg-[color:var(--cr-red)]" />
              <span className="size-1.5 rounded-full bg-[color:var(--gold)]" />
              <span className="size-1.5 rounded-full bg-[color:var(--jungle)]" />
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">
                Made in Costa Rica
              </span>
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map((group) => (
            <div key={group.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--gold)]">
                {group.title}
              </div>
              <ul className="mt-5 space-y-2.5 text-[15px] text-white/85">
                {group.items.map((i) => (
                  <li key={i.label}>
                    <a
                      href={i.href}
                      className="inline-flex items-center gap-1 transition hover:translate-x-0.5 hover:text-[color:var(--gold)]"
                    >
                      {i.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer bar */}
        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-7 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Los Locales Nosara. Pura Vida. All
            rights reserved.
          </span>
          <span className="flex items-center gap-1.5">
            Crafted with love on the shores of Guanacaste.
          </span>
        </div>
      </div>
    </footer>
  )
}
