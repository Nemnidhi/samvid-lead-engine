import { NextRequest, NextResponse } from "next/server";

// Server-to-server call using the app's own App Access Token
// (FACEBOOK_APP_ID|FACEBOOK_APP_SECRET) - no per-user Facebook login involved.
// This mirrors exactly how the real production check (checkMetaPresence) calls
// the Graph API: Page Public Metadata Access is an app-level Feature, not a
// user-granted OAuth permission, so there is nothing for a visitor to "connect."
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.json({ error: "Facebook app credentials not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    q,
    fields: "id,name,link,location,verification_status",
    access_token: `${appId}|${appSecret}`,
  });

  const res = await fetch(`https://graph.facebook.com/v22.0/pages/search?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message || "Facebook API error" }, { status: res.status });
  }

  return NextResponse.json(data);
}
