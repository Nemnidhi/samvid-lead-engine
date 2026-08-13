import { NextRequest, NextResponse } from "next/server";

// The Meta App Review demo flow (/meta-page-check + its API routes) is
// deliberately NOT gated here. It bounces through facebook.com and back
// (OAuth login, then the callback redirect), and browsers don't reliably
// keep a cached Basic-Auth session across a round trip through a different
// origin - it re-challenges on the way back, breaking the flow. The page
// itself only lets a visitor connect their own Facebook account and search
// public Pages; it never touches leads or dashboard data, so leaving it
// ungated is safe. Meta's own reviewers may also click the live link
// directly, and a password wall there would just add friction for them too.

function checkAuth(request: NextRequest, expectedUser?: string, expectedPass?: string) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;
  const decoded = atob(authHeader.slice(6));
  const separatorIndex = decoded.indexOf(":");
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);
  return user === expectedUser?.trim() && pass === expectedPass?.trim();
}

export function middleware(request: NextRequest) {
  const authorized = checkAuth(request, process.env.DASHBOARD_USERNAME, process.env.DASHBOARD_PASSWORD);

  if (authorized) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Samvid Lead Engine"' },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/leads/:path*"],
};
