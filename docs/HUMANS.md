# HUMANS.md: setup checklist (about 20 minutes)

## 0. Decide on Cursor now (SpaceXSI raffle)
The raffle requires **Cursor as your core AI coding agent** plus a Grok Bot automation, and you must say how you used both on Devpost. A Claude + Codex + Claude setup does not qualify as written. Options:
- Run one of the three lanes **inside Cursor** (it can use many models). Agents are tool-agnostic here, so any lane can be swapped to Cursor.
- Or skip the raffle and don't claim it on Devpost.
Don't claim Cursor or Grok Bot use you didn't actually do.

## 1. Repo (one person)
```
gh repo create tcity --public --clone && cd tcity
# copy this folder's contents into the repo root, plus the kickoff prompt:
cp /path/to/CURSOR_KICKOFF_PROMPT.md docs/KICKOFF.md
git add -A && git commit -m "Coordination files" && git push -u origin main
gh repo edit --add-collaborator <friend-username>   # or add via the GitHub web UI
```
The repo must be **public** and all work must be created during the event.

## 2. Both machines
```
gh auth login            # both people
git clone https://github.com/<owner>/tcity.git
```
Share secrets (`.env.local`: MBTA key, DB URL, Gemini key) over a password manager or AirDrop, **never git**.

## 3. Labels and issues (one person, once)
```
bash scripts/setup-labels.sh
bash scripts/seed-issues.sh        # creates #1 Coordination Log, then T01-T22
```

## 4. Landon's Mac: two agents, two worktrees
```
cd tcity                                   # Agent A lives here (port 3001)
git worktree add ../tcity-b -b b/base      # Agent B lives here (port 3002)
```
Start Claude Code in `tcity/` (reads `CLAUDE.md`) and Codex in `tcity-b/` (reads `AGENTS.md`). Paste the matching prompt from `docs/AGENT_STARTUP_PROMPTS.md`. Friend starts Claude Code in his clone (port 3003) with the Agent C prompt.

## 5. Keep the Macs awake
```
caffeinate -dimsu &        # display, idle, disk, system sleep; stop with: killall caffeinate
```
- Stay **plugged in**. Lid closed sleeps the Mac unless you use an external display.
- Disable auto-lock in System Settings, and use reliable Wi-Fi (venue Wi-Fi drops; keep a phone hotspot ready).
- Agents are only as unattended as their permission settings. Pre-approve `git`, `gh`, `npm` and file edits in your project settings, and only run permissive modes inside this project folder.

## 6. Your recurring checks (about every 30 minutes)
- `gh issue list --label needs-human` and reply.
- `gh issue view 1 --comments | tail -30` for the coordination log.
- Pull `main`, run the demo path on your phone.
- Verify station hunt clues in person and flip `verified` to `true` in `data/hunts.json` (ask Agent B via a `type:request`).

## 7. Bonus-prize tasks (human)
- Get the MBTA API key (api-v3.mbta.com/register), claim the xAI promo, register the GoDaddy domain with `MLHBH69`.
- Grok Bot: set up an automation (e.g. QA the deployed site and file issues), log it in `docs/grokbot-tasks.md`.
- Opt in to the SpaceXSI raffle on Devpost. After the event, post on DEV for the writing prize.
- Submit on Devpost before 9:00 AM Sunday and confirm the status says **Submitted**.
