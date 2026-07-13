"""Convert an AI Daily Brief Markdown file to Confluence-flavoured HTML.

The output HTML is what gets posted as the page body. It uses Confluence's
HTML+ dialect (data-type panels, status macros, expand/details, etc.).

Consumers should call `convert_markdown(md_text)` which returns a dict:
    {
        "date": "YYYY-MM-DD",
        "title": "Daily AI Briefing — Fri 10 July 2026",
        "html": "<p>...</p>",           # page body
        "items_count": 8,
        "sources_scanned": 24,
        "deep_dive_picks": 0,
        "new_concepts": 0,
        "tags": {"entity": {...}, "theme": {...}, "lens": {...}, "concept": {...}},
        "tldr_headline": "The first bolded TL;DR headline (plain text)",
    }
"""
from __future__ import annotations
import re
from datetime import date as dtdate

HOMEPAGE_URL = (
    "https://myobconfluence.atlassian.net/wiki/spaces/"
    "~712020456db008c5c746a684901e35cea3e13a/pages/12024578071/AI+Daily+Brief"
)

DAY_NAMES_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
DAY_NAMES_LONG = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
]
MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

INLINE_LINK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
INLINE_BOLD = re.compile(r"\*\*([^*]+)\*\*")
INLINE_ITALIC = re.compile(r"(?<![*\w])\*([^*\n]+)\*(?!\w)")
INLINE_CODE = re.compile(r"`([^`]+)`")


