#!/usr/bin/env bash
# Create the coordination labels. Safe to re-run.
set -euo pipefail

mk() { gh label create "$1" --color "$2" --description "$3" --force >/dev/null && echo "label: $1"; }

# who
mk "agent:A" "1d76db" "Platform and ride engine"
mk "agent:B" "5319e7" "Game logic, content, demo mode"
mk "agent:C" "0e8a16" "Frontend and polish"
mk "agent:any" "bfd4f2" "Any agent can take this"

# priority
mk "prio:P0" "b60205" "Demo does not exist without it"
mk "prio:P1" "d93f0b" "Strong demo value"
mk "prio:P2" "fbca04" "Only if time allows"
mk "prio:P3" "c2e0c6" "Fake or cut"

# status
mk "status:ready" "ededed" "Ready to claim"
mk "status:in-progress" "fef2c0" "Claimed and being worked"
mk "status:review" "c5def5" "PR open"
mk "status:blocked" "e11d21" "Waiting on something"
mk "status:done" "0e8a16" "Merged and verified"

# type
mk "type:task" "ffffff" "Planned task"
mk "type:handoff" "f9d0c4" "Dependency ready"
mk "type:contract" "d4c5f9" "API or shape change"
mk "type:request" "fad8c7" "Ask another lane to change something"
mk "type:bug" "ee0701" "Something broken"
mk "type:question" "cc317c" "Question"

# area
mk "area:platform" "bfdadc" "Scaffold, infra, deploy"
mk "area:mbta" "bfdadc" "MBTA data layer"
mk "area:rides" "bfdadc" "Ride verification"
mk "area:game" "bfdadc" "Points, districts, hunts, perks"
mk "area:demo" "bfdadc" "Simulator and demo mode"
mk "area:ui" "bfdadc" "Screens and design"
mk "area:docs" "bfdadc" "README, Devpost, pitch"

mk "needs-human" "000000" "A human must decide or act"
echo "labels done"
