import { NextRequest, NextResponse } from "next/server";

// 1. Specify protected and public routes
const protectedRoutes = ["/protected"];
const publicRoutes = ["/login", "/signup", "/unprotected"];

export async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const token = req.cookies.get("session")?.value;

  // 4. Redirect to home if authenticated user access login
  if (path == "/login" && token) {
    return redirectHome(req);
  }
  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
    return redirectToLogin(req);
  }
  return NextResponse.next();
}

const redirectToLogin = (req: NextRequest): NextResponse => {
  return NextResponse.redirect(new URL("/login", req.url));
};

const redirectHome = (req: NextRequest): NextResponse => {
  return NextResponse.redirect(new URL("/", req.url));
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
