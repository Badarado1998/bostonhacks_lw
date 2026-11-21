# AGENTS.md: T-City (BostonHacks 2026)

Shared rules for **every** agent (Claude Code, Codex, Cursor). Read all of it at startup and again whenever a human or issue says `RE-SYNC`. Product spec: `docs/KICKOFF.md`. Backlog: `docs/TASKS.md`. API contract: `docs/CONTRACTS.md`.

**Deadline:** submit on Devpost by **Sun Nov 22, 9:00 AM ET**. **Feature freeze: Sun 2:30 AM.** **Code freeze: Sun 6:00 AM** (bugfixes only after 2:30). A working live demo beats breadth.

## 1. Agents and lanes

| Agent | Tool / machine | Lane | Port |
|---|---|---|---|
| **A** | Claude, Landon's Mac (main worktree) | **Platform and ride engine**: scaffold, contracts, DB schema, MBTA data layer, ride verification, delay detection, deploy | 3001 |
| **B** | Codex, Landon's Mac (**separate git worktree**) | **Game logic, content and demo mode**: points, districts, hunts, landmarks, perks/tokens, simulator, seed data | 3002 |
| **C** | Claude, friend's Mac | **Frontend and product polish**: every screen, map, city view, design, README, Devpost, pitch | 3003 |

Sign every issue comment, PR title and commit with your tag: `[A]`, `[B]` or `[C]`. Your tag is in your startup prompt (`docs/AGENT_STARTUP_PROMPTS.md`). If you don't know it, ask the human.

## 2. Golden rules (merge-conflict prevention)

1. **Stay in your lane.** Only edit files you own (section 3). Need a change elsewhere? Open a `type:request` issue labeled for the owner. Don't do it yourself.
2. **Contract first.** Shapes live in `docs/CONTRACTS.md` and `src/contracts/`. Build against `src/contracts/fixtures.ts` (mock mode, `NEXT_PUBLIC_USE_MOCKS=1`) so you are never blocked on someone else's endpoint.
3. **Small and short-lived.** One branch per issue (`a/T04-ride-verify`), under about 45 minutes of work when possible. Pull `main` at task start and before every push. Merge fast, delete the branch.
4. **Rebase, don't merge.** `git pull --rebase origin main`. Squash-merge PRs. Never merge `main` into your branch.
5. **Never reformat.** No repo-wide prettier or lint `--fix` runs. Format only files you own, and only lines you touch.
6. **Lockfile conflicts:** take `main`'s `package-lock.json`, re-run `npm install`, commit. Never hand-merge it.
7. **Dependencies:** adding one is a tiny PR (`package.json` + lockfile only), merged immediately and announced in issue #1. No heavy deps without an issue.
8. **DB migrations are Agent A only**, timestamp-named in `db/migrations/`. Others request schema via `type:request`.
9. **Never:** force-push `main`, rewrite shared history, commit `.env*` (only `.env.example`), delete others' files, or leave `main` failing `npm run typecheck`.
10. **Two agents on one Mac (A and B):** always work in your own worktree and run your own port. Never share a working directory.

## 3. File ownership

| Owner | Paths |
|---|---|
| **A** | `src/contracts/**`, `db/**`, `src/server/mbta/**`, `src/server/rides/**`, `src/server/delay/**`, `src/app/api/{vehicles,routes,stops,rides,delay,riders,health}/**`, `.github/**`, `scripts/**`, `next.config.*`, `vercel.json`, `package.json`, lockfile (via rule 7) |
| **B** | `src/server/{points,districts,hunts,landmarks,perks,tokens,sim}/**`, `src/app/api/{points,leaderboard,districts,hunts,landmarks,perks,tokens,demo}/**`, `data/**`, `scripts/sim/**` |
| **C** | `src/app/(app)/**`, `src/components/**`, `src/styles/**`, `public/**`, `README.md`, `docs/design.md`, `docs/devpost-draft.md`, `docs/pitch.md`, `docs/grokbot-tasks.md` |
| **Shared (via issue + tiny PR)** | `docs/CONTRACTS.md`, `docs/TASKS.md`, `AGENTS.md` |

