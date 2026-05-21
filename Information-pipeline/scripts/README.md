# Pipeline scripts

> Small utility scripts that support the daily/weekly/monthly runs. These are stepping stones to Mission 7's full automation — designed to be runnable both manually (Tier 1) and from a cron / GitHub Action (Tier 3).

---

## `send-briefing.py`

Send a daily briefing Markdown file as an HTML email via [Resend](https://resend.com).

### Setup

1. **Get a Resend API key** at https://resend.com/api-keys.
2. **(Optional) Verify a sending domain** in the Resend dashboard so emails come from your own domain instead of the default `onboarding@resend.dev`. Without verification the default sender works fine for send-to-self but may land in spam first time.
3. **Export the key**:
   ```bash
   export RESEND_API_KEY=re_xxx
   ```
   Or, in a GitHub Action: store as a repo secret named `RESEND_API_KEY`.

### Usage

```bash
# Send the 20 May 2026 briefing to the default recipient (james.peck@myob.com)
python3 Information-pipeline/scripts/send-briefing.py Information-pipeline/daily/2026-05-20.md

# Send to a different recipient
python3 Information-pipeline/scripts/send-briefing.py Information-pipeline/daily/2026-05-20.md --to=other@example.com

# Use a verified sender once you've added your own domain
BRIEFING_FROM="Daily AI Briefing <briefing@yourdomain.com>" \
  python3 Information-pipeline/scripts/send-briefing.py Information-pipeline/daily/2026-05-20.md
```

### What it does

- Parses YAML front-matter from the daily Markdown file (date, read_time_min, items, sources_scanned).
- Builds a subject line like `Daily AI Briefing — Wed 20 May 2026`.
- Converts the Markdown body to HTML with the `markdown` library (tables, fenced code, sane lists).
- Wraps the HTML in an email-safe stylesheet (system fonts, 700px max width, GitHub-ish link colour).
- Posts to `https://api.resend.com/emails` with both `html` and `text` parts.
- Prints the Resend message ID on success.

### Environment variables

| Variable | Required? | Default |
|---|---|---|
| `RESEND_API_KEY` | Yes | — |
| `BRIEFING_TO` | No | `james.peck@myob.com` |
| `BRIEFING_FROM` | No | `Daily AI Briefing <onboarding@resend.dev>` |

### Mission 7 hook

The script is shaped so it slots straight into a GitHub Action / Vercel cron without changes — pass the path to today's freshly-generated daily Markdown file, the script does the rest. The full Mission 7 cron will look roughly like:

```yaml
- name: Generate daily briefing
  run: node scripts/generate-daily.mjs $(date -u +%Y-%m-%d) > Information-pipeline/daily/$(date -u +%Y-%m-%d).md
- name: Email briefing
  env:
    RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
  run: python3 Information-pipeline/scripts/send-briefing.py Information-pipeline/daily/$(date -u +%Y-%m-%d).md
```
