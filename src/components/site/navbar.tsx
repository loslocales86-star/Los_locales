import { useEffect, useState } from "react"
import {
  CalendarDays,
  ChevronRight,
  Compass,
  Mail,
  Menu,
  MessageCircle,
  Star,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LosLocalesLogo } from "./logo"
import { FacebookIcon as Facebook, InstagramIcon as Instagram } from "./brand-icons"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "radix-ui"
import { cn } from "@/lib/utils"

type NavLink = {
  label: string
  href: string
  icon: typeof Users
  desc: string
  brand: "cr-red" | "jungle" | "gold" | "cr-blue" | "primary"
}

const NAV_LINKS: NavLink[] = [
  {
    label: "About",
    href: "#about",
    icon: Users,
    desc: "Meet the locals behind every tour",
    brand: "cr-red",
  },
  {
    label: "Tours",
    href: "#tours",
    icon: Compass,
    desc: "Surf, ATV, kayak, sunset & more",
    brand: "jungle",
  },
  {
    label: "Reviews",
    href: "#reviews",
    icon: Star,
    desc: "Real stories from real travelers",
    brand: "gold",
  },
  {
    label: "Book",
    href: "#reserve",
    icon: CalendarDays,
    desc: "Plan your Nosara adventure",
    brand: "primary",
  },
  {
    label: "Contact",
    href: "#contact",
    icon: MessageCircle,
    desc: "Pura Vida, one tap away",
    brand: "cr-blue",
  },
]

const QUICK_CONTACT = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/50686068903",
    brand: "jungle" as const,
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/loslocales86",
    brand: "cr-red" as const,
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61560176768852",
    brand: "cr-blue" as const,
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:loslocales86@gmail.com",
    brand: "gold" as const,
  },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2.5" : "py-5"
      )}
    >
      <div className="mx-auto w-[min(1240px,94%)]">
        <div
          className={cn(
            "flex items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 sm:px-5 sm:py-2.5",
            scrolled
              ? "glass border-border/70 shadow-[0_8px_32px_-12px_color-mix(in_oklch,var(--cr-blue)_25%,transparent)]"
              : "border-white/10 bg-white/5 backdrop-blur-md"
          )}
        >
          {/* Brand mark ----------------------------------------------------*/}
          <a
            href="#top"
            aria-label="Los Locales home"
            className="group flex items-center transition"
          >
            <LosLocalesLogo
              className={cn(
                "h-9 w-auto transition-all duration-500 sm:h-10",
                scrolled ? "text-foreground" : "text-white"
              )}
            />
          </a>

          {/* Desktop nav --------------------------------------------------*/}
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "nav-underline rounded-full px-4 py-2 text-sm font-medium transition",
                  scrolled
                    ? "text-foreground/75 hover:text-foreground"
                    : "text-white/85 hover:text-white"
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA --------------------------------------------------*/}
          <div className="hidden md:block">
            <Button
              asChild
              className="btn-shine h-10 rounded-full bg-[color:var(--gold)] px-5 text-sm font-semibold text-[color:var(--gold-foreground)] shadow-[0_8px_24px_-8px_color-mix(in_oklch,var(--gold)_60%,transparent)] transition hover:scale-[1.02] hover:bg-[color:var(--gold)]/95"
            >
              <a href="#reserve">Book Now</a>
            </Button>
          </div>

          {/* Mobile sheet -------------------------------------------------*/}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className={cn(
                  "rounded-full transition",
                  scrolled
                    ? "text-foreground hover:bg-foreground/5"
                    : "text-white hover:bg-white/15"
                )}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <MobileNav onClose={() => setOpen(false)} />
          </Sheet>
        </div>
      </div>
    </header>
  )
}

/* ---------------------------------------------------------------------------
 * MobileNav — premium, CR-themed mobile sidebar.
 * Hero header · iconified nav items · primary CTA · quick contact strip.
 * -------------------------------------------------------------------------*/
