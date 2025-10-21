import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Check for access token in cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // If no token and trying to access dashboard, redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Token exists, allow access and let components handle role-based authorization
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
