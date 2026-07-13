# Publisher — auto-publish daily briefs to Confluence

The publisher takes any Markdown daily brief committed to `Information-pipeline/daily/`
and posts it to Confluence as a child of the [Daily briefs](https://myobconfluence.atlassian.net/wiki/spaces/~712020456db008c5c746a684901e35cea3e13a/pages/12031984216/Daily+briefs) container. It then refreshes the homepage, the Tags index, and every tag page so counts and issue lists stay current.

This runs as a GitHub Action ([`.github/workflows/publish-daily-brief.yml`](../../.github/workflows/publish-daily-brief.yml)) on every push that touches `daily/*.md` or the publisher code itself, from any branch. Nothing else needs to happen — the routine that writes the Markdown into a branch is now the only manual step; publishing is automatic.

## First-time setup (~2 minutes)

The workflow needs two GitHub Actions secrets set on this repository.

### 1. Create an Atlassian API token

Go to https://id.atlassian.com/manage-profile/security/api-tokens and click **Create API token**. Copy the token — you can't see it again after this page.

### 2. Add the two secrets to the repo

In the GitHub repository settings → **Secrets and variables** → **Actions** → **New repository secret**, add:

| Name | Value |
|---|---|
| `CONFLUENCE_EMAIL` | `james.peck@myob.com` |
| `CONFLUENCE_API_TOKEN` | the token from step 1 |

That's it. The next `git push` that touches `Information-pipeline/daily/*.md` will publish automatically.

## Files

| File | Purpose |
|---|---|
| [`convert.py`](convert.py) | Markdown → Confluence HTML for a single daily brief. |
| [`aggregate.py`](aggregate.py) | Cross-issue index by tag — powers the tag pages and homepage sidebar. |
| [`render.py`](render.py) | HTML generators for the homepage, Daily briefs archive, Tags index, and tag pages. |
| [`confluence.py`](confluence.py) | Thin client over the Confluence v2 REST API (basic auth with API token). |
| [`publish.py`](publish.py) | Entry point. Idempotent: safe to run on every push. |
| [`requirements.txt`](requirements.txt) | Python deps (just `requests`). |

## Local dev

To run the publisher against a real Confluence site from your laptop:

```bash
cd Information-pipeline/publisher
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export CONFLUENCE_EMAIL=james.peck@myob.com
export CONFLUENCE_API_TOKEN=<paste token>

python publish.py --dry-run          # preview what would change
python publish.py                    # do it
python publish.py --force-refresh    # rebuild nav even if no new issues
```

## What the workflow does, step by step

1. **Checkout the branch.** GitHub Action checks out whatever ref triggered it.
2. **Scan `Information-pipeline/daily/*.md`.** Every `.md` file in this directory is a candidate issue.
3. **Check Confluence for existing pages.** For each candidate, the publisher searches Confluence via CQL for a page with the same title in James's personal space. If the page already exists, it's skipped. If not, it's created as a child of Daily briefs.
4. **Refresh navigation (if safe).** After any new issue is published, the publisher checks whether this branch has the FULL corpus of markdowns (`local_files >= confluence_children`). If so, it rebuilds:
   - the Daily briefs archive table
   - the AI Daily Brief homepage (latest issues + tag sidebar with counts)
   - the Tags index page
   - every existing tag page (issues list + counts)

   If this branch has fewer markdowns than what's already published (typical for feature branches that only carry one new day's file), the nav refresh is **skipped** to avoid destructive rebuild. The new page(s) are still published — only the nav pages stay one refresh behind.

The whole thing is idempotent — running it twice in a row does nothing the second time (unless a new markdown was added).

## Feature-branch → main pattern

The daily-generation automation writes markdown to a feature branch. If the branch is **never merged to main**, main only ever carries a partial subset of daily briefs. That means:

- New issues will still publish correctly on every feature-branch push.
- Nav refresh will be skipped for those runs (see step 4 above).
- Homepage counts and tag pages will drift out of date until a full refresh happens.

To keep nav in sync, do one of:

1. **Merge feature branches to main** after they publish. Once main has all daily files, a push to main will refresh nav automatically.
2. **Manually trigger `workflow_dispatch`** from a branch that includes all markdowns. From the Actions tab in GitHub, pick "Publish daily brief to Confluence", choose the branch, and run.

Long term the cleanest pattern is (1) — merge every feature branch to main after its publish succeeds.

## Adding a new tag page

When a new entity or theme starts showing up regularly (roughly ≥3 items across the corpus), it's worth giving it its own tag page. To do that:

1. Create the page manually in Confluence UI as a child of the [Tags index](https://myobconfluence.atlassian.net/wiki/spaces/~712020456db008c5c746a684901e35cea3e13a/pages/12026511459/Tags+AI+Daily+Brief) — any body content will do; the publisher will overwrite it.
2. Look up the new page's ID (visible in the URL).
3. Add the entry to `EXISTING_TAG_PAGES` in [`confluence.py`](confluence.py).
4. Commit + push. The next workflow run will populate the tag page.

## Troubleshooting

**Workflow fails with "CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must both be set"** — you haven't set the secrets. See "First-time setup" above.

**Workflow fails with a 401 from Confluence** — the API token was revoked or the email doesn't match the token's owner. Regenerate the token and update the secret.

**A daily brief was published but never showed up on Confluence** — check the Actions tab for the failing run. Common causes: the workflow was skipped because the push touched only files outside the `paths:` filter (see [`.github/workflows/publish-daily-brief.yml`](../../.github/workflows/publish-daily-brief.yml)).

**Duplicate page created** — shouldn't happen, but if it does, delete the duplicate manually. The publisher uses CQL title lookup; if two pages have the same title it picks the first result.
