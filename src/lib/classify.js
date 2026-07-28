// Rule-based classifier over enrichment signals. Deliberately not an LLM -
// this needs to be deterministic and auditable.
//
// Tiers (adapted from the original A/B/C/D spec to the signals we actually
// have - website, Google Business, Meta ads; no portal-listing check yet):
//   D - strong presence: 2+ of the checked channels found
//   C - some presence: exactly 1 channel found
//   B - appears minimal, but not fully confirmed: 0 channels found AND at
//       least one channel (Google Business / Meta) hasn't been checked yet -
//       i.e. we can't yet rule out a presence we haven't looked for
//   A - confirmed no digital presence: 0 channels found AND all 3 channels
//       have actually been checked
//
// `confidence` is "full" only when all 3 channels were checked, so
// downstream report copy can avoid asserting things we didn't verify.

function classify(enrichment) {
  const channels = [
    { name: "website", checked: true, found: !!enrichment.website?.found },
    { name: "google_business", checked: !!enrichment.google_business?.checked, found: !!enrichment.google_business?.found },
    { name: "meta_ads", checked: !!enrichment.meta_ads?.checked, found: !!enrichment.meta_ads?.found },
  ];

  const checkedChannels = channels.filter((c) => c.checked);
  const foundChannels = checkedChannels.filter((c) => c.found);
  const signalsChecked = checkedChannels.length;
  const signalsFound = foundChannels.length;

  let category;
  if (signalsFound >= 2) {
    category = "D";
  } else if (signalsFound === 1) {
    category = "C";
  } else if (signalsChecked === 3) {
    category = "A";
  } else {
    category = "B";
  }

  const describe = (c) => {
    if (!c.checked) return `${c.name}: not checked`;
    return `${c.name}: ${c.found ? "found" : "not found"}`;
  };
  const reasoning = channels.map(describe).join("; ");

  return {
    category,
    reasoning,
    signals_checked: signalsChecked,
    signals_found: signalsFound,
    confidence: signalsChecked === 3 ? "full" : "partial",
  };
}

module.exports = { classify };
