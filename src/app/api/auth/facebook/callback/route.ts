import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/meta-page-check?error=${encodeURIComponent(error)}`, request.url)
    );
  }
  if (!code) {
    return NextResponse.redirect(new URL("/meta-page-check?error=no_code", request.url));
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/facebook/callback`;
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    client_secret: process.env.FACEBOOK_APP_SECRET || "",
    redirect_uri: redirectUri,
    code,
  });

  const tokenRes = await fetch(`https://graph.facebook.com/v22.0/oauth/access_token?${params.toString()}`);
  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    const message = tokenData.error?.message || "token_exchange_failed";
    return NextResponse.redirect(
      new URL(`/meta-page-check?error=${encodeURIComponent(message)}`, request.url)
    );
  }

  const response = NextResponse.redirect(new URL("/meta-page-check?connected=1", request.url));
  response.cookies.set("fb_access_token", tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });
  return response;
}
