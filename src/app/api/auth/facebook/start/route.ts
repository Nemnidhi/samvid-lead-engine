import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const redirectUri = `${request.nextUrl.origin}/api/auth/facebook/callback`;
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    redirect_uri: redirectUri,
    scope: "pages_read_engagement,pages_show_list",
    response_type: "code",
  });
  return NextResponse.redirect(`https://www.facebook.com/v22.0/dialog/oauth?${params.toString()}`);
}
