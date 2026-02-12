# Design & Information Architecture: AI Resolution Tracker

## Information Architecture

```
AI Resolution Tracker
│
├── Dashboard (home)
│   ├── Overall Progress Bar (X/11 missions)
│   ├── Resolution Cards (4 cards, each with mini-progress)
│   └── Next Up (next incomplete mission)
│
├── Missions
│   ├── Mission List (11 rows, sortable by status)
│   └── Mission Detail
│       ├── Status toggle
│       ├── Due date
│       ├── Notes editor
│       └── Completion timestamp
│
└── Resolutions
    ├── Resolution 1: Missions on Time (auto-linked to missions)
    ├── Resolution 2: New Tools Log (add/edit/view entries)
    ├── Resolution 3: Team Progress Grid (members x missions)
    └── Resolution 4: Demo Sessions Log (10 sessions)
```

## Wireframes (ASCII)

### Dashboard (`/`)

```
┌─────────────────────────────────────────────────────────┐
│  AI Resolution Tracker                                  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Overall Progress              7/11 missions  64% │  │
│  │  ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │ ✅ Missions On Time │  │ 🛠 New AI Tools         │   │
│  │                     │  │                         │   │
│  │    7/11 on time     │  │    2/3 logged           │   │
│  │    ██████████░░░░░  │  │    ████████████░░░░░░░  │   │
│  │                     │  │                         │   │
│  │  Next: Weekend 8    │  │  Last: Cursor (Wk 5)   │   │
│  └─────────────────────┘  └─────────────────────────┘   │
│                                                         │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │ 👥 Team Progress    │  │ 🎤 Demo Sessions        │   │
│  │                     │  │                         │   │
│  │  9/11 on track      │  │    7/10 done            │   │
│  │  ██████████████░░░  │  │    ██████████████░░░░░  │   │
│  │                     │  │                         │   │
│  │  2 members behind   │  │  Next: Weekend 8 demo   │   │
│  └─────────────────────┘  └─────────────────────────┘   │
│                                                         │
│  ── Next Up ──────────────────────────────────────────  │
│  │ Weekend 8: Second Automation          Due: Mar 15 │  │
│  │ Build productivity workflow automation            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Missions List (`/missions`)

```
┌─────────────────────────────────────────────────────────┐
│  Missions                                    7/11 done  │
│                                                         │
│  ┌─ Foundation ────────────────────────────────────────┐ │
│  │ [✓]  Day 0: Setup              ✅ Complete  Jan 18 │ │
│  │ [✓]  Wk 1: Resolution Tracker  ✅ Complete  Jan 25 │ │
│  │ [✓]  Wk 2: Model Topography    ✅ Complete  Feb 1  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─ Core Projects ────────────────────────────────────┐  │
│  │ [✓]  Wk 3: Deep Research       ✅ Complete  Feb 8  │ │
│  │ [✓]  Wk 4: Data Analysis       ✅ Complete  Feb 15 │ │
│  │ [✓]  Wk 5: Visual Explainer    ✅ Complete  Feb 22 │ │
│  │ [✓]  Wk 6: Info Pipeline       ✅ Complete  Mar 1  │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─ Automation ───────────────────────────────────────┐  │
│  │ [ ]  Wk 7: First Automation    🔵 In Progress     │  │
│  │ [ ]  Wk 8: Second Automation   ⚪ Not Started     │  │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─ System & Build ───────────────────────────────────┐  │
│  │ [ ]  Wk 9: Context OS          ⚪ Not Started     │  │
│  │ [ ]  Wk 10: AI-Powered Build   ⚪ Not Started     │  │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  ┌─ Bonus ────────────────────────────────────────────┐  │
│  │ [ ]  Agent Evaluation           ⚪ Not Started     │  │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Mission Detail (`/missions/[id]`)

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Missions                                     │
│                                                         │
│  Weekend 5: Visual Explainer                            │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Status:   [✅ Complete ▾]     Due: Feb 22              │
│  Completed: Feb 21, 2026                                │
│                                                         │
│  ── Notes ──────────────────────────────────────────── │
│  │ Built an infographic comparing AI model pricing    │ │
│  │ using Canva AI. Tried Midjourney for the first     │ │
│  │ time for custom illustrations — it was great for   │ │
│  │ abstract concepts but terrible for charts.         │ │
│  │                                                    │ │
│  │ Key learning: visual AI tools are best for         │ │
│  │ inspiration, not precision.                        │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
│  ── Mission Brief ────────────────────────────────────  │
│  Create infographics and visual explainers using AI     │
│  vision tools...                                        │
│                                                         │
│  ── Done When ────────────────────────────────────────  │
│  One infographic you'd actually use.                    │
└─────────────────────────────────────────────────────────┘
```

### Team Progress Grid (`/resolutions/team`)

```
┌─────────────────────────────────────────────────────────┐
│  Team Progress                          9/11 on track   │
│                                                         │
│           M1  M2  M3  M4  M5  M6  M7  M8  M9  M10     │
│  ─────────────────────────────────────────────────────  │
│  Alice    ✅  ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   7/10 │
│  Bob      ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   ·   6/10 │
│  Carol    ✅  ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   7/10 │
│  Dan      ✅  ✅  ✅  ✅  ·   ·   ·   ·   ·   ·   4/10 │
│  Eve      ✅  ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   7/10 │
│  Frank    ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   ·   6/10 │
│  Grace    ✅  ✅  ✅  ✅  ✅  ·   ·   ·   ·   ·   5/10 │
│  Hiro     ✅  ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   7/10 │
│  Iris     ✅  ✅  ✅  ·   ·   ·   ·   ·   ·   ·   3/10 │
│  Jake     ✅  ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   7/10 │
│  Kim      ✅  ✅  ✅  ✅  ✅  ✅  ·   ·   ·   ·   6/10 │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ⚠ Needs attention: Dan (4/10), Iris (3/10)            │
│                                                         │
│  [+ Add Team Member]                                    │
└─────────────────────────────────────────────────────────┘
```

### New Tools Log (`/resolutions/tools`)

```
┌─────────────────────────────────────────────────────────┐
│  New AI Tools Explored                       2/3 target │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 1. Cursor                           Weekend 3     │  │
│  │    Task: Built research brief with AI pair coding  │  │
│  │    ✅ Great at: Code generation from natural lang  │  │
│  │    ⚠ Falls short: Gets confused on large files    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 2. Midjourney                       Weekend 5     │  │
│  │    Task: Generated custom illustrations            │  │
│  │    ✅ Great at: Abstract/creative visuals          │  │
│  │    ⚠ Falls short: Precision, charts, text         │  │
│  └────────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  │ 3. (next tool)                      Log one more  │  │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                                         │
│  [+ Log New Tool]                                       │
└─────────────────────────────────────────────────────────┘
```

### Demo Sessions Log (`/resolutions/demos`)

```
┌─────────────────────────────────────────────────────────┐
│  Team Demo Sessions                      7/10 complete  │
│                                                         │
│  #   Mission                  Date     Ripple Effect    │
│  ──────────────────────────────────────────────────────  │
│  1   Wk 1: Tracker           Jan 27   Bob started his  │
│  2   Wk 2: Model Topography  Feb 3    Team adopted     │
│  3   Wk 3: Deep Research     Feb 10   Carol tried      │
│  4   Wk 4: Data Analysis     Feb 17   3 people asked   │
│  5   Wk 5: Visual Explainer  Feb 24   Hiro used Canva  │
│  6   Wk 6: Info Pipeline     Mar 3    Team set up      │
│  7   Wk 7: First Automation  Mar 10   —                │
│  8   Wk 8: Second Automation  ·       —                │
│  9   Wk 9: Context OS         ·       —                │
│  10  Wk 10: AI Build          ·       —                │
│  ──────────────────────────────────────────────────────  │
│                                                         │
│  🎯 Ripple effect goal: 3+ sessions where someone      │
│     tried something new → currently at 4/3 ✅           │
└─────────────────────────────────────────────────────────┘
```

## Design Principles

1. **Glanceable** — The dashboard tells you where you stand in 3 seconds
2. **Low friction** — Checking off a mission or logging a tool should take <30 seconds
3. **Honest** — Show what's behind, not just what's ahead. Surface "needs attention" items
4. **Personal** — This is your tracker, not a corporate dashboard. Keep it warm and motivating
5. **Progressive** — Start simple (missions + checkboxes), layer in resolution tracking as you go

## Visual Style

| Element | Choice |
|---|---|
| **Typography** | System font stack (Inter if custom) — clean, readable |
| **Colours** | Muted palette with one accent colour for progress. Green for complete, amber for in-progress, grey for not started |
| **Layout** | Single column on mobile, 2-column cards on desktop |
| **Spacing** | Generous — this is a weekly-use tool, not a dense dashboard |
| **Tone** | Encouraging but not cheesy. No confetti. A quiet "nice" when something completes |

## Navigation

```
[Dashboard]  [Missions]  [Resolutions ▾]
                          ├── Tools Log
                          ├── Team Progress
                          └── Demo Sessions
```

Simple top nav. Three items. Resolutions has a dropdown for its sub-pages.