A route or feature that isn't listed belongs to the agent whose lane it is closest to. When in doubt, ask in issue #1.

## 4. Git workflow
```
git fetch origin && git pull --rebase origin main     # start of every task
git switch -c a/T04-ride-verify                       # <tag>/<task-id>-<slug>
# work, commit often: "[A] T04: match GPS to vehicle"
npm run typecheck && npm run lint                     # must pass
git pull --rebase origin main && git push -u origin HEAD
gh pr create --fill --title "[A] T04: ride verification" --body "Closes #<issue>"
gh pr merge --squash --delete-branch
```
If the rebase conflicts in a file you don't own, **stop**, keep their version, and open a `type:request` issue. If it's in your own file, resolve it carefully.

## 5. GitHub issues protocol

Issues are the only agent-to-agent channel. Issue **#1 "Coordination Log"** is for broadcasts (deps added, contract changes, freezes, outages).

**Labels:** `agent:A|B|C|any`, `area:*`, `prio:P0|P1|P2|P3`, `status:ready|in-progress|review|blocked|done`, `type:task|handoff|contract|request|bug|question`, `needs-human`.

- **Find work:** `gh issue list --state open --label "agent:<you>" --label status:ready --json number,title,labels` then take the lowest `prio`, then lowest task id. Task issue titles start with `[Txx]`.
- **Claim:** comment `[A] CLAIMED`, swap label to `status:in-progress`.
- **Blocked:** label `status:blocked`, comment what you need and from whom, then **move to the next task** (use fixtures). Never sit idle.
- **Handoff:** when you finish something another agent depends on, comment on the dependent issue and on #1:
  ```
  [B] HANDOFF -> C   (#12, PR #34 merged)
  Ready: GET /api/leaderboard
  Try: curl localhost:3002/api/leaderboard
  Contract changes: none   (or: see CONTRACTS.md section 4)
  Gotchas: ...
  ```
- **Contract change:** needs a `type:contract` issue, a PR touching only `docs/CONTRACTS.md`, `src/contracts/**` and fixtures, merged within minutes and announced in #1. Don't change shapes silently.
- **Done:** PR merged, comment `[X] DONE` with what to test, label `status:done`, close the issue.
- **Poll cadence:** check for new issues and comments at every task boundary, and at least every 15 minutes during long tasks: `gh issue list --state open --json number,title,labels,updatedAt --limit 100` and `gh issue view 1 --comments | tail -40`.
- **Humans:** label `needs-human` and comment concisely (what, why, options). Humans check these about every 30 minutes.

## 6. Work loop
1. Sync (pull, read new issues/comments).
2. Pick the highest-priority ready task in your lane (section 5).
3. Claim, branch, build against fixtures if needed.
4. Verify: typecheck, lint, run it, test on a phone-sized viewport if UI.
5. PR, merge, handoff, close.
6. Repeat. If your lane is empty, post in #1 and take an `agent:any` task or pick from the help list in `docs/TASKS.md`.

## 7. Quality bar
- Every merged change keeps the demo path working: ride -> points -> city grows -> delay -> hunt -> perk.
- Mobile-first and accessible (contrast, tap targets of at least 44 px, labels).
- No secrets in code or logs. `.env.example` lists every variable.
- Anything physical (station clues) must be marked `verified: false` until a human has verified it in person. Do not invent physical details.
- Demo mode (simulated riders, simulated delay) must always work offline of real trains.

## 8. Timeline checkpoints (ET)
| Time | Milestone |
|---|---|
| Sat 2:00 PM | T01 scaffold deployed, contracts and fixtures merged |
| Sat 6:00 PM | Live map, ride verification, points and leaderboard working end to end |
| Sat 10:00 PM | City view, delay and hunt flow, simulator working |
| Sun 2:30 AM | **Feature freeze**: perks, tokens, landmarks done or cut |
| Sun 6:00 AM | **Code freeze**; video recorded, README and Devpost draft final |
| Sun 8:00 AM | Submitted and confirmed "Submitted" (not Draft) |
