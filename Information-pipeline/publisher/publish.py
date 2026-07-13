#!/usr/bin/env python3
"""Publish AI Daily Brief markdown to Confluence.

Idempotent: runs safely on every push. It:
  1. Scans Information-pipeline/daily/*.md
  2. For each markdown that doesn't yet have a matching Confluence page,
     converts to HTML and creates the page as a child of the Daily briefs
     container.
  3. After any new publish, refreshes:
        - the Daily briefs sorted archive
        - the homepage
        - the Tags index
        - every existing tag page

Env vars:
  CONFLUENCE_EMAIL      required
  CONFLUENCE_API_TOKEN  required
  CONFLUENCE_BASE_URL   optional (defaults to MYOB Confluence)

Usage:
  python publish.py                    # publish anything missing + refresh nav
  python publish.py --dry-run          # print what would happen
  python publish.py --force-refresh    # refresh nav even if no new issues
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from convert import convert_markdown
from aggregate import aggregate
from confluence import (
    DAILY_BRIEFS_ID, EXISTING_TAG_PAGES, HOMEPAGE_ID, TAGS_INDEX_ID,
    create_page, find_page_id_by_title, list_children, update_page,
)
from render import (
    render_concepts_page, render_daily_briefs_index, render_homepage,
    render_tag_page, render_tags_index,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
DAILY_DIR = REPO_ROOT / "Information-pipeline" / "daily"


def load_all_issues() -> tuple[list[dict], dict[str, str]]:
    """Parse every Markdown daily brief in the repo."""
    issues: list[dict] = []
    md_bodies: dict[str, str] = {}
    for path in sorted(DAILY_DIR.glob("*.md")):
        md_text = path.read_text()
        info = convert_markdown(md_text)
        info["_md_path"] = str(path)
        issues.append(info)
        md_bodies[info["date"]] = md_text
    return issues, md_bodies


def publish_missing(issues: list[dict], dry_run: bool) -> dict[str, tuple[str, str]]:
    """
    For each issue whose title isn't already on Confluence, create the page.

    Returns {date: (page_id, title)} for ALL issues (existing + newly created).
    """
    by_date: dict[str, tuple[str, str]] = {}
    for issue in issues:
        title = issue["title"]
        page_id = find_page_id_by_title(title)
        if page_id:
            print(f"  = {issue['date']}  exists  (id={page_id})")
            by_date[issue["date"]] = (page_id, title)
            continue

        if dry_run:
            print(f"  + {issue['date']}  WOULD create  {title}")
            continue

        print(f"  + {issue['date']}  creating…      {title}")
        resp = create_page(
            parent_id=DAILY_BRIEFS_ID,
            title=title,
            body_html=issue["html"],
        )
        by_date[issue["date"]] = (resp["id"], title)
        print(f"    → id={resp['id']}")
    return by_date


def refresh_navigation(
    issues: list[dict],
    by_date: dict[str, tuple[str, str]],
    md_bodies: dict[str, str],
    dry_run: bool,
) -> None:
    """Rebuild the Daily briefs archive, homepage, Tags index, and tag pages."""
    agg = aggregate(issues, md_bodies)
    counts = agg["counts"]
    by_tag = agg["by_tag"]

    tag_page_ids = {key: pid for key, (pid, _) in EXISTING_TAG_PAGES.items()}
    headlines = {i["date"]: i["tldr_headline"] for i in issues}

    updates: list[tuple[str, str, str]] = []  # (page_id, title, body_html)

    # 1. Every EXISTING tag page.
    for key, (pid, title) in EXISTING_TAG_PAGES.items():
        if key == "concept":
            body = render_concepts_page(by_date, by_tag)
        else:
            kind, _, name = key.partition(":")
            entries = by_tag.get(key, [])
            body = render_tag_page(kind, name, entries, by_date)
        updates.append((pid, title, body))

    # 2. Daily briefs.
    updates.append((
        DAILY_BRIEFS_ID,
        "Daily briefs",
        render_daily_briefs_index(issues, by_date, headlines),
    ))

    # 3. Homepage.
    updates.append((
        HOMEPAGE_ID,
        "AI Daily Brief",
        render_homepage(issues, counts, tag_page_ids, by_date),
    ))

    # 4. Tags index.
    updates.append((
        TAGS_INDEX_ID,
        "Tags — AI Daily Brief",
        render_tags_index(counts, tag_page_ids),
    ))

    for pid, title, body in updates:
        if dry_run:
            print(f"  ~ {pid:14s} WOULD update ({len(body)}B)  {title}")
            continue
        print(f"  ~ {pid:14s} updating…    ({len(body)}B)  {title}")
        update_page(
            page_id=pid,
            title=title,
            body_html=body,
            version_message="Auto-refresh after daily publish",
        )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force-refresh", action="store_true",
                    help="Refresh navigation even if no new issues published.")
    args = ap.parse_args()

    if not DAILY_DIR.exists():
        print(f"ERROR: {DAILY_DIR} does not exist", file=sys.stderr)
        return 2

    print(f"→ Loading issues from {DAILY_DIR}")
    issues, md_bodies = load_all_issues()
    print(f"  {len(issues)} markdown files found")

    print("→ Publishing any missing issues to Confluence")
    n_before = _count_existing_on_confluence(issues)
    by_date = publish_missing(issues, dry_run=args.dry_run)
    new_count = sum(1 for i in issues if i["date"] in by_date) - n_before

    if new_count == 0 and not args.force_refresh:
        print("→ No new issues; skipping nav refresh (use --force-refresh to override)")
        return 0

    # Safety guard: nav refresh derives homepage stats + tag pages from the
    # current branch's markdown files. If this branch has fewer files than
    # what Confluence already shows under Daily briefs, refreshing would DELETE
    # content readers can see. Skip nav refresh in that case.
    on_confluence = len(list_children(DAILY_BRIEFS_ID)) if not args.dry_run else len(issues)
    if len(issues) < on_confluence:
        print(
            f"→ WARN: this branch has {len(issues)} markdown files but "
            f"Confluence already has {on_confluence} published issues. "
            "Skipping nav refresh to avoid destructive rebuild. New page(s) "
            "still published successfully. To refresh nav, run the workflow "
            "with `workflow_dispatch` from a branch that includes ALL "
            "markdowns (typically main after merges)."
        )
        return 0

    print(f"→ Refreshing navigation pages ({new_count} new issue(s))")
    refresh_navigation(issues, by_date, md_bodies, dry_run=args.dry_run)
    print("→ Done.")
    return 0


def _count_existing_on_confluence(issues: list[dict]) -> int:
    """Best-effort — read the by_date map after publish and count."""
    return 0  # simple heuristic: assume all missing until publish_missing runs


if __name__ == "__main__":
    sys.exit(main())
