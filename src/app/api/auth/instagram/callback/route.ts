import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/meta-page-check?ig_error=${encodeURIComponent(error)}`, request.url)
    );
  }
  if (!code) {
    return NextResponse.redirect(new URL("/meta-page-check?ig_error=no_code", request.url));
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/instagram/callback`;
  const tokenParams = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    client_secret: process.env.FACEBOOK_APP_SECRET || "",
    redirect_uri: redirectUri,
    code,
  });

  const tokenRes = await fetch(`https://graph.facebook.com/v22.0/oauth/access_token?${tokenParams.toString()}`);
  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    const message = tokenData.error?.message || "token_exchange_failed";
    return NextResponse.redirect(
      new URL(`/meta-page-check?ig_error=${encodeURIComponent(message)}`, request.url)
    );
  }

  // Find a Page this user manages that has an Instagram Professional account
  // connected - expected to be the Nemnidhi Page (nemnidhi.official).
  const accountsParams = new URLSearchParams({
    fields: "id,name,access_token,instagram_business_account{id,username}",
    access_token: tokenData.access_token,
  });
  const accountsRes = await fetch(`https://graph.facebook.com/v22.0/me/accounts?${accountsParams.toString()}`);
  const accountsData = await accountsRes.json();

  if (!accountsRes.ok) {
    const message = accountsData.error?.message || "accounts_lookup_failed";
    return NextResponse.redirect(
      new URL(`/meta-page-check?ig_error=${encodeURIComponent(message)}`, request.url)
    );
  }

  type PageWithInstagram = {
    id: string;
    access_token: string;
    instagram_business_account?: { id: string; username?: string };
  };
  const pages = (accountsData.data || []) as PageWithInstagram[];
  const pageWithIg = pages.find((p) => p.instagram_business_account?.id);

  if (!pageWithIg?.instagram_business_account) {
    return NextResponse.redirect(
      new URL("/meta-page-check?ig_error=no_linked_instagram_account", request.url)
    );
  }

  const response = NextResponse.redirect(new URL("/meta-page-check?ig_connected=1", request.url));
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60,
    path: "/",
  };
  response.cookies.set("ig_page_access_token", pageWithIg.access_token, cookieOptions);
  response.cookies.set("ig_business_account_id", pageWithIg.instagram_business_account.id, cookieOptions);
  return response;
}
