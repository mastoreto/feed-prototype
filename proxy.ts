import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Optimistic check only (cookie present). Real authorization happens in tRPC protectedProcedure.
export function proxy(req: NextRequest) {
  const hasSession = !!getSessionCookie(req);
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (!hasSession && !isAuthPage)
    return NextResponse.redirect(new URL("/login", req.url));
  if (hasSession && isAuthPage)
    return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/campaigns/:path*",
    "/login",
    "/signup",
  ],
};
