  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isProtected = pathMatches(request.nextUrl.pathname, memberProtected)

  if (!user && isProtected) {
    return redirectTo(request, routes.login)
  }

  return response
}