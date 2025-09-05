import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths (no auth required)
  if (pathname.startsWith("/user/signin") || pathname.startsWith("/public")) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/user/signin", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    // Restrict admin routes
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user/signin", req.url));
    }

    // Restrict student routes
    if (pathname.startsWith("/student") && decoded.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/user/signin", req.url));
    }
    if (pathname.startsWith("/users") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user/signin", req.url));
    }


    // ✅ Allow if authorized
    return NextResponse.next();
  } catch (error) {
    console.error("JWT Error:", error);
    return NextResponse.redirect(new URL("/user/signin", req.url));
  }
}

// Apply middleware only to these paths
export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/users/:path*"], 
};
