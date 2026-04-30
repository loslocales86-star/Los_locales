import { MessageCircle } from "lucide-react"

export function WhatsappFab() {
  return (
    <a
      href="https://wa.me/50686068903"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[color:var(--jungle)] px-4 py-3 text-sm font-semibold text-[color:var(--jungle-foreground)] shadow-[0_18px_40px_-12px_color-mix(in_oklch,var(--jungle)_70%,transparent)] ring-1 ring-white/20 backdrop-blur transition-all duration-300 hover:scale-[1.04] hover:bg-[color:var(--jungle)]/95 sm:bottom-7 sm:right-7"
    >
      {/* Pulsing dot */}
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
        <span className="relative inline-flex size-2.5 rounded-full bg-white" />
      </span>
      <MessageCircle className="size-4 transition-transform group-hover:rotate-[-6deg]" />
      <span className="hidden sm:inline">Chat with a local</span>
    </a>
  )
}
