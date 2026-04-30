const STORAGE_KEY = "los-locales:my-stories"

type MyStoryMap = Record<string, string>

const safeParse = (raw: string | null): MyStoryMap => {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as MyStoryMap
    }
    return {}
  } catch {
    return {}
  }
}

export function getMyStories(): MyStoryMap {
  if (typeof window === "undefined") return {}
  return safeParse(window.localStorage.getItem(STORAGE_KEY))
}

export function getStoryToken(id: string): string | null {
  const all = getMyStories()
  return all[id] ?? null
}

export function rememberMyStory(id: string, token: string): void {
  if (typeof window === "undefined") return
  const all = getMyStories()
  all[id] = token
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function forgetMyStory(id: string): void {
  if (typeof window === "undefined") return
  const all = getMyStories()
  if (!(id in all)) return
  delete all[id]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function generateDeleteToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`
}
