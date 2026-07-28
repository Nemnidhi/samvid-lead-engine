import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const expectedUser = process.env.DASHBOARD_USERNAME;
  const expectedPass = process.env.DASHBOARD_PASSWORD;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice(6));
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  let receivedUser = "";
  let receivedPass = "";
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice(6));
    const separatorIndex = decoded.indexOf(":");
    receivedUser = decoded.slice(0, separatorIndex);
    receivedPass = decoded.slice(separatorIndex + 1);
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Samvid Lead Engine"',
      // temporary diagnostic - lengths only, never real values
      "X-Debug-Expected-User-Len": String(expectedUser?.length ?? -1),
      "X-Debug-Expected-Pass-Len": String(expectedPass?.length ?? -1),
      "X-Debug-Received-User-Len": String(receivedUser.length),
      "X-Debug-Received-Pass-Len": String(receivedPass.length),
      "X-Debug-User-Matches": String(receivedUser === expectedUser),
      "X-Debug-Pass-Matches": String(receivedPass === expectedPass),
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/leads/:path*"],
};
