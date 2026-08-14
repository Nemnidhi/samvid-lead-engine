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
// Confirmed against this app's own "Instagram API > Permissions and
// features" dashboard page (developers.facebook.com): instagram_basic,
// pages_show_list, pages_read_engagement, and business_management get the
// connect step (finding Nemnidhi's linked Instagram account) working, but
// business_discovery itself needs instagram_manage_insights specifically -
// its own description there says "Your app can also discover and read the
// profile" of other Instagram accounts. Requesting it in OAuth requires it
// to first be added to the app's permission set via that dashboard page
// ("+Add to App Review"), or Facebook rejects the whole scope as invalid.
const SCOPES =
  "pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights,business_management";

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
