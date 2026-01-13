import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (path.startsWith("/staff") && role !== "STAFF") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (path.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (path.startsWith("/approver") && role !== "APPROVER") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/student/:path*",
    "/approver/:path*",
  ],
};