function MobileNav({ onClose }: { onClose: () => void }) {
  const tints: Record<NavLink["brand"], string> = {
    "cr-red":
      "bg-[color:var(--cr-red)]/12 text-[color:var(--cr-red)] ring-[color:var(--cr-red)]/25",
    jungle:
      "bg-[color:var(--jungle)]/14 text-[color:var(--jungle)] ring-[color:var(--jungle)]/25",
    gold:
      "bg-[color:var(--gold)]/22 text-[color:var(--gold-foreground)] ring-[color:var(--gold)]/35",
    "cr-blue":
      "bg-[color:var(--cr-blue)]/12 text-[color:var(--cr-blue)] ring-[color:var(--cr-blue)]/25",
    primary:
      "bg-primary/12 text-primary ring-primary/25",
  }

  const quickTints: Record<(typeof QUICK_CONTACT)[number]["brand"], string> = {
    "cr-red":
      "bg-[color:var(--cr-red)]/12 text-[color:var(--cr-red)] hover:bg-[color:var(--cr-red)]/20",
    jungle:
      "bg-[color:var(--jungle)]/14 text-[color:var(--jungle)] hover:bg-[color:var(--jungle)]/22",
    gold:
      "bg-[color:var(--gold)]/22 text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/32",
    "cr-blue":
      "bg-[color:var(--cr-blue)]/12 text-[color:var(--cr-blue)] hover:bg-[color:var(--cr-blue)]/20",
  }

  return (
    <SheetContent
      side="right"
      className="w-[88%] max-w-[min(420px,100vw)] overflow-hidden border-l-0 bg-background p-0 shadow-[-32px_0_60px_-20px_color-mix(in_oklch,var(--cr-blue)_30%,transparent)] sm:max-w-[420px] sm:w-[420px]"
    >
      {/* Hidden title for a11y (Radix requires a SheetTitle child) */}
      <VisuallyHidden.Root>
        <SheetTitle>Los Locales menu</SheetTitle>
      </VisuallyHidden.Root>

      <div className="relative flex h-full min-h-full w-full flex-col overflow-y-auto overflow-x-hidden overscroll-contain">
        {/* Atmospheric background ---------------------------------------- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 -z-10 size-64 -translate-x-1/3 rounded-full bg-[color:var(--cr-blue)]/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 -z-10 size-64 translate-x-1/3 translate-y-1/3 rounded-full bg-[color:var(--gold)]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="cr-stripe pointer-events-none absolute inset-x-0 top-0 -z-10 h-[3px] opacity-80"
        />

        {/* Hero header --------------------------------------------------- */}
        <div className="px-6 pb-6 pt-8 sm:px-7">
          <div className="eyebrow w-fit">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[color:var(--gold)]/70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[color:var(--gold)]" />
            </span>
            Nosara · Costa Rica
          </div>
          <a
            href="#top"
            onClick={onClose}
            className="mt-5 inline-flex items-center"
            aria-label="Los Locales home"
          >
            <LosLocalesLogo className="h-11 w-auto text-foreground" />
          </a>
          <p className="mt-3 text-pretty text-[13px] leading-relaxed text-muted-foreground">
            Discover Nosara with the most experienced local guides. Authentic
            tours, big smiles, real Pura Vida.
          </p>
        </div>

        {/* Section divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-border to-transparent sm:mx-7" />

        {/* Nav items ----------------------------------------------------- */}
        <nav className="flex flex-col gap-1.5 px-4 py-5 sm:px-5">
          <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Explore
          </div>
          {NAV_LINKS.map((l, idx) => (
            <a
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-transparent px-3 py-3 transition-all duration-300 hover:border-border/80 hover:bg-card/95 hover:shadow-[0_2px_0_0_color-mix(in_oklch,var(--foreground)_3%,transparent)]"
              style={{ transitionDelay: `${idx * 30}ms` }}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-[1.06]",
                  tints[l.brand]
                )}
              >
                <l.icon className="size-5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[15px] font-bold tracking-tight text-foreground">
                  {l.label}
                </span>
                <span className="block truncate text-[12px] leading-tight text-muted-foreground">
                  {l.desc}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </a>
          ))}
        </nav>

        {/* Primary CTA --------------------------------------------------- */}
        <div className="px-6 sm:px-7">
          <Button
            asChild
            onClick={onClose}
            className="btn-shine h-12 w-full rounded-full bg-[color:var(--gold)] text-[15px] font-semibold text-[color:var(--gold-foreground)] shadow-[0_18px_40px_-12px_color-mix(in_oklch,var(--gold)_70%,transparent)] transition hover:scale-[1.01] hover:bg-[color:var(--gold)]/95"
          >
            <a href="#reserve" className="flex items-center justify-center gap-1.5">
              <CalendarDays className="size-4" />
              Book Your Adventure
            </a>
          </Button>
        </div>

        {/* Quick contact strip ------------------------------------------- */}
        <div className="px-6 pt-7 sm:px-7">
          <div className="px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Quick contact
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {QUICK_CONTACT.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                aria-label={c.label}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-2xl border border-border/60 transition-all duration-300 hover:scale-[1.04] hover:border-transparent",
                  quickTints[c.brand]
                )}
              >
                <c.icon className="size-5" strokeWidth={2.2} />
              </a>
            ))}
          </div>
        </div>

        {/* Footer accent ------------------------------------------------- */}
        <div className="mt-auto px-6 pb-7 pt-9 sm:px-7">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-3 py-2 backdrop-blur-sm">
            <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--cr-blue)]" />
            <span className="size-1.5 shrink-0 rounded-full bg-white ring-1 ring-border" />
            <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--cr-red)]" />
            <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--jungle)]" />
            <span className="ml-auto truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Pura Vida · Made in CR
            </span>
          </div>
        </div>
      </div>
    </SheetContent>
  )
}
