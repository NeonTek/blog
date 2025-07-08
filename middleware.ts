/*
John 1:5
The light shines in darkness, but the darkness has not understood it 
*/
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminAuth = request.cookies.get("admin-auth")?.value;

  // Skip auth check for /admin/login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!adminAuth || adminAuth !== "authenticated") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
