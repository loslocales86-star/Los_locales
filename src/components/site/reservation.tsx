import { useEffect, useRef, useState } from "react"
import { CalendarDays, CircleCheck as CheckCircle2, Loader as Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { TOURS } from "./tours"

type Form = {
  full_name: string
  email: string
  whatsapp: string
  tour_selected: string
  preferred_date: string
  number_of_people: number
  message: string
}

const INITIAL: Form = {
  full_name: "",
  email: "",
  whatsapp: "",
  tour_selected: "",
  preferred_date: "",
  number_of_people: 2,
  message: "",
}

export function Reservation() {
  const [form, setForm] = useState<Form>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [errorMsg, setErrorMsg] = useState("")
  const formRef = useRef<HTMLFormElement | null>(null)
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    const onReserve = (e: Event) => {
      const detail = (e as CustomEvent<{ title: string }>).detail
      if (!detail?.title) return
      setForm((f) => ({ ...f, tour_selected: detail.title }))
      setErrors((prev) => ({ ...prev, tour_selected: undefined }))
      setStatus("idle")
      setHighlight(true)
      window.setTimeout(() => setHighlight(false), 1600)
      window.setTimeout(() => {
        formRef.current
          ?.querySelector<HTMLInputElement>("#full_name")
          ?.focus({ preventScroll: true })
      }, 600)
    }
    window.addEventListener("reserve-tour", onReserve as EventListener)
    return () =>
      window.removeEventListener("reserve-tour", onReserve as EventListener)
  }, [])

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<keyof Form, string>> = {}
    if (!form.full_name.trim()) next.full_name = "Please enter your full name"
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Please enter a valid email"
    if (!form.whatsapp.trim()) next.whatsapp = "WhatsApp number required"
    if (!form.tour_selected) next.tour_selected = "Choose a tour"
    if (!form.preferred_date) next.preferred_date = "Pick a preferred date"
    if (!form.number_of_people || form.number_of_people < 1)
      next.number_of_people = "At least 1 person"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus("loading")
    setErrorMsg("")
    const { error } = await supabase.from("reservations").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      tour_selected: form.tour_selected,
      preferred_date: form.preferred_date,
      number_of_people: Number(form.number_of_people),
      message: form.message.trim(),
    })
    if (error) {
      setStatus("error")
      setErrorMsg(error.message)
      return
    }
    setStatus("success")
    setForm(INITIAL)
  }

  return (
    <section
      id="reserve"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-36"
    >
      {/* Layered ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[color:var(--sand)]/55 via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 -z-10 size-[28rem] rounded-full bg-[color:var(--jungle)]/20 blur-3xl float-slower"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 -z-10 size-[28rem] rounded-full bg-[color:var(--gold)]/25 blur-3xl float-slow"
      />

      <div className="mx-auto w-[min(1180px,94%)]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
          {/* Left: pitch + reassurance ----------------------------------- */}
          <div className="reveal lg:sticky lg:top-28">
            <div className="eyebrow">
              <CalendarDays className="size-3" />
              Reserve Your Tour
            </div>
            <h2 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Let's plan your{" "}
              <span className="text-cr-gradient">Nosara adventure</span>.
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Tell us a little about your dates and who's coming. A local guide
              will personally reply on WhatsApp within a few hours to confirm
              your booking.
            </p>

            <ul className="mt-9 space-y-3.5 text-[15px]">
              {[
                "Instant personal confirmation on WhatsApp",
                "Free cancellation up to 24 hours before the tour",
                "Hotel pickup available anywhere in Nosara",
                "Small groups. Big stories.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--jungle)]/15 text-[color:var(--jungle)]">
                    <CheckCircle2 className="size-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>

            {/* Costa Rica flag accent */}
            <div className="mt-10 flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[color:var(--cr-blue)]" />
              <span className="size-1.5 rounded-full bg-white ring-1 ring-border" />
              <span className="size-1.5 rounded-full bg-[color:var(--cr-red)]" />
              <span className="size-1.5 rounded-full bg-[color:var(--jungle)]" />
              <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Pura Vida Booking
              </span>
            </div>
          </div>

          {/* Right: form ------------------------------------------------- */}
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className={`reveal reveal-delay-1 glass relative overflow-hidden rounded-[2rem] border p-6 shadow-[0_40px_80px_-30px_color-mix(in_oklch,var(--cr-blue)_30%,transparent)] transition-all duration-500 sm:p-10 ${highlight ? "border-[color:var(--gold)] ring-4 ring-[color:var(--gold)]/30" : "border-border/70"}`}
          >
            {/* Decorative top corner accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-gradient-to-br from-[color:var(--gold)]/0 to-[color:var(--gold)]/30 blur-2xl"
            />

            {status === "success" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[color:var(--jungle)]/15 text-[color:var(--jungle)] ring-4 ring-[color:var(--jungle)]/10">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="mt-7 font-display text-3xl font-bold tracking-tight">
                  Reservation received
                </h3>
                <p className="mt-3 max-w-sm text-pretty text-muted-foreground">
                  Pura Vida! A local guide will reach out on WhatsApp shortly to
                  confirm every detail of your adventure.
                </p>
                <Button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-7 h-11 rounded-full px-6 font-semibold"
                >
                  Book another tour
                </Button>
              </div>
            ) : (
              <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={!!errors.full_name}>
                    <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                    <Input
                      id="full_name"
                      placeholder="Jane Doe"
                      value={form.full_name}
                      aria-invalid={!!errors.full_name}
                      onChange={(e) => set("full_name", e.target.value)}
                    />
                    {errors.full_name && (
                      <FieldError errors={[{ message: errors.full_name }]} />
                    )}
                  </Field>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      aria-invalid={!!errors.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    {errors.email && (
                      <FieldError errors={[{ message: errors.email }]} />
                    )}
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={!!errors.whatsapp}>
                    <FieldLabel htmlFor="whatsapp">WhatsApp number</FieldLabel>
                    <Input
                      id="whatsapp"
                      placeholder="+1 555 123 4567"
                      value={form.whatsapp}
                      aria-invalid={!!errors.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value)}
                    />
                    {errors.whatsapp && (
                      <FieldError errors={[{ message: errors.whatsapp }]} />
                    )}
                  </Field>
                  <Field data-invalid={!!errors.tour_selected}>
                    <FieldLabel htmlFor="tour_selected">
                      Tour selected
                    </FieldLabel>
                    <Select
                      value={form.tour_selected}
                      onValueChange={(v) => set("tour_selected", v)}
                    >
                      <SelectTrigger
                        id="tour_selected"
                        aria-invalid={!!errors.tour_selected}
                      >
                        <SelectValue placeholder="Choose a tour" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOURS.map((t) => (
                          <SelectItem key={t.slug} value={t.title}>
                            {t.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tour_selected && (
                      <FieldError
                        errors={[{ message: errors.tour_selected }]}
                      />
                    )}
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field data-invalid={!!errors.preferred_date}>
                    <FieldLabel htmlFor="preferred_date">
                      Preferred date
                    </FieldLabel>
                    <Input
                      id="preferred_date"
                      type="date"
                      value={form.preferred_date}
                      aria-invalid={!!errors.preferred_date}
                      onChange={(e) => set("preferred_date", e.target.value)}
                    />
                    {errors.preferred_date && (
                      <FieldError
                        errors={[{ message: errors.preferred_date }]}
                      />
                    )}
                  </Field>
                  <Field data-invalid={!!errors.number_of_people}>
                    <FieldLabel htmlFor="number_of_people">
                      Number of people
                    </FieldLabel>
                    <Input
                      id="number_of_people"
                      type="number"
                      min={1}
                      max={20}
                      value={form.number_of_people}
                      aria-invalid={!!errors.number_of_people}
                      onChange={(e) =>
                        set("number_of_people", Number(e.target.value))
                      }
                    />
                    {errors.number_of_people && (
                      <FieldError
                        errors={[{ message: errors.number_of_people }]}
                      />
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="message">Message (optional)</FieldLabel>
                  <Textarea
                    id="message"
                    placeholder="Anything we should know? Special requests, hotel name, celebration…"
                    rows={4}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </Field>

                {status === "error" && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    Something went wrong: {errorMsg || "please try again"}.
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={status === "loading"}
                  className="btn-shine h-[52px] w-full rounded-full bg-[color:var(--gold)] text-[15px] font-semibold text-[color:var(--gold-foreground)] shadow-[0_18px_40px_-12px_color-mix(in_oklch,var(--gold)_70%,transparent)] transition hover:scale-[1.01] hover:bg-[color:var(--gold)]/95"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Sending reservation…
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      Send Reservation
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting you agree to be contacted by Los Locales via
                  email or WhatsApp about your booking.
                </p>
              </FieldGroup>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
