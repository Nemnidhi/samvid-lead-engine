import { NextRequest, NextResponse } from "next/server";

// Surfaces the long-lived credential pair captured by the connect flow so
// the admin who just completed it can copy them into Vega's own env
// (INSTAGRAM_DISCOVERY_ACCOUNT_ID / INSTAGRAM_DISCOVERY_ACCESS_TOKEN) -
// nothing is transmitted anywhere else. Only readable by whoever holds the
// httpOnly cookies set at the end of the OAuth flow, i.e. only the person
// who just connected in this same browser.
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("ig_page_access_token")?.value;
  const accountId = request.cookies.get("ig_business_account_id")?.value;
  if (!accessToken || !accountId) {
    return NextResponse.json({ error: "Instagram not connected" }, { status: 401 });
  }
  return NextResponse.json({ accountId, accessToken });
}
