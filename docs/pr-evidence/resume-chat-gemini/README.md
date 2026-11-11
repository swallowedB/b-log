# Gemini integration visual evidence

- 2026-11-12 KST; Node22.22.1/pnpm10.8.1/Chromium, desktop1440×900/mobile390×844, dark/light/reduced motion.
- Root: **mock success**, a fixed test response explicitly labeled in the answer; no live Gemini generation. Checks AI origin label, public source, privacy help. Cached origin label also asserted in browser.
- `ai-off/`: actual local endpoint with absent credentials/default off, returning honest fallback.
- `quota-mock/`: fixed429/zero remaining/reset browser fixture, not a real account quota response.
- 92 unit/integration-style checks and72 browser checks passed. Real SDK with intercepted HTTP proves one request on429/500 and explicit Developer endpoint/key despite other environment defaults. Connected guard+handler proves zero generation for wrong project/billing/auth failures.
- Actual new-container Postgres integration passed after TCP readiness fix; no operational SQL was applied.
- Server credentials/test keys/private draft text absent38browserchunks. Images opened for layout/readability review.
- Live project ownership, billing state, account limits, model factual evaluation and live smoke remain unverified because credentials are missing. AI default remains off.
