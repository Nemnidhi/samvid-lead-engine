import { NextRequest, NextResponse } from "next/server";

// One-time admin connect, not a per-visitor login. business_discovery (unlike
// Page Public Metadata/Content Access) genuinely requires a real user access
// token from someone who manages the Instagram-account-owning Facebook Page -
// there is no app-level Feature that substitutes for this. Nemnidhi's own
// Instagram (nemnidhi.official) is already a Professional account connected
// to the Nemnidhi Facebook Page, so whoever completes this login becomes the
// "querying identity" that /api/instagram-discovery looks up other public
// accounts from.
//
// Scope choice not yet verified live - Meta's Instagram permission names have
// been through multiple renames. Correct the scope string here based on
// whatever error (if any) the callback actually gets back from Meta.
const SCOPES = "pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights";

export async function GET(request: NextRequest) {
  const redirectUri = `${request.nextUrl.origin}/api/auth/instagram/callback`;
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    redirect_uri: redirectUri,
    scope: SCOPES,
    response_type: "code",
  });
  return NextResponse.redirect(`https://www.facebook.com/v22.0/dialog/oauth?${params.toString()}`);
}
