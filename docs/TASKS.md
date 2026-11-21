# TASKS: backlog in order of importance

Do tasks in each lane in this order. `Dep` = needed first, but **build against `src/contracts/fixtures.ts` if the dep isn't merged yet**. Timings are rough budgets.

## P0: the demo does not exist without these

| ID | Owner | Task | Done when | Dep |
|---|---|---|---|---|
| **T01** | A | **Scaffold + deploy + contracts.** Next.js (App Router, TS), Postgres connection, `.env.example`, `npm run typecheck/lint`, deploy to Vercel on HTTPS. Create `src/contracts/` types and `fixtures.ts` from `docs/CONTRACTS.md`. Create route stubs that return fixtures. Announce in #1. (about 30 min, **blocks everyone**) | `main` deployed; `GET /api/health` ok; fixtures importable | none |
| **T02** | A | **MBTA data layer.** Server-side client with 5 s cache for vehicles, routes, stops, alerts; `/api/vehicles`, `/api/routes`, `/api/stops`. Never expose the API key. | Live vehicles for Red/Orange/Blue/Green-B/C/D/E/Silver returned in contract shape | T01 |
| **T03** | C | **App shell and live map.** Mobile-first layout, nav, design tokens, Leaflet/MapLibre map showing vehicles (mock then live), line color chips. | Phone-sized screen shows moving vehicles | T01 |
| **T04** | A | **Ride verification.** `POST /api/rides/sample` matches GPS to a vehicle (accuracy-scaled radius, N consecutive samples, speed check), session states, **tunnel grace**, manual fallback, `POST /api/rides/end`, `POST/GET /api/riders`. | Real ride on the Green B branch binds to the right vehicle; tunnel gap doesn't drop the session | T02 |
| **T05** | B | **Points ledger and districts.** Award rules in `src/server/points/rules.ts` (see CONTRACTS section 6), `point_events`, `/api/leaderboard`, `/api/districts` (lot tiers grow with points), `/api/points/award` for internal use, called by the ride flow. | Awarding points moves leaderboard and district tiers | T01 |
| **T06** | C | **Ride screen and city view.** Join flow (name + home line), start/stop ride with status states (searching / on vehicle / in tunnel / left), leaderboard, **city view** where each line's district grows (SVG/CSS, animated tier-ups). | Points from a ride visibly grow a building | T03, T05 |
| **T07** | A | **Delay detection** from alerts/predictions plus **`POST /api/delay/simulate`** demo switch. | Toggling simulate flips `/api/delay` for a chosen line | T02 |
| **T08** | B | **Simulator and demo mode.** Seeded riders that keep earning points across lines; simulated ride playback along real route shapes; `/api/demo/*` controls (start/stop sim, reset). | Demo runs with zero real riders; city visibly alive | T05 |
| **T09** | B | **Hunts.** `data/hunts.json` (6-8 stations, all `verified:false` until humans confirm), `/api/hunts`, `/api/hunts/complete` awards points and tokens. | Completing a clue awards points once only | T05 |
| **T10** | C | **Delay banner and hunt card UI.** On active delay near a station, show a hunt card with clues and tap-to-confirm. | Simulated delay -> card -> points | T07, T09 |

## P1: strong demo value

| ID | Owner | Task | Done when | Dep |
|---|---|---|---|---|
| **T11** | B | **Landmarks.** `data/landmarks.json` (about 15-20 near stops), `/api/landmarks`, `/api/landmarks/claim` with geofence. | Claim awards bonus once | T05 |
| **T12** | C | **Landmarks UI.** Markers on map, claim button when nearby. | Claim works from phone | T11 |
| **T13** | B | **CitiToken ledger and perks.** `token_ledger`, `/api/tokens`, rotating perk catalog with limited quantities, `/api/perks/redeem` returns a code. | Redeem deducts tokens and decrements stock | T05 |
| **T14** | C | **Perks UI.** Wallet balance, perk list with rotation countdown, redeem screen with QR code. | Redeem flow on phone | T13 |
| **T15** | A | **Hardening.** Error handling, rate limits, loading/empty states contract, `scripts/smoke.sh`, domain wired up (GoDaddy), perf check. | Smoke script passes on prod | T04, T07 |

## P2: only if P0 and P1 are solid (decide around Sat 10 PM)

| ID | Owner | Task |
|---|---|---|
| **T16** | B | **Solana devnet mint** of CitiToken awards (ledger stays source of truth, on-chain behind a flag), return tx signature, link to explorer. Devnet only, no real value. |
| **T17** | A | **Gemini photo check** for hunt clues (flagged, falls back to tap-to-confirm). |
| **T18** | A + C | **Tiger Data history** of vehicle positions and a delay-heatmap panel. |
| **T19** | B | **Meetups**: seeded static entries only. |

## Closing tasks

| ID | Owner | Task | By |
|---|---|---|---|
| **T20** | C | README, `docs/devpost-draft.md`, `docs/pitch.md` (3-min script, 1-min Q&A prep), `docs/grokbot-tasks.md` log. Draft early, update after each milestone. | Sun 5 AM |
| **T21** | all | **Integration pass**: full demo-path dry run, fix-only commits, no new features after Sun 2:30 AM. | Sun 3 AM |
| **T22** | humans | Record 1-minute video, verify hunt clues in person, submit Devpost and confirm "Submitted". | Sun 8 AM |

## Help list (when your lane is empty)
- A: review fixtures vs real responses; add missing error states.
- B: write seed data for more stations; test points edge cases (double-award, streaks).
- C: accessibility pass; empty/loading states; screenshot set for Devpost.
