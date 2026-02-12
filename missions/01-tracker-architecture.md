# Technical Architecture: AI Resolution Tracker

## Recommended Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js (React) | Fast to scaffold with AI tools, built-in routing, easy deploy |
| **Styling** | Tailwind CSS | Rapid UI development, works great with AI code generation |
| **Database** | Supabase (PostgreSQL) | Free tier, real-time, auth built-in, easy to set up |
| **Hosting** | Vercel | Zero-config deploy for Next.js, free tier |
| **Auth (post-MVP)** | Supabase Auth | Already bundled, supports email/magic link |

**Alternative if using vibe-coding tools:**
- Replit Agent or Lovable can scaffold this entire stack from a prompt
- Cursor can generate it file-by-file with more control

## Data Model

### Tables

```
missions
├── id              (uuid, primary key)
├── number          (int, 0-11)
├── title           (text) — e.g. "Resolution Tracker"
├── description     (text) — brief summary
├── status          (enum: not_started | in_progress | complete)
├── due_date        (date) — weekend deadline
├── completed_at    (timestamp, nullable)
├── notes           (text, nullable)
├── created_at      (timestamp)
└── updated_at      (timestamp)

resolutions
├── id              (uuid, primary key)
├── number          (int, 1-4)
├── title           (text)
├── target          (text) — e.g. "11/11 missions"
├── current_value   (int) — auto-calculated or manual
└── updated_at      (timestamp)

new_tools_log (Resolution 2)
├── id              (uuid, primary key)
├── tool_name       (text)
├── mission_id      (uuid, FK → missions)
├── task_used_for   (text)
├── strengths       (text)
├── weaknesses      (text)
└── logged_at       (timestamp)

team_members
├── id              (uuid, primary key)
├── name            (text)
└── created_at      (timestamp)

team_progress (Resolution 3)
├── id              (uuid, primary key)
├── team_member_id  (uuid, FK → team_members)
├── mission_id      (uuid, FK → missions)
├── completed       (boolean, default false)
└── completed_at    (timestamp, nullable)

demo_sessions (Resolution 4)
├── id              (uuid, primary key)
├── session_number  (int, 1-10)
├── mission_id      (uuid, FK → missions)
├── date            (date, nullable)
├── did_demo        (boolean, default false)
├── ripple_effect   (text, nullable) — "one thing someone asked or tried"
└── created_at      (timestamp)
```

## Page Structure

```
/                       → Dashboard (progress overview, resolution cards)
/missions               → All 11 missions list with status
/missions/[id]          → Single mission detail + notes editor
/resolutions            → 4 resolution cards with detailed tracking
/resolutions/tools      → New tools log (Resolution 2)
/resolutions/team       → Team progress grid (Resolution 3)
/resolutions/demos      → Demo session log (Resolution 4)
```

## API Routes (Next.js API routes or Supabase direct)

```
GET    /api/missions          → List all missions
PATCH  /api/missions/[id]     → Update mission status/notes
GET    /api/resolutions       → Get resolution summaries
POST   /api/tools             → Log a new tool
GET    /api/team              → Get team progress grid
PATCH  /api/team/[memberId]   → Toggle mission completion for member
GET    /api/demos             → Get demo sessions
PATCH  /api/demos/[id]        → Update demo session
```

## Key Architecture Decisions

1. **Server-side rendering not needed** — this is a personal tracker, not SEO-critical. Client-side rendering is fine.
2. **No auth for MVP** — single user. Add Supabase Auth later if team members need their own logins.
3. **Supabase as backend** — avoids building a custom API. Direct client-to-database with row-level security later.
4. **Pre-seed mission data** — the 11 missions are known upfront. Seed them on first load or via a migration script.
5. **Responsive but not mobile-first** — most usage will be on laptop during weekend missions. PWA is a stretch goal.

## Deployment Flow

```
Local dev (Next.js) → Push to GitHub → Vercel auto-deploys
                            ↓
                     Supabase (hosted DB)
```

## MVP Build Order

1. Set up Next.js project + Tailwind
2. Create Supabase project + tables
3. Build dashboard page (progress bar + resolution cards)
4. Build missions list page (checkboxes + status)
5. Build mission detail page (notes editor)
6. Build resolution detail pages (tools log, team grid, demo log)
7. Seed mission data
8. Deploy to Vercel
9. Log Weekend 1 as complete
