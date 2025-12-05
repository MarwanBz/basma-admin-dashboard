import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(
    "🔒 MIDDLEWARE EXECUTING:",
    request.url,
    new Date().toISOString()
  );

  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    console.log("🔒 MIDDLEWARE: Non-dashboard route, allowing");
    return NextResponse.next();
  }

  // Check for any authentication tokens (access or refresh)
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  console.log("🔒 MIDDLEWARE: Tokens found", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
  });

  // If no tokens at all, redirect to login
  if (!accessToken && !refreshToken) {
    console.log("🔒 MIDDLEWARE: No tokens, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("🔒 MIDDLEWARE: Allowing access, page will load");
  // Allow access even with expired access token - let API client handle refresh
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
