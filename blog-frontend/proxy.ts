import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/articles/new"]
const authRoutes = ["/login", "/signup"]

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const path = req.nextUrl.pathname

  const isProtected = protectedRoutes.some((r) => path.startsWith(r))
    || /^\/articles\/\d+\/edit$/.test(path)
  const isAuthRoute = authRoutes.includes(path)

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/articles", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
