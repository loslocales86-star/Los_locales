import { useEffect, useState } from "react"
import { About } from "@/components/site/about"
import { Contact } from "@/components/site/contact"
import { Footer } from "@/components/site/footer"
import { Hero } from "@/components/site/hero"
import { Navbar } from "@/components/site/navbar"
import { Reservation } from "@/components/site/reservation"
import { Testimonials } from "@/components/site/testimonials"
import { Tours } from "@/components/site/tours"
import { findTourBySlug, TourPage } from "@/components/site/tour-page"
import { WhatsappFab } from "@/components/site/whatsapp-fab"
import { useReveal } from "@/hooks/use-reveal"

/* ---------------------------------------------------------------------------
 * Tiny dependency-free hash router
 *
 * Recognised routes:
 *   #/tour/<slug>   →  Standalone TourPage, opened in a new tab from cards.
 *   <anything else> →  Home page.
 *
 * Hash routing keeps the deploy story trivial (any static host works) while
 * still allowing `target="_blank"` to open a real new tab on the tour URL.
 * -------------------------------------------------------------------------*/
type Route =
  | { kind: "home" }
  | { kind: "tour"; slug: string }

function parseRoute(hash: string): Route {
  const m = hash.match(/^#\/tour\/([A-Za-z0-9_-]+)\/?$/)
  if (m) return { kind: "tour", slug: m[1] }
  return { kind: "home" }
}

function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? { kind: "home" } : parseRoute(window.location.hash)
  )

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return route
}

export function App() {
  const route = useHashRoute()
  useReveal()

  /* When a tour page mounts, scroll to top so users always land at the hero
   * instead of where the homepage was last scrolled to. */
  useEffect(() => {
    if (route.kind === "tour") {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
  }, [route.kind, route.kind === "tour" ? route.slug : null])

  /* When we re-render the home page with a regular anchor in the URL
   * (e.g. `#tours`, `#top`), the browser already tried — and failed — to
   * scroll to that element while we were still on the tour page. We replay
   * the scroll once the home DOM is in place. */
  useEffect(() => {
    if (route.kind !== "home") return
    const hash = window.location.hash
    if (!hash || hash.length <= 1 || hash.startsWith("#/")) return
    const id = hash.slice(1)
    requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" })
    })
  }, [route])

  if (route.kind === "tour") {
    const tour = findTourBySlug(route.slug)
    if (tour) {
      return (
        <div className="min-h-svh bg-background text-foreground">
          <TourPage tour={tour} />
          <WhatsappFab />
        </div>
      )
    }
    /* Unknown slug — fall back to home rather than showing an error page. */
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Tours />
        <Testimonials />
        <Reservation />
        <Contact />
      </main>
      <Footer />
      <WhatsappFab />
    </div>
  )
}

export default App
