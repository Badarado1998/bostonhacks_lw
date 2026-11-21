# KICKOFF PROMPT: "T-City" (working name), BostonHacks 2026

You are the lead engineer on a 2-person hackathon team building in Cursor. We have until **9:00 AM Sunday Nov 22 (ET)** to submit. Judging is a 3-minute pitch plus 1 minute of Q&A. **A working live demo beats breadth. Ship the core loop first, then add layers.** Work in small steps, commit after every working milestone, and tell us what to test after each one.

## 1. What we're building

A mobile-first web game for people riding the MBTA. Riders earn points on trips they already take. Each line's riders collectively grow a district of a shared Boston skyline. When a delay hits, the app turns the wait into a quick find-it-in-the-station scavenger hunt. Riders also earn **CitiTokens** that can be redeemed for rotating perks.

**One-line pitch:** *Your commute builds the city. Delays become quests.*

### Target tracks (all are judged on: idea impact, user fit, working prototype, design, presentation)
- **Primary: Transit Gamification.** "Transform the common T ride from something dreaded into something people look forward to." Serve locals (routine, platform waits) and tourists (feeling disconnected from the city above ground).
- **Bonus prizes we're also targeting:** SpaceXSI (Cursor + Grok Bot, see section 9), GoDaddy domain (section 9), optionally Best Use of Solana (see P2).

## 2. Core concepts

- **Teams = lines.** Red, Orange, Blue, Green (B/C/D/E), and Silver. A rider picks a home line.
- **District per line, built from points.**
  - Red = Cambridge / Kendall / Harvard "innovation" skyline
  - Green = Fenway and campuses
  - Orange = neighborhoods (Jamaica Plain, South End, Back Bay)
  - Blue = Harbor, Airport, waterfront
  - Silver = Seaport
  Each district is a grid of lots. Points level up buildings through about 5 tiers per lot. All riders see the same shared city.
- **Points** are earned for stops traveled on a verified ride, a first-ride-of-the-day bonus, a streak bonus, hunt completions, and landmark visits. Points go to the district of the line you rode.
- **CitiTokens** are a per-rider balance earned alongside points. They are redeemed for perks from a small catalog with limited quantities that rotates on a timer.

## 3. Priorities (build in this order; cut from the bottom if behind)

**P0: must work live in the demo**
1. Live MBTA data layer (vehicles, predictions, alerts) behind our own cached API routes.
2. Ride verification: match the phone's GPS to a real vehicle (details in section 5).
3. Points ledger, line teams, leaderboard.
4. City view: the districts grow as points arrive. This is the visual centerpiece.
5. Delay trigger (real alerts plus a **"simulate delay" demo switch**) that opens the hunt card.

**P1**
6. Find-it-in-the-station scavenger hunt (hand-authored clues for about 6-8 stations).
7. Landmark bonuses (about 15 hand-picked landmarks near stops, geofenced, "I'm here" claim).
8. CitiToken ledger plus a rotating perk catalog with a redeem flow (mock partners, QR code shown on redeem).

**P2: only after P0 and P1 are solid**
9. Solana devnet: mint each CitiToken award as an SPL token and show the transaction link. Keep the ledger as the source of truth and make on-chain a toggle. Devnet only, no real value, no sales.
10. Gemini photo check for hunts.
11. Tiger Data hypertable for vehicle position history and a delay-heatmap panel.

**P3: fake or cut**
- Interest-based meetups: show 2-3 seeded static entries.
- Private rooms, real business partners, real money: cut.

## 4. Suggested stack (change if we say otherwise)
- Next.js (App Router) + TypeScript, deployed to Vercel (HTTPS is required for phone geolocation, so deploy early).
- Postgres via Tiger Data free tier if signup is quick, otherwise any hosted Postgres.
- MBTA V3 API (`https://api-v3.mbta.com`), with a free API key from the portal (about 1,000 req/min). Use `/vehicles`, `/predictions`, `/alerts`, `/stops`, `/routes`, `/shapes`, and `/facilities` if useful. Cache on the server (about 5 seconds) and poll or use SSE for clients. Never expose the key to the browser.
- Map: Leaflet or MapLibre. City view: SVG or CSS tiles (no heavy 3D). Keep assets light.
- Realtime to clients: polling every 3-5 seconds is fine.

## 5. Ride verification (GPS matched to a vehicle)

