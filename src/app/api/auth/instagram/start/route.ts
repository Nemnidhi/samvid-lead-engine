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
// Confirmed against this app's own "Instagram API > API setup with Facebook
// login" dashboard page (developers.facebook.com), which lists the actual
// valid scopes for this app rather than Meta's general (and stale/renamed)
// docs - instagram_manage_insights, guessed originally, isn't offered there
// at all and errored live as "Invalid Scopes". These four are the scopes
// common to both listed use cases (content management and messaging) minus
// the publish/messaging-specific ones this app doesn't need.
const SCOPES = "pages_show_list,pages_read_engagement,instagram_basic,business_management";

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
