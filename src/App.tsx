import { About } from "@/components/site/about"
import { Contact } from "@/components/site/contact"
import { Footer } from "@/components/site/footer"
import { Hero } from "@/components/site/hero"
import { Navbar } from "@/components/site/navbar"
import { Reservation } from "@/components/site/reservation"
import { Testimonials } from "@/components/site/testimonials"
import { Tours } from "@/components/site/tours"
import { WhatsappFab } from "@/components/site/whatsapp-fab"
import { useReveal } from "@/hooks/use-reveal"

export function App() {
  useReveal()
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
