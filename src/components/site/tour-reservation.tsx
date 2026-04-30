import { useEffect, useState } from "react"
import {
  CalendarDays,
  CircleCheck as CheckCircle2,
  Clock,
  Loader as Loader2,
  Send,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SHOW_PRICES } from "@/lib/site-config"
import { supabase } from "@/lib/supabase"
import type { Tour } from "./tours"

type TourReservationForm = {
  full_name: string
  email: string
  whatsapp: string
  preferred_date: string
  number_of_people: number
  message: string
}

const INITIAL: TourReservationForm = {
  full_name: "",
  email: "",
  whatsapp: "",
  preferred_date: "",
  number_of_people: 2,
  message: "",
}

type TourReservationProps = {
  tour: Tour
  trigger: React.ReactNode
}

export function TourReservation({ tour, trigger }: TourReservationProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TourReservationForm>(INITIAL)
  const [errors, setErrors] = useState<
    Partial<Record<keyof TourReservationForm, string>>
  >({})
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => {
        setForm(INITIAL)
        setErrors({})
        setStatus("idle")
        setErrorMsg("")
      }, 200)
      return () => window.clearTimeout(t)
    }
  }, [open])

  const set = <K extends keyof TourReservationForm>(
    key: K,
    value: TourReservationForm[K]
  ) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<keyof TourReservationForm, string>> = {}
    if (!form.full_name.trim()) next.full_name = "Please enter your full name"
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Please enter a valid email"
    if (!form.whatsapp.trim()) next.whatsapp = "WhatsApp number required"
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
      tour_selected: tour.title,
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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto p-0 sm:max-w-2xl">
        <div className="relative h-44 w-full overflow-hidden sm:h-52">
          <img
            src={tour.image}
            alt={tour.title}
            className="size-full scale-[1.04] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/90 via-[#0B1B3A]/40 to-transparent" />
          <div className="cr-stripe absolute inset-x-0 top-0 h-[2px] opacity-80" />
          <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white">
            <Badge className="rounded-full border-0 bg-[color:var(--gold)] px-3 py-1 text-[color:var(--gold-foreground)] shadow-lg shadow-black/20">
              {SHOW_PRICES ? tour.price : "Inquire for pricing"}
            </Badge>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-md">
              <Clock className="size-3" />
              {tour.duration}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 backdrop-blur-md">
              <Users className="size-3" />
              {tour.group}
            </span>
          </div>
        </div>

        <div className="px-6 pb-7 sm:px-8 sm:pb-8">
          <DialogHeader className="pt-3">
            <div className="eyebrow w-fit">
              <CalendarDays className="size-3" />
              Reserve · {tour.title}
            </div>
            <DialogTitle className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Book your {tour.title}
            </DialogTitle>
            <DialogDescription className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {tour.description} A local guide will reply on WhatsApp within a
              few hours to confirm every detail.
            </DialogDescription>
          </DialogHeader>

          {status === "success" ? (
            <div className="mt-6 flex min-h-64 flex-col items-center justify-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-[color:var(--jungle)]/15 text-[color:var(--jungle)]">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Reservation received</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Pura Vida! We saved your request for{" "}
                <span className="font-semibold text-foreground">
                  {tour.title}
                </span>
                . A local guide will message you on WhatsApp shortly.
              </p>
              <Button
                type="button"
                className="mt-5 rounded-full"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6">
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.full_name}>
                    <FieldLabel htmlFor={`tr-${tour.slug}-full_name`}>
                      Full name
                    </FieldLabel>
                    <Input
                      id={`tr-${tour.slug}-full_name`}
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
                    <FieldLabel htmlFor={`tr-${tour.slug}-email`}>
                      Email
                    </FieldLabel>
                    <Input
                      id={`tr-${tour.slug}-email`}
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.whatsapp}>
                    <FieldLabel htmlFor={`tr-${tour.slug}-whatsapp`}>
                      WhatsApp number
                    </FieldLabel>
                    <Input
                      id={`tr-${tour.slug}-whatsapp`}
                      placeholder="+1 555 123 4567"
                      value={form.whatsapp}
                      aria-invalid={!!errors.whatsapp}
                      onChange={(e) => set("whatsapp", e.target.value)}
                    />
                    {errors.whatsapp && (
                      <FieldError errors={[{ message: errors.whatsapp }]} />
                    )}
                  </Field>

                  <Field data-invalid={!!errors.preferred_date}>
                    <FieldLabel htmlFor={`tr-${tour.slug}-preferred_date`}>
                      Preferred date
                    </FieldLabel>
                    <Input
                      id={`tr-${tour.slug}-preferred_date`}
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
                </div>

                <Field data-invalid={!!errors.number_of_people}>
                  <FieldLabel htmlFor={`tr-${tour.slug}-number_of_people`}>
                    Number of people
                  </FieldLabel>
                  <Input
                    id={`tr-${tour.slug}-number_of_people`}
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

                <Field>
                  <FieldLabel htmlFor={`tr-${tour.slug}-message`}>
                    Message (optional)
                  </FieldLabel>
                  <Textarea
                    id={`tr-${tour.slug}-message`}
                    placeholder={`Anything we should know about your ${tour.title.toLowerCase()}? Hotel, celebration, level...`}
                    rows={3}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </Field>

                {status === "error" && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Could not send your reservation:{" "}
                    {errorMsg || "please try again"}.
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
                      Reserve {tour.title}
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting you agree to be contacted by Los Locales via
                  email or WhatsApp about your booking.
                </p>
              </FieldGroup>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
