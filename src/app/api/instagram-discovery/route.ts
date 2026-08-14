import { NextRequest, NextResponse } from "next/server";

// Looks up any public Instagram Professional (Business/Creator) account by
// username via business_discovery, using the page access token captured by
// /api/auth/instagram/callback. Unlike the Facebook checks, this genuinely
// needs a real per-user token tied to Nemnidhi's own connected Instagram
// account (nemnidhi.official) - there is no app-level Feature equivalent.
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  if (!username) {
    return NextResponse.json({ error: "Missing username parameter" }, { status: 400 });
  }

  const pageAccessToken = request.cookies.get("ig_page_access_token")?.value;
  const igBusinessAccountId = request.cookies.get("ig_business_account_id")?.value;
  if (!pageAccessToken || !igBusinessAccountId) {
    return NextResponse.json(
      { error: "Instagram not connected - connect Nemnidhi's Instagram account first" },
      { status: 401 }
    );
  }

  const params = new URLSearchParams({
    fields: `business_discovery.username(${username}){username,followers_count,media_count,biography}`,
    access_token: pageAccessToken,
  });

  const res = await fetch(`https://graph.facebook.com/v22.0/${igBusinessAccountId}?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message || "Instagram API error" }, { status: res.status });
  }

  return NextResponse.json(data);
}
