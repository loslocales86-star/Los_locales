import { useState } from "react"
import {
  CircleCheck as CheckCircle2,
  Clock,
  Loader as Loader2,
  Send,
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
  FieldDescription,
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
import { TOURS } from "./tours"
import { supabase } from "@/lib/supabase"
import { generateDeleteToken, rememberMyStory } from "@/lib/my-stories"

type DurationKey = "always" | "30d" | "7d" | "1d"

const DURATION_OPTIONS: { value: DurationKey; label: string; ms: number | null }[] =
  [
    { value: "always", label: "Always (forever)", ms: null },
    { value: "30d", label: "30 days", ms: 30 * 24 * 60 * 60 * 1000 },
    { value: "7d", label: "7 days", ms: 7 * 24 * 60 * 60 * 1000 },
    { value: "1d", label: "24 hours", ms: 24 * 60 * 60 * 1000 },
  ]

const computeExpiresAt = (key: DurationKey): string | null => {
  const opt = DURATION_OPTIONS.find((o) => o.value === key)
  if (!opt || opt.ms === null) return null
  return new Date(Date.now() + opt.ms).toISOString()
}

type StoryForm = {
  author_name: string
  country: string
  tour_name: string
  rating: number
  story: string
  duration: DurationKey
}

const INITIAL: StoryForm = {
  author_name: "",
  country: "",
  tour_name: "",
  rating: 5,
  story: "",
  duration: "always",
}

type ShareStoryProps = {
  trigger: React.ReactNode
}

export function ShareStory({ trigger }: ShareStoryProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<StoryForm>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof StoryForm, string>>>(
    {}
  )
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [errorMsg, setErrorMsg] = useState("")

  const set = <K extends keyof StoryForm>(key: K, value: StoryForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const resetAll = () => {
    setForm(INITIAL)
    setErrors({})
    setStatus("idle")
    setErrorMsg("")
  }

  const validate = () => {
    const next: Partial<Record<keyof StoryForm, string>> = {}
    if (!form.author_name.trim()) next.author_name = "Please enter your name"
    if (!form.country.trim()) next.country = "Please enter your country"
    if (!form.tour_name) next.tour_name = "Please select a tour"
    if (form.rating < 1 || form.rating > 5) next.rating = "Rating must be 1 to 5"
    if (form.story.trim().length < 20)
      next.story = "Your story must be at least 20 characters"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus("loading")
    setErrorMsg("")

    const expires_at = computeExpiresAt(form.duration)
    const delete_token = generateDeleteToken()

    const fullPayload = {
      author_name: form.author_name.trim(),
      country: form.country.trim(),
      tour_name: form.tour_name,
      rating: Number(form.rating),
      story: form.story.trim(),
      expires_at,
      delete_token,
    }

    let { data, error } = await supabase
      .from("stories")
      .insert(fullPayload)
      .select("id")
      .single()

    if (
      error &&
      /column .* does not exist|expires_at|delete_token/i.test(error.message)
    ) {
      const fallback = {
        author_name: fullPayload.author_name,
        country: fullPayload.country,
        tour_name: fullPayload.tour_name,
        rating: fullPayload.rating,
        story: fullPayload.story,
      }
      ;({ data, error } = await supabase
        .from("stories")
        .insert(fallback)
        .select("id")
        .single())
    }

    if (error) {
      setStatus("error")
      setErrorMsg(error.message)
      return
    }

    const id = String(data?.id ?? `local-${Date.now()}`)
    rememberMyStory(id, delete_token)

    const initials =
      fullPayload.author_name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("") || "LL"

    const review = {
      id,
      name: fullPayload.author_name,
      country: fullPayload.country,
      initials,
      text: fullPayload.story,
      rating: fullPayload.rating,
      tour: fullPayload.tour_name || undefined,
      verified: true,
      expires_at,
      mine: true,
    }

    setStatus("success")
    window.dispatchEvent(
      new CustomEvent("story-submitted", { detail: { review } })
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetAll()
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Share your story</DialogTitle>
          <DialogDescription>
            Tell other travelers how your Los Locales experience felt.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[color:var(--jungle)]/15 text-[color:var(--jungle)]">
              <CheckCircle2 className="size-7" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Thanks for sharing!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your review was published and now helps future travelers choose
              their adventure.
            </p>
            <p className="mt-2 max-w-sm text-xs text-muted-foreground">
              Tip: this browser remembers your story so you can delete it any
              time from the reviews carousel.
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
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!errors.author_name}>
                  <FieldLabel htmlFor="author_name">Your name</FieldLabel>
                  <Input
                    id="author_name"
                    value={form.author_name}
                    onChange={(e) => set("author_name", e.target.value)}
                    aria-invalid={!!errors.author_name}
                    placeholder="Jane Doe"
                  />
                  {errors.author_name && (
                    <FieldError errors={[{ message: errors.author_name }]} />
                  )}
                </Field>

                <Field data-invalid={!!errors.country}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    aria-invalid={!!errors.country}
                    placeholder="Canada"
                  />
                  {errors.country && (
                    <FieldError errors={[{ message: errors.country }]} />
                  )}
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!errors.tour_name}>
                  <FieldLabel htmlFor="tour_name">Tour</FieldLabel>
                  <Select
                    value={form.tour_name}
                    onValueChange={(value) => set("tour_name", value)}
                  >
                    <SelectTrigger id="tour_name" aria-invalid={!!errors.tour_name}>
                      <SelectValue placeholder="Choose your tour" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOURS.map((tour) => (
                        <SelectItem key={tour.slug} value={tour.title}>
                          {tour.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tour_name && (
                    <FieldError errors={[{ message: errors.tour_name }]} />
                  )}
                </Field>

                <Field data-invalid={!!errors.rating}>
                  <FieldLabel htmlFor="rating">Rating</FieldLabel>
                  <Select
                    value={String(form.rating)}
                    onValueChange={(value) => set("rating", Number(value))}
                  >
                    <SelectTrigger id="rating" aria-invalid={!!errors.rating}>
                      <SelectValue placeholder="Rate 1-5" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((score) => (
                        <SelectItem key={score} value={String(score)}>
                          {score} star{score > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.rating && (
                    <FieldError errors={[{ message: errors.rating }]} />
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="duration">
                  <Clock className="size-3.5" />
                  Show your story for
                </FieldLabel>
                <Select
                  value={form.duration}
                  onValueChange={(value) =>
                    set("duration", value as DurationKey)
                  }
                >
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  After this period your review will be hidden automatically.
                  You can also delete it any time from the reviews carousel.
                </FieldDescription>
              </Field>

              <Field data-invalid={!!errors.story}>
                <FieldLabel htmlFor="story">Your story</FieldLabel>
                <Textarea
                  id="story"
                  rows={5}
                  value={form.story}
                  onChange={(e) => set("story", e.target.value)}
                  aria-invalid={!!errors.story}
                  placeholder="What did you love most about your experience?"
                />
                {errors.story && <FieldError errors={[{ message: errors.story }]} />}
              </Field>

              {status === "error" && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Could not submit your story: {errorMsg || "please try again"}.
                </div>
              )}

              <Button
                type="submit"
                disabled={status === "loading"}
                className="btn-shine h-12 rounded-full bg-[color:var(--gold)] px-6 text-[15px] font-semibold text-[color:var(--gold-foreground)] shadow-[0_14px_30px_-12px_color-mix(in_oklch,var(--gold)_60%,transparent)] transition hover:scale-[1.01] hover:bg-[color:var(--gold)]/95"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Publish review
                  </>
                )}
              </Button>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
