// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (pathname.startsWith("/user/signin") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // 🚨 No token → redirect immediately
    return NextResponse.redirect(new URL("/user/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"], // protected routes
};
