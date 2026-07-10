import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from './client'

/**
 * Refreshes the Supabase auth session on every request and (optionally)
 * guards the in-app routes. Called from `middleware.ts`.
 *
 * While Supabase is not configured, this is a no-op so the preview works
 * without any backend.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request })

  if (!isSupabaseConfigured()) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected app routes — redirect unauthenticated users to /login.
  // const protectedPaths = [
  //   '/home',
  //   '/communities',
  //   '/messages',
  //   '/therapy',
  //   '/profile',
  //   '/resources',
  //   '/saved',
  //   '/settings',
  // ]
  // const isProtected = protectedPaths.some((p) =>
  //   request.nextUrl.pathname.startsWith(p),
  // )

  // if (!user && isProtected) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  const pathname = request.nextUrl.pathname;

  // Public routes
  const publicRoutes = ["/", "/login", "/signup"]

  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}
