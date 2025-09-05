import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes (no signin required)
  if (pathname.startsWith("/user/signin") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // Check for token (from localStorage or cookies – here assuming cookie)
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // If no token → redirect to signin
    return NextResponse.redirect(new URL("/user/signin", req.url));
  }

  // ✅ Allow
  return NextResponse.next();
}

// Apply middleware to protected routes only
export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/users/:path*"],
};
