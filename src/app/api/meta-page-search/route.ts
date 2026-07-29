import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("fb_access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not connected to Facebook - log in first" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const params = new URLSearchParams({
    q,
    fields: "id,name,link,location,verification_status",
    access_token: token,
  });

  const res = await fetch(`https://graph.facebook.com/v22.0/pages/search?${params.toString()}`);
  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message || "Facebook API error" }, { status: res.status });
  }

  return NextResponse.json(data);
}