The client sends `{lat, lng, accuracy, speed, timestamp}` roughly every 10 seconds while a ride session is active. The server compares against current vehicle positions for rapid-transit routes and returns the best candidate. A match requires being within a distance threshold that scales with GPS accuracy, with moving speed consistent with the vehicle, over N consecutive samples (e.g. 3) for the same vehicle ID. On a match, the session is bound to that vehicle ID and route.

**Known problem: GPS is unreliable underground.** Handle it explicitly:
- Keep the session alive in a "tunnel grace" state for a few minutes if the bound vehicle is still reported in service.
- Credit stops using the vehicle's reported `current_stop_sequence` or predictions while the rider is bound to it.
- Provide a manual "I'm on the Red Line toward Alewife" fallback that is validated against vehicles near the chosen stop.
- Show a clear status in the UI: searching / on vehicle / in tunnel / left vehicle.

**Anti-abuse (minimal):** no points for stationary phones, one active session per rider, and a cap on points per hour. We don't need more for a hackathon.

## 6. Delay trigger and hunts
- A delay is detected from alerts (effect = delay or similar) on the rider's route, or from predictions slipping well past schedule.
- When the rider is at or near a station during a delay, show a hunt card for that station: 2-3 "find it in the station" clues (e.g. a mosaic, an art piece, a sign, a count). Completing each is a tap to confirm, with optional photo (P2).
- Clues must be **verifiable by us in person**. We will check them at BU Central / Blandford St and other stations we can visit. Do not invent physical details. If a clue is not verified, mark it `verified: false` and do not ship it.
- **Demo switch:** an admin/demo toggle that fakes a delay on a chosen line so we can show the flow on demand.

## 7. Demo mode (essential)

We must be able to demo with no real riders on a real train:
- A seeded set of simulated riders across lines that keep earning points so the city is visibly alive.
- A simulated ride that plays back GPS samples along a real route shape.
- The "simulate delay" switch.
- A real test ride on the Green Line B branch (it is surface-level, so GPS works) for the video.

## 8. Data model (sketch)
`riders`, `ride_sessions` (rider, vehicle_id, route_id, status, started_at), `point_events` (rider, route_id, type, amount, ref), `districts` (route_id, lot_id, tier, points), `hunts` and `hunt_clues` (station_id, text, verified), `hunt_completions`, `landmarks` (name, lat, lng, stop_id, bonus), `perks` (title, cost, quantity_remaining, rotates_at), `redemptions`, `token_ledger` (rider, delta, reason, tx_signature nullable).

## 9. Non-code tasks (we handle these; give us a checklist)
- **Cursor:** use Cursor as the core coding agent (we will say so on Devpost).
- **Grok Bot (SpaceXSI raffle):** set up one Grok Bot automation in our workflow, for example QA-testing the deployed site and filing issues, or drafting the Devpost description. Create `docs/grokbot-tasks.md` with a ready-to-paste Bot prompt and a log of what it did, so we can describe it accurately on Devpost. Opt in to the raffle on submission.
- **GoDaddy:** register the project domain with the MLH promo code and point it at the deployed app.
- **Submission (Devpost, due 9:00 AM Sunday):** 1-minute demo video, project summary, team and project names, member list (all members), public GitHub repo, and extra links. Confirm status is **Submitted**, not Draft. Generate `docs/devpost-draft.md` early and keep it updated.
- **Pitch:** 3 minutes plus 1 minute Q&A. Draft `docs/pitch.md` with the demo script.

## 10. Rules to follow while working
- All work must be created during the hackathon window. Do not paste in prior projects. Open-source libraries, public data and AI tools are allowed.
- Never commit secrets. Use `.env.local` and provide `.env.example`.
- Keep the README current: what it is, how to run, MBTA key setup, demo mode instructions.
- After each milestone, give us a short "how to test this" list and the next step.
- If a requirement is ambiguous or a cut is needed, tell us the tradeoff and pick the option that protects the P0 demo.
- Everything user-facing must work on a phone-sized screen first. Aim for clear, accessible, polished UI; design is judged.

## 11. First actions (do these now)
1. Scaffold the project, set up env handling, and deploy a hello-world to Vercel.
2. Build the MBTA proxy routes with caching and a live vehicles map as a smoke test.
3. Propose the exact data model and file structure for us to approve in one short message, then start P0 items 2-5.
