# Chat API evidence

- 2026-11-12 KST; Node 22.22.1, pnpm 10.8.1, Chromium, reduced motion, desktop 1440×900/mobile 390×844, light/dark.
- Root images: actual `/api/resume/chat` response with AI disconnected. The response is a fallback with public links, never presented as an AI success.
- `pending-mock/`, `quota-mock/`: explicitly mocked browser responses (0 remaining / reset time) to inspect disabled duplicate send and quota UI.
- 53 Jest +60 browser checks passed after reproducing/fixing actual same-origin 403 (Next internal localhost URL vs public Host).
- Actual Postgres17: daily/minute/IP/UTC/TTL/role checks; 31 concurrent unique requests =>30 reservations; 12 duplicates=>1; failed transaction leaves no partial counters. Lost-cookie retry with same request ID is rejected across visitor identities. Body-only technical terms are searchable after the independent review fix.
- Existing Supabase configuration could not resolve via DNS. No production migration or live-data mutation performed. Read-only account/schema verification remains outstanding.
- Actual server secret/private text absent 38 browser JS chunks. Raw questions/history/provider errors are not logged.
- Images opened and inspected. Product SHA and final evidence SHA recorded in the PR body.
