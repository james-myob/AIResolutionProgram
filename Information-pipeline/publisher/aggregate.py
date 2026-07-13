"""Aggregate all published daily issues by tag.

Given the parsed markdown files, produce a per-tag map of issues and items
plus running counts. Used to render tag pages, the Tags index, and the
homepage's tag sidebar.
"""
from __future__ import annotations
import re


def _snippet(first_para: str, max_chars: int = 240) -> str:
    """Short blurb for tag-page entries: lead sentence of first paragraph."""
    text = first_para.strip()
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    m = re.match(r"^(.{40,}?[\.\!\?])\s", text)
    if m:
        text = m.group(1)
    if len(text) > max_chars:
        text = text[:max_chars].rsplit(" ", 1)[0] + "…"
    return text


def _split_items(body_text: str) -> list[dict]:
    """Walk through the markdown body and pull each item (### header + body)."""
    items: list[dict] = []
    cur_title: str | None = None
    cur_first_para: str | None = None
    cur_tags: list[str] = []
    in_item = False

    def flush() -> None:
        nonlocal cur_title, cur_first_para, cur_tags
        if cur_title is not None and cur_tags:
            items.append({
                "title": cur_title,
                "first_para": cur_first_para or "",
                "tags": list(cur_tags),
                "snippet": _snippet(cur_first_para or ""),
            })

    for raw in body_text.splitlines():
        line = raw.strip()
        if line.startswith("### "):
            flush()
            cur_title = line[4:].strip()
            cur_first_para = None
            cur_tags = []
            in_item = True
            continue
        if line.startswith("## "):
            flush()
            cur_title = None
            cur_first_para = None
            cur_tags = []
            in_item = False
            continue
        if not in_item:
            continue
        if (
            cur_first_para is None
            and line
            and not line.startswith("**")
            and not line.startswith("`")
        ):
            cur_first_para = line
            continue
        m = re.match(r"\*\*Tags?:\*\*\s*(.+)$", line)
        if m:
            cur_tags = re.findall(r"`([^`]+)`", m.group(1))
    flush()
    return items


def _norm_tag(t: str) -> tuple[str, str]:
    for kind in ("entity", "theme", "lens", "concept"):
        if t.startswith(kind + ":"):
            return kind, t[len(kind) + 1:]
    return "other", t


def aggregate(issues_meta: list[dict], md_bodies: dict[str, str]) -> dict:
    """
    issues_meta:  list of {date, friendly_date, long_date, items_count,
                          sources_scanned, ...} — from convert_markdown output
    md_bodies:    {date: full_markdown_text}

    Returns {"by_tag": {...}, "counts": {...}, "totals": {...}}.
    """
    by_tag: dict[str, list[dict]] = {}

    for issue in issues_meta:
        date = issue["date"]
        raw = md_bodies.get(date, "")
        items = _split_items(raw)
        per_tag_this_issue: dict[str, list] = {}
        for item in items:
            for t in item["tags"]:
                kind, name = _norm_tag(t)
                key = f"{kind}:{name}"
                per_tag_this_issue.setdefault(key, []).append(item)
        for key, item_list in per_tag_this_issue.items():
            by_tag.setdefault(key, []).append({
                "date": date,
                "friendly": issue["friendly_date"],
                "items": [
                    {"title": it["title"], "snippet": it["snippet"]}
                    for it in item_list
                ],
            })

    for key in by_tag:
        by_tag[key].sort(key=lambda e: e["date"], reverse=True)

    counts = {
        key: {
            "items": sum(len(e["items"]) for e in entries),
            "issues": len(entries),
        }
        for key, entries in by_tag.items()
    }

    totals = {
        "issues": len(issues_meta),
        "items": sum(i.get("items_count") or 0 for i in issues_meta),
        "sources_scanned": sum(i.get("sources_scanned") or 0 for i in issues_meta),
    }

    return {"by_tag": by_tag, "counts": counts, "totals": totals}
