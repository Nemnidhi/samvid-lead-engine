import { NextRequest, NextResponse } from "next/server";

// Server-to-server call using the app's own App Access Token, same mechanism
// as /api/meta-page-search. Reads a Page's recent posts - this is what Page
// Public Content Access grants beyond Page Public Metadata Access (which only
// covers Page-level metadata, not feed/post content). Still no per-user login:
// this is also an app-level Feature, not an OAuth-granted permission.
export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get("pageId");
  if (!pageId) {
    return NextResponse.json({ error: "Missing pageId parameter" }, { status: 400 });
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.json({ error: "Facebook app credentials not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({
    fields: "id,message,created_time,permalink_url",
    access_token: `${appId}|${appSecret}`,
  });

  const res = await fetch(`https://graph.facebook.com/v22.0/${encodeURIComponent(pageId)}/feed?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message || "Facebook API error" }, { status: res.status });
  }

  return NextResponse.json(data);
}
