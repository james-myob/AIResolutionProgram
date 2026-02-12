# Product Requirements Document: AI Resolution Tracker

## Overview
A web app that tracks progress through the 10-weekend AI Resolution Program, monitors 4 personal resolutions, and provides intelligent feedback on progress.

## Problem
The program has 11 missions, 4 resolutions, and 11+ team members to keep track of. Markdown checklists work for planning but don't give you a living view of where things stand — and they can't remind you, visualise trends, or show your team's progress at a glance.

## Users
- **Primary:** James (program participant, team lead)
- **Secondary:** Team members (11+) who are also completing the program

## Core Features (MVP)

### 1. Mission Tracker
- List of all 11 missions (10 weekends + bonus) with status
- Status options: Not Started, In Progress, Complete
- Completion checkbox per mission
- Notes field per mission (free text — what I built, what I learned)
- Due date per mission (weekend deadline)
- Overall progress bar (X/11 complete)

### 2. Resolution Dashboard
- 4 resolutions displayed as cards with progress indicators
- **Resolution 1 (Missions on time):** Auto-calculated from mission completion dates vs deadlines
- **Resolution 2 (New tools):** Log of new tools used — name, mission, task, strengths, weaknesses (target: 3+)
- **Resolution 3 (Team success):** Grid of team members x missions with completion checkmarks
- **Resolution 4 (Team culture):** Log of demo sessions — date, did I demo, ripple effect noted

### 3. Progress Visualisation
- Overall progress bar across all missions
- Per-resolution progress indicators (e.g. 2/3 tools logged, 7/10 demos done)
- Team progress summary (e.g. "8/11 team members have completed 5+ missions")

### 4. Notes & Logging
- Free-text notes per mission
- Ability to log updates against each resolution
- Timestamp on all entries

## Advanced Features (Post-MVP)
- **User authentication** — team members can log their own progress
- **PWA support** — mobile access without app store
- **Automated check-in prompts** — weekly reminders
- **"Suggest next weekend" logic** — based on what's incomplete
- **Sentiment analysis** — on progress update text
- **Time tracking** — how long each mission took

## Out of Scope (for now)
- AI chatbot interaction (could be Mission 10)
- Notification/email system
- Integration with external tools (Notion, Slack)
- Admin panel for managing multiple cohorts

## Success Criteria
- App is live on the internet (deployed, accessible via URL)
- Weekend 1 is logged as "Complete" in the app
- I trust I'll actually use it week-to-week (it's faster than updating markdown)

## Key Metrics
| Metric | Target |
|---|---|
| Missions completed on time | 11/11 |
| New tools logged | 3+ |
| Team members at 10/10 | 11+ |
| Demo sessions held | 10/10 |
