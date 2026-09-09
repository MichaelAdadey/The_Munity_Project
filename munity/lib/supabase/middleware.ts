import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  MOCK_SESSION_COOKIE,
  parseMockSessionCookie,
  type MockRole,
} from "@/lib/mock-credentials";
import { routes } from "@/lib/routes";
import { isSupabaseConfigured } from "./client";

const memberProtected = [
  "/home",
  "/dashboard",
  "/messages",
  "/profile",
  "/saved",
  "/settings",
  "/notifications",
  "/sessions",
];

const therapistProtectedPrefixes = [
  "/therapistdashboard",
  "/therapistpatients",
  "/therapistclinicalnotes",
  "/therapistappointments",
  "/therapistavailability",
  "/therapistsettings",
  "/therapistanalytics",
  "/therapistfiles",
  "/therapistcareplan",
  "/therapistprofile",
  "/therapistnotifications",
  "/therapistmessages",
];

const adminProtectedPrefixes = ["/admin"];
const adminPublic = ["/admin/login"];

const therapistPublic = [
  "/therapistlogin",
  "/therapistsignup",
  "/therapistonboarding",
  "/therapistcredentialauth",
];

const maintenanceExempt = ["/maintenance", "/adminlogin", "/admin"];

async function isMaintenanceModeOn(
  supabase: ReturnType<typeof createServerClient>,
): Promise<boolean> {
  const { data } = await supabase
    .from("platform_settings")
    .select("maintenance_mode")
    .eq("id", true)
    .maybeSingle();
  return data?.maintenance_mode === true;
}

function pathMatches(pathname: string, prefixes: string[]) {
  const lower = pathname.toLowerCase();
  return prefixes.some(
    (prefix) => lower === prefix || lower.startsWith(`${prefix}/`),
  );
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

function enforceMockAuth(request: NextRequest, response: NextResponse) {
  const pathname = request.nextUrl.pathname;
  const session = parseMockSessionCookie(
    request.cookies.get(MOCK_SESSION_COOKIE)?.value,
  );
  const role: MockRole | null = session?.role ?? null;

  if (pathMatches(pathname, memberProtected)) {
    if (role !== "user") {
      return redirectTo(request, routes.login);
    }
    return response;
  }

  if (
    pathMatches(pathname, therapistProtectedPrefixes) &&
    !pathMatches(pathname, therapistPublic)
  ) {
    if (role !== "therapist") {
      return redirectTo(request, routes.therapistLogin);
    }
    return response;
  }

  if (
    pathMatches(pathname, adminProtectedPrefixes) &&
    !pathMatches(pathname, adminPublic)
  ) {
    if (role !== "admin") {
      return redirectTo(request, routes.adminLogin);
    }
  }

  return response;
}

/**
 * Refreshes the Supabase auth session on every request and guards in-app routes.
 * Without Supabase, enforces the preview mock-session cookie instead.
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return enforceMockAuth(request, response);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Maintenance mode: block everyone except admins and the exempt paths
  // (the maintenance page itself, admin login, and the admin section —
  // so an admin can always sign in and turn it back off).
  const pathname = request.nextUrl.pathname;
  if (!pathMatches(pathname, maintenanceExempt)) {
    const maintenanceOn = await isMaintenanceModeOn(supabase);
    if (maintenanceOn) {
      let isAdmin = false;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        isAdmin = profile?.role === "admin";
      }
      if (!isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/maintenance";
        return NextResponse.redirect(url);
      }
    }
  }

  // Keep auth enabled (Harriet). Do not use main's "temporarily disabled" block.
  const isProtected = pathMatches(request.nextUrl.pathname, memberProtected);

  if (!user && isProtected) {
    return redirectTo(request, routes.login);
  }

  return response;
}
