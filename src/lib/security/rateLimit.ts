// src/lib/security/rateLimit.ts

type Entry = {
  count: number
  expiresAt: number
}

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

const store = new Map<string, Entry>()

export function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || existing.expiresAt < now) {
    store.set(key, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    })
    return true
  }

  if (existing.count >= MAX_REQUESTS) {
    return false
  }

  existing.count += 1
  return true
}