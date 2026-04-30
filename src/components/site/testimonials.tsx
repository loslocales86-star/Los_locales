import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock,
  MoreHorizontal,
  PenLine,
  Quote,
  Star,
  Trash2,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShareStory } from "./share-story"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import {
  forgetMyStory,
  getMyStories,
  getStoryToken,
} from "@/lib/my-stories"

type Review = {
  id: string
  name: string
  country: string
  initials: string
  text: string
  rating: number
  tour?: string
  verified?: boolean
  expires_at?: string | null
  mine?: boolean
}

const SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    name: "Sophie Laurent",
    country: "Paris, France",
    initials: "SL",
    rating: 5,
    text: "Absolutely magical! Our guide Marco treated us like family. The sunset tour alone was worth the trip to Costa Rica.",
  },
  {
    id: "seed-2",
    name: "James O'Connor",
    country: "Dublin, Ireland",
    initials: "JO",
    rating: 5,
    text: "Stood up on my first wave in under 20 minutes. These guys genuinely love what they do — the best surf lesson I've had.",
  },
  {
    id: "seed-3",
    name: "Ana & Diego",
    country: "Madrid, Spain",
    initials: "AD",
    rating: 5,
    text: "The ATV jungle ride was an adrenaline dream. Safe, wild and so much laughter. Already planning our return.",
  },
  {
    id: "seed-4",
    name: "Mia Tanaka",
    country: "Tokyo, Japan",
    initials: "MT",
    rating: 5,
    text: "We saw monkeys, toucans and a waterfall almost to ourselves. Real local knowledge you won't find on any website.",
  },
]

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "LL"

const dedupe = (list: Review[]): Review[] => {
  const seen = new Set<string>()
  const out: Review[] = []
  for (const r of list) {
    if (seen.has(r.id)) continue
    seen.add(r.id)
    out.push(r)
  }
  return out
}

const isExpired = (r: Review): boolean => {
  if (!r.expires_at) return false
  const exp = new Date(r.expires_at).getTime()
  return Number.isFinite(exp) && exp < Date.now()
}

