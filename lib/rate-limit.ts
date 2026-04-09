/**
 * Simple in-memory rate limiter for API routes.
 * Tracks request counts per key (user ID or IP) within a sliding window.
 *
 * Note: This resets on serverless cold starts. For persistent rate limiting
 * across instances, use Redis or a similar external store.
 */

const requests = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of requests) {
    if (now > entry.resetAt) {
      requests.delete(key)
    }
  }
}, 60_000)

export function rateLimit(
  key: string,
  { maxRequests, windowMs }: { maxRequests: number; windowMs: number },
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = requests.get(key)

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}
