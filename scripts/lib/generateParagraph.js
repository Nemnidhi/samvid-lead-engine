// Generates the report's 2-3 sentence "what this means" paragraph.
// Groq (Llama 3.3 70B) is primary, Gemini is the fallback if Groq fails or
// isn't configured, and a plain-template sentence is the last-resort
// fallback so report generation never hard-fails on an LLM outage.

const SYSTEM_PROMPT = `You write a short paragraph for a business-development report sent directly to a real-estate agent/firm about their online presence.

Rules:
- Write exactly 2-3 sentences.
- Address the business in second person ("you"/"your business") throughout - never switch to third person or use the business's own name as the sentence subject.
- Use ONLY the facts provided below. Never invent specific numbers, ratings, review counts, ad counts, or other statistics that were not given to you.
- If a channel is marked "not checked", do not claim or imply it was checked or that it is missing - simply don't mention it.
- Tone: professional, direct, and helpful - like a knowledgeable colleague pointing out an opportunity, not a sales pitch full of hype.
- Do not use exclamation points or superlatives ("amazing", "huge", "incredible").`;

function buildFactsSummary(lead, enrichment, classification) {
  const lines = [
    `Business name: ${lead.name}`,
    `Type: ${lead.agent_type}`,
    `Location: ${[lead.district, lead.state].filter(Boolean).join(", ")}`,
  ];

  if (enrichment.website?.found) {
    lines.push(`Website: found at ${enrichment.website.url}`);
  } else {
    lines.push("Website: no website found under a plausible domain guess");
  }

  if (enrichment.google_business?.checked) {
    lines.push(
      `Google Business profile: ${enrichment.google_business.found ? "found" : "not found"}`
    );
  }

  if (enrichment.meta_ads?.checked) {
    lines.push(`Meta ad activity: ${enrichment.meta_ads.found ? "found" : "not found"}`);
  }

  lines.push(`Overall classification tier: ${classification.category} (${classification.reasoning})`);

  return lines.join("\n");
}

async function callGroq(facts) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Facts:\n${facts}\n\nWrite the paragraph.` },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq API returned no content");
  return text;
}

async function callGemini(facts) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: `Facts:\n${facts}\n\nWrite the paragraph.` }] }],
        generationConfig: { temperature: 0.4 },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini API returned no content");
  return text;
}

function fallbackParagraph(lead, enrichment, classification) {
  const hasWebsite = !!enrichment.website?.found;
  return (
    `${lead.name} was reviewed as part of a digital presence check. ` +
    `${hasWebsite ? "A website was found for the business." : "No website was found for the business under a plausible domain guess."} ` +
    `Based on the channels checked so far, this business falls into tier ${classification.category} of our review.`
  );
}

async function generateParagraph(lead, enrichment, classification) {
  const facts = buildFactsSummary(lead, enrichment, classification);

  try {
    return { text: await callGroq(facts), source: "groq" };
  } catch (groqErr) {
    try {
      return { text: await callGemini(facts), source: "gemini", groqError: String(groqErr) };
    } catch (geminiErr) {
      return {
        text: fallbackParagraph(lead, enrichment, classification),
        source: "fallback_template",
        groqError: String(groqErr),
        geminiError: String(geminiErr),
      };
    }
  }
}

module.exports = { generateParagraph, buildFactsSummary };
