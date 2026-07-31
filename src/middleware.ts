import { NextRequest, NextResponse } from "next/server";

const REVIEWER_PATHS = ["/meta-page-check", "/api/meta-page-search", "/api/auth/facebook"];

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
  const isReviewerPath = REVIEWER_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  const authorized = isReviewerPath
    ? checkAuth(request, process.env.REVIEWER_USERNAME, process.env.REVIEWER_PASSWORD)
    : checkAuth(request, process.env.DASHBOARD_USERNAME, process.env.DASHBOARD_PASSWORD);

  if (authorized) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Samvid Lead Engine"' },
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/leads/:path*",
    "/meta-page-check/:path*",
    "/api/meta-page-search/:path*",
    "/api/auth/facebook/:path*",
  ],
};
