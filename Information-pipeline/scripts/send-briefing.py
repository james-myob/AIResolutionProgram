#!/usr/bin/env python3
"""
Send a daily AI briefing Markdown file as an HTML email via Resend.

Usage:
    RESEND_API_KEY=re_xxx python3 send-briefing.py <markdown-file>
    RESEND_API_KEY=re_xxx python3 send-briefing.py <markdown-file> --to=other@example.com

Reads:
    - $RESEND_API_KEY: Resend API key. Required.
    - $BRIEFING_TO: default recipient (overridable with --to).
    - $BRIEFING_FROM: default sender (defaults to onboarding@resend.dev for
      unverified Resend accounts; override once you've added a verified domain).

The Markdown front-matter is parsed for `date` and used in the subject line.
The body is converted to HTML with the markdown library, then wrapped in a
minimal email-safe stylesheet (system fonts, generous line-height, max-width
700px so it reads well on mobile and desktop).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

import markdown


DEFAULT_TO = os.environ.get("BRIEFING_TO", "james.peck@myob.com")
DEFAULT_FROM = os.environ.get("BRIEFING_FROM", "Daily AI Briefing <onboarding@resend.dev>")

EMAIL_CSS = """
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
         Helvetica, Arial, sans-serif; line-height: 1.55; color: #1f2328;
         max-width: 700px; margin: 24px auto; padding: 0 16px; }
  h1 { font-size: 22px; border-bottom: 1px solid #d0d7de; padding-bottom: 8px; }
  h2 { font-size: 18px; margin-top: 28px; }
  h3 { font-size: 16px; margin-top: 20px; }
  a { color: #0969da; text-decoration: none; }
  a:hover { text-decoration: underline; }
  code { background: #f6f8fa; padding: 2px 5px; border-radius: 4px;
         font-size: 90%; }
  blockquote { border-left: 3px solid #d0d7de; margin-left: 0;
               padding-left: 12px; color: #57606a; }
  hr { border: 0; border-top: 1px solid #d0d7de; margin: 28px 0; }
  ul, ol { padding-left: 22px; }
  li { margin-bottom: 4px; }
  .meta { color: #57606a; font-size: 13px; margin-bottom: 16px; }
  .artifacts { background: #f6f8fa; border: 1px solid #d0d7de;
               border-radius: 6px; padding: 12px 16px; margin-bottom: 20px;
               font-size: 14px; }
  .artifacts a { display: inline-block; }
"""


def parse_front_matter(content: str) -> tuple[dict[str, str], str]:
    """Return (front_matter_dict, body_without_front_matter)."""
    if not content.startswith("---\n"):
        return {}, content
    end = content.find("\n---\n", 4)
    if end == -1:
        return {}, content
    fm_block = content[4:end]
    body = content[end + 5:]
    fm: dict[str, str] = {}
    for line in fm_block.splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            fm[key.strip()] = value.strip()
    return fm, body


def build_subject(fm: dict[str, str], file_path: Path) -> str:
    date = fm.get("date") or file_path.stem
    try:
        from datetime import datetime
        dt = datetime.fromisoformat(date)
        return f"Daily AI Briefing — {dt.strftime('%a %d %b %Y')}"
    except ValueError:
        return f"Daily AI Briefing — {date}"


def build_html(body_md: str, fm: dict[str, str]) -> str:
    html_body = markdown.markdown(
        body_md, extensions=["tables", "fenced_code", "sane_lists"]
    )
    meta_bits = []
    if "read_time_min" in fm:
        meta_bits.append(f"{fm['read_time_min']} min read")
    if "items" in fm:
        meta_bits.append(f"{fm['items']} items")
    if "sources_scanned" in fm:
        meta_bits.append(f"{fm['sources_scanned']} sources scanned")
    meta_line = " · ".join(meta_bits)
    meta_html = f'<div class="meta">{meta_line}</div>' if meta_line else ""

    # Optional artifact block — rendered when front-matter carries links to
    # the NotebookLM audio overview and/or Claude Design deck for this issue.
    artifact_links = []
    if fm.get("notebooklm_audio_url"):
        artifact_links.append(
            f'<a href="{fm["notebooklm_audio_url"]}">🎧 Listen — NotebookLM audio overview</a>'
        )
    if fm.get("claude_design_deck_url"):
        artifact_links.append(
            f'<a href="{fm["claude_design_deck_url"]}">📊 View deck — Claude Design</a>'
        )
    artifacts_html = ""
    if artifact_links:
        artifacts_html = (
            '<div class="artifacts">'
            + " &nbsp;·&nbsp; ".join(artifact_links)
            + "</div>"
        )

    return (
        "<!doctype html><html><head><meta charset='utf-8'>"
        f"<style>{EMAIL_CSS}</style></head><body>"
        f"{meta_html}{artifacts_html}{html_body}"
        "</body></html>"
    )


def send_via_resend(api_key: str, to: str, sender: str, subject: str, html: str, text: str) -> dict:
    payload = json.dumps({
        "from": sender,
        "to": [to],
        "subject": subject,
        "html": html,
        "text": text,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.resend.com/emails",
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "ai-briefing-pipeline/1.0 (+https://github.com/james-myob/AIResolutionProgram)",
        },
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Send a daily AI briefing via Resend.")
    parser.add_argument("markdown_file", type=Path, help="Path to the daily/YYYY-MM-DD.md file")
    parser.add_argument("--to", default=DEFAULT_TO, help=f"Recipient (default: {DEFAULT_TO})")
    parser.add_argument("--from", dest="sender", default=DEFAULT_FROM, help="Sender (must be verified on Resend; falls back to onboarding@resend.dev)")
    args = parser.parse_args()

    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("ERROR: RESEND_API_KEY env var is required.", file=sys.stderr)
        return 2

    if not args.markdown_file.exists():
        print(f"ERROR: file not found: {args.markdown_file}", file=sys.stderr)
        return 2

    content = args.markdown_file.read_text(encoding="utf-8")
    fm, body_md = parse_front_matter(content)
    subject = build_subject(fm, args.markdown_file)
    html = build_html(body_md, fm)

    # Plain-text fallback: artifacts (if any) at the top, then the body
    # Markdown sans front-matter.
    text_artifacts = []
    if fm.get("notebooklm_audio_url"):
        text_artifacts.append(f"🎧 Listen (NotebookLM): {fm['notebooklm_audio_url']}")
    if fm.get("claude_design_deck_url"):
        text_artifacts.append(f"📊 Deck (Claude Design): {fm['claude_design_deck_url']}")
    text_header = ("\n".join(text_artifacts) + "\n\n---\n\n") if text_artifacts else ""
    text = text_header + body_md.strip()

    print(f"Sending '{subject}' to {args.to} (from {args.sender}) ...")
    try:
        result = send_via_resend(api_key, args.to, args.sender, subject, html, text)
    except urllib.error.HTTPError as e:
        print(f"ERROR: Resend returned HTTP {e.code}: {e.read().decode('utf-8')}", file=sys.stderr)
        return 1

    print(f"OK — Resend id: {result.get('id', '<no id>')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
