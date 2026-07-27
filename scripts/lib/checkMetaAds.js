// Stubbed until META_AD_LIBRARY_ACCESS_TOKEN is configured. Returns
// checked:false rather than guessing, so downstream classification can tell
// "not checked" apart from "checked, not found".

async function checkMetaAds(name) {
  const token = process.env.META_AD_LIBRARY_ACCESS_TOKEN;
  if (!token) {
    return {
      checked: false,
      found: null,
      active_count: null,
      reason: "META_AD_LIBRARY_ACCESS_TOKEN not configured yet",
      checked_at: new Date(),
    };
  }

  // TODO: real Ad Library API call, once a token is available.
  return {
    checked: false,
    found: null,
    active_count: null,
    reason: "META_AD_LIBRARY_ACCESS_TOKEN present but lookup not yet implemented",
    checked_at: new Date(),
  };
}

module.exports = { checkMetaAds };
