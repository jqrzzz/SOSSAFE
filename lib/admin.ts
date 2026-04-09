/**
 * Admin utilities — auth check + service-role Supabase client
 *
 * Admin access is gated by email. The service-role client bypasses RLS
 * so admin pages can query across all partners. Only used in server components.
 */

import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"

/** Emails allowed to access /admin — comma-separated env var */
function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS || ""
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Check if the current authenticated user is an admin.
 * Returns the user if admin, null otherwise.
 */
export async function getAdminUser() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return null

  const adminEmails = getAdminEmails()
  if (adminEmails.length === 0) return null
  if (!adminEmails.includes(user.email.toLowerCase())) return null

  return user
}

/**
 * Supabase client with service role key — bypasses RLS.
 * Only use in server components / route handlers for admin queries.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to your .env to enable admin features."
    )
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}
