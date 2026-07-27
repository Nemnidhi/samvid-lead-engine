// Stubbed until GOOGLE_PLACES_API_KEY (or an equivalent third-party lookup) is
// configured. Returns checked:false rather than guessing, so downstream
// classification can tell "not checked" apart from "checked, not found".

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

  // TODO: real Places API Text Search call, once a key is available.
  // Query shape will be `${name} ${district}` per the build plan.
  return {
    checked: false,
    found: null,
    rating: null,
    review_count: null,
    reason: "GOOGLE_PLACES_API_KEY present but lookup not yet implemented",
    checked_at: new Date(),
  };
}

module.exports = { checkGoogleBusiness };
