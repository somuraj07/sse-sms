import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 👇 Allow public routes (signin, static assets, etc.)
  if (pathname.startsWith("/user/signin") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // 👇 Get token from cookie
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // ❌ No token → force signin
    return NextResponse.redirect(new URL("/user/signin", req.url));
  }

  // ✅ Token exists → allow
  return NextResponse.next();
}

// 👇 Apply middleware only to /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
