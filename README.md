# Samvid Lead Engine

Internal tool: takes real-estate agent/firm leads, checks their digital presence
(website, Google Business, Meta ad activity), classifies them (A/B/C/D), generates
a personalized one-page PDF "lead-leakage" report, and lets the sales team send it
via a mail-merge campaign, all logged to MongoDB.

## Stack

- Next.js (App Router) on Vercel
- MongoDB Atlas
- GitHub Actions for the scheduled enrichment worker
- Groq (Llama 3.3 70B) primary LLM for report copy, Gemini as fallback
- Headless-Chrome HTML -> PDF rendering (library TBD, see Phase 5)
- Email sending via a provider TBD (see Phase 7)

## Local setup

```bash
npm install
cp .env.example .env
# fill in .env with real values as each phase requires them
npm run dev
```

## Build phases

1. Scaffold (this commit) - Next.js + Mongo connection + empty Vercel deploy
2. Lead import script (CSV -> MongoDB `leads`)
3. Enrichment worker (GitHub Actions, scheduled)
4. Classification rule engine (A/B/C/D)
5. Report generation (HTML -> PDF + LLM copy)
6. Dashboard (internal, password-protected)
7. Send pipeline (mail-merge + outreach log)
8. End-to-end test on 5 real leads before the real batch

See `.env.example` for every environment variable required, with notes on where
to get each one.
