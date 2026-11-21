#!/usr/bin/env bash
# Create issue #1 (Coordination Log) and one issue per task in docs/TASKS.md.
# Run ONCE, from the repo root, after setup-labels.sh.
set -euo pipefail

gh issue create --title "Coordination Log (broadcasts only)" --label "agent:any,type:task,status:in-progress" --body \
"Broadcast channel for all agents. Post here: dependency added, contract changed, freeze announcements, outages, big handoffs. Keep it short and sign with [A]/[B]/[C]. Task discussion goes in the task's own issue. Protocol: AGENTS.md section 5."

# mk ID "Title" "labels" "Dep" "Done when"
mk() {
  gh issue create --title "[$1] $2" --label "$3,status:ready,type:task" --body \
"Spec: docs/TASKS.md ($1). Contracts: docs/CONTRACTS.md.

**Depends on:** $4 (build against src/contracts/fixtures.ts if not merged yet)
**Done when:** $5

Workflow: comment \`CLAIMED\`, branch \`<tag>/$1-slug\`, PR with \`Closes #<this>\`, then comment \`DONE\` + handoff." >/dev/null
  echo "created $1"
}

# P0
mk T01 "Scaffold, deploy, contracts, fixtures"        "agent:A,prio:P0,area:platform" "none" "main deployed on HTTPS; /api/health ok; fixtures importable; announced in #1"
mk T02 "MBTA data layer (vehicles/routes/stops/alerts)" "agent:A,prio:P0,area:mbta" "T01" "live vehicles for all team lines in contract shape, cached 5s, key server-side"
mk T03 "App shell and live vehicle map"                "agent:C,prio:P0,area:ui" "T01" "phone-sized screen shows moving vehicles"
mk T04 "Ride verification (GPS to vehicle, tunnel grace)" "agent:A,prio:P0,area:rides" "T02" "real Green-B ride binds to correct vehicle; tunnel gap keeps session"
mk T05 "Points ledger, leaderboard, districts"         "agent:B,prio:P0,area:game" "T01" "awarding points moves leaderboard and lot tiers"
mk T06 "Ride screen and city view"                     "agent:C,prio:P0,area:ui" "T03, T05" "points from a ride visibly grow a building"
mk T07 "Delay detection and simulate switch"           "agent:A,prio:P0,area:mbta" "T02" "simulate toggle flips /api/delay for a chosen line"
mk T08 "Simulator and demo mode"                       "agent:B,prio:P0,area:demo" "T05" "demo runs with zero real riders; city visibly alive"
mk T09 "Hunts (data, API, completion)"                 "agent:B,prio:P0,area:game" "T05" "clue completion awards once only; all clues verified:false until humans confirm"
mk T10 "Delay banner and hunt card UI"                 "agent:C,prio:P0,area:ui" "T07, T09" "simulated delay -> hunt card -> points"
# P1
mk T11 "Landmarks (data, API, claim)"                  "agent:B,prio:P1,area:game" "T05" "claim awards bonus once, geofenced"
mk T12 "Landmarks UI"                                  "agent:C,prio:P1,area:ui" "T11" "claim works from phone"
mk T13 "CitiToken ledger and rotating perks"           "agent:B,prio:P1,area:game" "T05" "redeem deducts tokens and stock"
mk T14 "Perks UI and redeem QR"                        "agent:C,prio:P1,area:ui" "T13" "redeem flow works on phone"
mk T15 "Hardening, smoke script, domain"               "agent:A,prio:P1,area:platform" "T04, T07" "scripts/smoke.sh passes on prod; domain live"
# P2
mk T16 "Solana devnet mint of CitiToken awards"        "agent:B,prio:P2,area:game" "T13" "tx signature returned and linked; flagged; devnet only"
mk T17 "Gemini photo check for hunts"                  "agent:A,prio:P2,area:rides" "T09" "photo check with tap-to-confirm fallback"
mk T18 "Tiger Data vehicle history and delay heatmap"  "agent:any,prio:P2,area:platform" "T02" "history table and one heatmap panel"
mk T19 "Seeded meetups"                                "agent:B,prio:P3,area:game" "T05" "2-3 static entries shown"
# Closing
mk T20 "README, Devpost draft, pitch, Grok Bot log"    "agent:C,prio:P1,area:docs" "milestones" "drafts exist by Sun 5 AM and match the shipped product"
mk T21 "Integration pass (feature freeze Sun 2:30 AM)" "agent:any,prio:P0,area:platform" "all P0/P1" "full demo path dry-run passes; fix-only commits afterwards"
mk T22 "Video, verify clues in person, submit Devpost" "agent:any,prio:P0,area:docs" "T21" "status shows Submitted before 9 AM Sunday (HUMANS)"

echo "issues seeded"