def _inline(s: str) -> str:
    """Convert markdown inline syntax to HTML."""
    s = s.replace("&", "&amp;")
    s = INLINE_CODE.sub(lambda m: f"<code>{m.group(1)}</code>", s)
    s = INLINE_LINK.sub(lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>', s)
    s = INLINE_BOLD.sub(lambda m: f"<strong>{m.group(1)}</strong>", s)
    s = INLINE_ITALIC.sub(lambda m: f"<em>{m.group(1)}</em>", s)
    return s


def _tag_html(raw_tag: str) -> str:
    """Convert a `entity:openai`-style tag into a Confluence status macro."""
    raw_tag = raw_tag.strip().strip("`")
    if raw_tag.startswith("entity:"):
        return (
            f'<span data-type="status" data-color="blue">'
            f'{raw_tag[len("entity:"):]}</span>'
        )
    if raw_tag.startswith("theme:"):
        return (
            f'<span data-type="status" data-color="purple">'
            f'{raw_tag[len("theme:"):]}</span>'
        )
    if raw_tag.startswith("lens:"):
        return (
            f'<span data-type="status" data-color="yellow">'
            f'lens:{raw_tag[len("lens:"):]}</span>'
        )
    if raw_tag.startswith("concept:"):
        return f'<span data-type="status" data-color="green">{raw_tag}</span>'
    return f'<span data-type="status" data-color="neutral">{raw_tag}</span>'


def _parse_frontmatter(lines: list[str]) -> tuple[dict, int]:
    fm: dict = {}
    i = 0
    assert lines[i].strip() == "---", "Markdown must start with a YAML front-matter block"
    i += 1
    while i < len(lines) and lines[i].strip() != "---":
        line = lines[i].rstrip()
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip()
        i += 1
    return fm, i + 1


def _friendly_date(d: dtdate) -> str:
    return f"{DAY_NAMES_SHORT[d.weekday()]} {d.day} {MONTH_NAMES[d.month - 1]} {d.year}"


def _long_date(d: dtdate) -> str:
    return f"{DAY_NAMES_LONG[d.weekday()]}, {d.day} {MONTH_NAMES[d.month - 1]} {d.year}"


def _collect_tags(md_text: str) -> dict:
    """Pull every tag from every Tags: line into a {kind: {name: count}} map."""
    by_kind: dict = {"entity": {}, "theme": {}, "lens": {}, "concept": {}}
    for m in re.finditer(r"^\*\*Tags?:\*\*\s*(.+)$", md_text, re.MULTILINE):
        line = m.group(1)
        for t in re.findall(r"`([^`]+)`", line):
            for kind in by_kind:
                if t.startswith(kind + ":"):
                    name = t[len(kind) + 1:]
                    by_kind[kind][name] = by_kind[kind].get(name, 0) + 1
                    break
    return by_kind


def _tldr_headline(md_text: str) -> str:
    m = re.search(r"^## TL;DR\s*\n((?:- .+\n?)+)", md_text, re.MULTILINE)
    if not m:
        return ""
    first_bullet = m.group(1).split("\n")[0]
    mb = re.match(r"-\s*\*\*([^*]+)\*\*", first_bullet)
    if mb:
        return mb.group(1).strip()
    return first_bullet[2:].strip()


def convert_markdown(md_text: str) -> dict:
    """Convert a full Markdown daily brief to a structured dict incl. HTML body."""
    lines = md_text.splitlines()
    fm, body_start = _parse_frontmatter(lines)

    iso = fm["date"]
    y, m, dd = (int(x) for x in iso.split("-"))
    d = dtdate(y, m, dd)
    title = f"Daily AI Briefing — {_friendly_date(d)}"

    items = fm.get("items", "?")
    sources_scanned = fm.get("sources_scanned", "?")
    deep_dive = fm.get("deep_dive_picks", "0")
    new_concepts = fm.get("new_concepts", "0")
    read_time = fm.get("read_time_min", "5")

    html: list[str] = []
    html.append(f'<p><a href="{HOMEPAGE_URL}">← All issues</a></p>')

    badge_parts = [
        f"{items} item{'s' if items != '1' else ''}",
        f"{read_time}-min read",
        f"{sources_scanned} sources scanned",
    ]
    if deep_dive.isdigit() and int(deep_dive) > 0:
        badge_parts.append(f"{deep_dive} deep-dive pick{'s' if deep_dive != '1' else ''}")
    if new_concepts.isdigit() and int(new_concepts) > 0:
        badge_parts.append(f"{new_concepts} new concept{'s' if new_concepts != '1' else ''}")
    badges = " &nbsp;·&nbsp; ".join(badge_parts)
    html.append(
        f'<div data-type="panel-info"><p><strong>{_long_date(d)}</strong> '
        f'&nbsp;·&nbsp; {badges}</p></div>'
    )

    # Skip the H1 line.
    i = body_start
    n = len(lines)
    while i < n and not lines[i].startswith("# "):
        i += 1
    if i < n:
        i += 1

    in_tldr = False
    tldr_buf: list[str] = []
    in_quick_hits = False
    qh_buf: list[str] = []
    in_sources_scanned = False
    ss_buf: list[str] = []
    dd_buf: list[str] = []

    def flush_tldr() -> None:
        if not tldr_buf:
            return
        html.append("<h2>TL;DR</h2><ul>")
        for b in tldr_buf:
            html.append(f"<li>{_inline(b)}</li>")
        html.append("</ul>")
        tldr_buf.clear()

    def flush_quick_hits() -> None:
        if not qh_buf:
            return
        html.append("<ul>")
        for b in qh_buf:
            html.append(f"<li>{_inline(b)}</li>")
        html.append("</ul>")
        qh_buf.clear()

    def flush_sources_scanned() -> None:
        if not ss_buf:
            return
        body_text = _inline(" ".join(b.strip() for b in ss_buf if b.strip()))
        html.append(
            f'<details><summary>Sources scanned today ({sources_scanned})</summary>'
            f'<p>{body_text}</p></details>'
        )
        ss_buf.clear()

    def flush_deep_dive() -> None:
        if not dd_buf:
            return
        body = "\n".join(dd_buf).strip()
        html.append(f'<div data-type="panel-success">{body}</div>')
        dd_buf.clear()

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("##") or stripped == "---":
            flush_tldr()
            flush_quick_hits()
            if in_sources_scanned:
                flush_sources_scanned()
                in_sources_scanned = False

        if stripped == "---":
            html.append("<hr/>")
            i += 1
            continue

        if stripped == "## TL;DR":
            in_tldr = True
            in_quick_hits = False
            i += 1
            continue
        if in_tldr:
            if stripped.startswith("- "):
                tldr_buf.append(stripped[2:].strip())
            elif stripped == "":
                pass
            else:
                flush_tldr()
                in_tldr = False
                continue
            i += 1
            continue

        if stripped.startswith("## ⚡"):
            in_quick_hits = True
            html.append(f"<h2>{stripped[3:].strip()}</h2>")
            i += 1
            continue
        if in_quick_hits:
            if stripped.startswith("- "):
                qh_buf.append(stripped[2:].strip())
                i += 1
                continue
            elif stripped == "":
                i += 1
                continue
            else:
                flush_quick_hits()
                in_quick_hits = False
                continue

        if stripped.startswith("## Sources scanned today"):
            in_sources_scanned = True
            i += 1
            continue
        if in_sources_scanned:
            if stripped == "":
                i += 1
                continue
            ss_buf.append(stripped)
            i += 1
            continue

        if stripped.startswith("## 🎓"):
            html.append(f"<h2>{stripped[3:].strip()}</h2>")
            i += 1
            while i < n:
                ln = lines[i].strip()
                if ln.startswith("## ") or ln == "---":
                    break
                if ln.startswith("### "):
                    if dd_buf:
                        flush_deep_dive()
                    dd_buf.append(f"<p><strong>{_inline(ln[4:].strip())}</strong></p>")
                    i += 1
                    continue
                if ln == "":
                    i += 1
                    continue
                dd_buf.append(f"<p>{_inline(ln)}</p>")
                i += 1
            if dd_buf:
                flush_deep_dive()
            continue

        if stripped.startswith("## "):
            html.append(f"<h2>{_inline(stripped[3:].strip())}</h2>")
            i += 1
            continue

        if stripped.startswith("### "):
            html.append(f"<h3>{_inline(stripped[4:].strip())}</h3>")
            i += 1
            continue

        if stripped.startswith("**Why it matters (PM):**"):
            text = stripped[len("**Why it matters (PM):**"):].strip()
            html.append(
                f'<div data-type="panel-note"><p><strong>Why it matters (PM):</strong> '
                f'{_inline(text)}</p></div>'
            )
            i += 1
            continue

        if stripped.startswith("**Why it matters (mid-market):**"):
            text = stripped[len("**Why it matters (mid-market):**"):].strip()
            html.append(
                f'<div data-type="panel-success"><p><strong>Why it matters '
                f'(mid-market):</strong> {_inline(text)}</p></div>'
            )
            i += 1
            continue

        if stripped.startswith("**Sources:**"):
            text = stripped[len("**Sources:**"):].strip()
            html.append(f"<p><strong>Sources:</strong> {_inline(text)}</p>")
            i += 1
            continue

        m_tag = re.match(r"\*\*Tags?:\*\*\s*(.+)$", stripped)
        if m_tag:
            tags = re.findall(r"`([^`]+)`", m_tag.group(1))
            html.append("<p>" + " ".join(_tag_html(t) for t in tags) + "</p>")
            i += 1
            continue

        if (
            stripped.startswith("**Plain English:**")
            or stripped.startswith("**Origin:**")
            or stripped.startswith("**Tag:**")
        ):
            html.append(f"<p>{_inline(stripped)}</p>")
            i += 1
            continue

        if stripped == "":
            i += 1
            continue

        html.append(f"<p>{_inline(stripped)}</p>")
        i += 1

    flush_tldr()
    flush_quick_hits()
    if in_sources_scanned:
        flush_sources_scanned()

    html.append("<p>&nbsp;</p>")
    html.append(f'<p><a href="{HOMEPAGE_URL}">← All issues</a></p>')

    return {
        "date": iso,
        "title": title,
        "html": "".join(html),
        "items_count": int(items) if items.isdigit() else None,
        "sources_scanned": int(sources_scanned) if sources_scanned.isdigit() else None,
        "deep_dive_picks": int(deep_dive) if deep_dive.isdigit() else 0,
        "new_concepts": int(new_concepts) if new_concepts.isdigit() else 0,
        "read_time_min": read_time,
        "friendly_date": _friendly_date(d),
        "long_date": _long_date(d),
        "tags": _collect_tags(md_text),
        "tldr_headline": _tldr_headline(md_text),
    }
