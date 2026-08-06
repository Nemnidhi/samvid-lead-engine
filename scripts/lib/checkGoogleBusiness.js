// Real Google Business check via the Places API (Text Search). Falls back
// to checked:false (not "not found") whenever the key is missing or the API
// call itself fails/is denied, so downstream classification can tell
// "not checked" apart from "checked, confirmed absent" - see classify.js.

const PLACES_TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json";

async function checkGoogleBusiness(name, district, state) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return {
      checked: false,
      found: null,
      rating: null,
      review_count: null,
      reason: "GOOGLE_PLACES_API_KEY not configured yet",
      checked_at: new Date(),
    };
  }

  const query = [name, district, state].filter(Boolean).join(" ");
  const url = new URL(PLACES_TEXT_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("key", apiKey);

  let response;
  try {
    response = await fetch(url.toString());
  } catch (err) {
    return {
      checked: false,
      found: null,
      rating: null,
      review_count: null,
      reason: `Places API request failed: ${err.message}`,
      checked_at: new Date(),
    };
  }

  if (!response.ok) {
    return {
      checked: false,
      found: null,
      rating: null,
      review_count: null,
      reason: `Places API HTTP ${response.status}`,
      checked_at: new Date(),
    };
  }

  const data = await response.json();

  if (data.status === "ZERO_RESULTS") {
    return {
      checked: true,
      found: false,
      rating: null,
      review_count: null,
      checked_at: new Date(),
    };
  }

  if (data.status !== "OK") {
    // REQUEST_DENIED, OVER_QUERY_LIMIT, INVALID_REQUEST, UNKNOWN_ERROR - none
    // of these mean "confirmed absent", so surface as not-checked rather
    // than guessing.
    return {
      checked: false,
      found: null,
      rating: null,
      review_count: null,
      reason: `Places API status ${data.status}${data.error_message ? `: ${data.error_message}` : ""}`,
      checked_at: new Date(),
    };
  }

  const top = data.results && data.results[0];
  const found = !!top && top.business_status !== "CLOSED_PERMANENTLY";

  return {
    checked: true,
    found,
    rating: top?.rating ?? null,
    review_count: top?.user_ratings_total ?? null,
    place_name: top?.name ?? null,
    checked_at: new Date(),
  };
}

module.exports = { checkGoogleBusiness };