const formatRelativeExpiry = (iso: string | null | undefined): string | null => {
  if (!iso) return null
  const ms = new Date(iso).getTime() - Date.now()
  if (!Number.isFinite(ms) || ms <= 0) return null
  const days = Math.floor(ms / 86400000)
  if (days >= 1) return `${days}d left`
  const hours = Math.floor(ms / 3600000)
  if (hours >= 1) return `${hours}h left`
  const mins = Math.max(1, Math.floor(ms / 60000))
  return `${mins}m left`
}

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS)
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [snapCount, setSnapCount] = useState(0)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [paused, setPaused] = useState(false)

  const myStoriesRef = useRef<Record<string, string>>({})

  const visible = useMemo(
    () => reviews.filter((r) => !isExpired(r)),
    [reviews]
  )

  const load = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(48)

    if (error || !data) return

    const my = getMyStories()
    myStoriesRef.current = my

    const fromDb: Review[] = data.map((r) => {
      const id = String(r.id)
      return {
        id,
        name: (r.author_name as string) || "Traveler",
        country: (r.country as string) || "",
        initials: initialsOf((r.author_name as string) || "Traveler"),
        text: (r.story as string) || "",
        rating: Number(r.rating) || 5,
        tour: (r.tour_name as string) || undefined,
        verified: true,
        expires_at: (r.expires_at as string | null | undefined) ?? null,
        mine: id in my,
      }
    })

    const merged = dedupe([...fromDb, ...SEED_REVIEWS]).filter(
      (r) => !isExpired(r)
    )
    setReviews(merged)
  }

  useEffect(() => {
    load()

    const onNew = (e: Event) => {
      const detail = (e as CustomEvent<{ review?: Review }>).detail
      if (detail?.review) {
        setReviews((prev) => dedupe([detail.review!, ...prev]))
      }
      load()
    }

    window.addEventListener("story-submitted", onNew as EventListener)
    return () =>
      window.removeEventListener("story-submitted", onNew as EventListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!api) return

    const sync = () => {
      setSnapCount(api.scrollSnapList().length)
      setSelectedIdx(api.selectedScrollSnap())
    }
    sync()

    api.on("select", sync)
    api.on("reInit", sync)

    return () => {
      api.off("select", sync)
      api.off("reInit", sync)
    }
  }, [api])

  useEffect(() => {
    if (!api || paused || visible.length <= 1) return
    const id = window.setInterval(() => {
      api.scrollNext()
    }, 6000)
    return () => window.clearInterval(id)
  }, [api, paused, visible.length])

  const removeStory = async (review: Review) => {
    const token = getStoryToken(review.id)
    if (!token) return

    const prev = reviews
    setReviews((rs) => rs.filter((r) => r.id !== review.id))

    const { data, error } = await supabase.rpc("delete_story_with_token", {
      p_id: review.id,
      p_token: token,
    })

    if (error || data === false) {
      setReviews(prev)
      return
    }

    forgetMyStory(review.id)
    load()
  }

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-gradient-to-b from-background via-[color:var(--sand)]/35 to-background py-24 sm:py-32 lg:py-36"
    >
      {/* Layered tropical wash --------------------------------------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--gold)_14%,transparent)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-32 -z-10 size-[28rem] rounded-full bg-[color:var(--gold)]/15 blur-3xl float-slow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-32 -z-10 size-[26rem] rounded-full bg-[color:var(--cr-blue)]/12 blur-3xl float-slower"
      />
      {/* Subtle CR flag accent bar at the top of the section */}
      <div
        aria-hidden
        className="cr-stripe pointer-events-none absolute inset-x-0 top-0 -z-10 h-[2px] opacity-50"
      />

      <div className="mx-auto w-[min(1280px,94%)]">
        <div className="reveal mx-auto max-w-2xl text-center">
          <div className="eyebrow mx-auto">
            <span className="size-1.5 rounded-full bg-[color:var(--gold)]" />
            Loved by travelers
          </div>
          <h2 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Top Rated{" "}
            <span className="text-cr-gradient">Local Experience</span>
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Real stories from travelers who explored Nosara with Los Locales.
          </p>
          <div className="mt-7 flex justify-center">
            <ShareStory
              trigger={
                <Button className="btn-shine h-12 rounded-full bg-[color:var(--gold)] px-6 text-[15px] font-semibold text-[color:var(--gold-foreground)] shadow-[0_14px_30px_-12px_color-mix(in_oklch,var(--gold)_60%,transparent)] transition hover:scale-[1.02] hover:bg-[color:var(--gold)]/95">
                  <PenLine className="mr-2 size-4" />
                  Share your story
                </Button>
              }
            />
          </div>
        </div>

        <div
          className="reveal relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-background to-transparent sm:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-background to-transparent sm:block"
          />

          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: visible.length > 3 }}
            className="px-1 sm:px-2"
          >
            <CarouselContent className="-ml-4">
              {visible.map((r) => (
                <CarouselItem
                  key={r.id}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <ReviewCard review={r} onDelete={removeStory} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-full border-border/80 bg-card/80 backdrop-blur transition hover:scale-105 hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/10"
              onClick={() => api?.scrollPrev()}
              disabled={!api}
              aria-label="Previous reviews"
            >
              <ArrowLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: snapCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === selectedIdx}
                  onClick={() => api?.scrollTo(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    i === selectedIdx
                      ? "w-8 bg-gradient-to-r from-[color:var(--gold)] to-[color:var(--cr-red)]"
                      : "w-2 bg-muted-foreground/25 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-full border-border/80 bg-card/80 backdrop-blur transition hover:scale-105 hover:border-[color:var(--gold)]/60 hover:bg-[color:var(--gold)]/10"
              onClick={() => api?.scrollNext()}
              disabled={!api}
              aria-label="Next reviews"
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}

function ReviewCard({
  review: r,
  onDelete,
}: {
  review: Review
  onDelete: (r: Review) => void
}) {
  const expiry = formatRelativeExpiry(r.expires_at)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <figure className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-7 shadow-[0_2px_0_0_color-mix(in_oklch,var(--foreground)_3%,transparent)] backdrop-blur-sm">
      <Quote
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-3 size-24 text-[color:var(--gold)]/12"
      />
      {/* Top hairline accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--gold)]/0 to-transparent transition-all duration-500 group-hover:via-[color:var(--gold)]/70"
      />

      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i <= r.rating
                  ? "fill-[color:var(--gold)] text-[color:var(--gold)]"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {expiry && (
            <Badge
              variant="secondary"
              className="gap-1 rounded-full border border-muted-foreground/20 bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              <Clock className="size-3" />
              {expiry}
            </Badge>
          )}
          {r.verified && !r.mine && (
            <Badge
              variant="secondary"
              className="gap-1 rounded-full border border-[color:var(--jungle)]/30 bg-[color:var(--jungle)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--jungle)]"
            >
              <BadgeCheck className="size-3" />
              Verified
            </Badge>
          )}
          {r.mine && (
            <Badge
              variant="secondary"
              className="rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--gold-foreground)]"
            >
              You
            </Badge>
          )}
        </div>
      </header>

      <blockquote className="relative mt-5 flex-1 text-[15px] leading-relaxed text-foreground/90">
        <span className="block whitespace-pre-line break-words text-pretty">
          &ldquo;{r.text}&rdquo;
        </span>
      </blockquote>

      {r.tour && (
        <div className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-[color:var(--jungle)]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--jungle)]">
          {r.tour}
        </div>
      )}

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
        <Avatar className="size-11 shrink-0 border border-border ring-2 ring-background">
          <AvatarFallback className="bg-gradient-to-br from-[color:var(--cr-blue)] to-[color:var(--jungle)] text-xs font-bold tracking-wide text-white">
            {r.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[15px] font-bold tracking-tight">
            {r.name}
          </div>
          {r.country && (
            <div className="truncate text-xs font-medium text-muted-foreground">
              {r.country}
            </div>
          )}
        </div>

        {r.mine && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Story options"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => {
                    e.preventDefault()
                    setConfirmOpen(true)
                  }}
                >
                  <Trash2 />
                  Delete my story
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this story?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove your review from the public
                    carousel. You cannot undo this action.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep it</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDelete(r)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </figcaption>
    </figure>
  )
}
