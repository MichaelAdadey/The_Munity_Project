/**
 * Supabase auth error → user-facing message.
 *
 * GoTrue sometimes fails signups with an HTTP 500 whose body is an empty
 * object — e.g. the common "Database error saving new user" failure
 * (usually a broken trigger on auth.users or a NOT NULL constraint on
 * public.profiles). supabase-js surfaces that as an AuthRetryableFetchError
 * whose `message` is literally "{}". Rendering that verbatim looks broken.
 *
 * This helper detects empty/unhelpful messages and substitutes a message
 * that actually tells the user (and the developer) what to check.
 */
export function authErrorMessage(
  error: { message?: string } | null | undefined,
  fallback: string,
): string {
  const raw = error?.message?.trim() ?? "";
  if (!raw || raw === "{}" || raw === "[]" || raw === "[object Object]") {
    return fallback;
  }
  return raw;
}
