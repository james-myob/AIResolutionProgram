"""Render the AI Daily Brief navigation pages.

Produces HTML bodies for:
    - The Daily briefs sorted-archive page
    - The AI Daily Brief homepage (latest issues + tag sidebar)
    - The Tags index page
    - Each individual tag page

All functions here are pure — they take the parsed issue data and return HTML
strings. `publish.py` decides what to POST/PUT to Confluence.
"""
from __future__ import annotations
from urllib.parse import quote

from confluence import (
    ABOUT_ID, DAILY_BRIEFS_ID, EXISTING_TAG_PAGES, HOMEPAGE_ID,
    SPACE_KEY, TAGS_INDEX_ID,
)

HOMEPAGE_URL = f"https://myobconfluence.atlassian.net/wiki/spaces/{SPACE_KEY}/pages/{HOMEPAGE_ID}/AI+Daily+Brief"
DAILY_BRIEFS_URL = f"https://myobconfluence.atlassian.net/wiki/spaces/{SPACE_KEY}/pages/{DAILY_BRIEFS_ID}/Daily+briefs"
TAGS_INDEX_URL = f"https://myobconfluence.atlassian.net/wiki/spaces/{SPACE_KEY}/pages/{TAGS_INDEX_ID}/Tags+AI+Daily+Brief"
ABOUT_URL = f"https://myobconfluence.atlassian.net/wiki/spaces/{SPACE_KEY}/pages/{ABOUT_ID}/About+this+publication"

TAG_COLOR = {"entity": "blue", "theme": "purple", "lens": "yellow", "concept": "green"}

TAG_DESCRIPTIONS = {
    "entity:anthropic":       "Anthropic's lab, models, products, and commercial moves.",
    "entity:google":          "Google's Gemini family, Antigravity, Workspace integrations, and I/O.",
    "entity:openai":          "OpenAI's models, products, and commercial moves.",
    "entity:claude-code":     "Anthropic's Claude Code agent harness — production-agent stack.",
    "entity:meta":            "Meta's AI restructuring, capex, and workforce moves.",
    "entity:cohere":          "Cohere's models — Command A+ and sovereign-AI positioning.",
    "entity:xai":             "xAI's Grok models and Colossus compute infrastructure.",
    "entity:webmcp":          "Google/Microsoft's joint web standard for browser-side AI agents.",
    "entity:codex":           "OpenAI's Codex coding agent.",
    "entity:google-deepmind": "Google DeepMind's research output — Veo, Genie, world models, robotics.",
    "entity:spacex":          "SpaceX in its lab-infrastructure role (Colossus 1).",
    "entity:microsoft":       "Microsoft's AI product surface area, Azure AI, and partnership signals.",
    "entity:claude-fable-5":  "Anthropic's Claude Fable 5 — capability landmarks, pricing, DX.",
    "theme:agents":           "How LLMs become agents — harnesses, tool use, evaluation loops, standards.",
    "theme:enterprise":       "Enterprise procurement, deployment, compliance, and channel.",
    "theme:pricing":          "Pricing moves at the frontier: per-seat models, free-tier floors.",
    "theme:open-source":      "Open-source model releases and licensing.",
    "theme:regulation":       "AI policy and regulation.",
    "theme:research":         "AI research breakthroughs.",
    "theme:safety":           "AI safety and alignment work.",
    "theme:policy":           "Government policy on AI.",
    "theme:ipo":              "Capital-markets moves at the labs.",
    "theme:funding":          "Private-market funding rounds at AI labs and infra providers.",
    "theme:security":         "AI-assisted security work.",
    "lens:mid-market":        (
        "Items where the briefing applies a <strong>second lens</strong> for software/AI "
        "products serving mid-sized businesses (50–1,000 employees)."
    ),
}


def issue_url(page_id: str, title: str) -> str:
    return (
        f"https://myobconfluence.atlassian.net/wiki/spaces/{SPACE_KEY}/pages/"
        f"{page_id}/{quote(title.replace(' ', '+'), safe='+')}"
    )


def render_tag_page(kind: str, name: str, entries: list[dict], by_date: dict) -> str:
    """A single tag page listing every issue that touched this tag."""
    color = TAG_COLOR.get(kind, "neutral")
    display = f"lens:{name}" if kind == "lens" else (f"concept:{name}" if kind == "concept" else name)
    key = f"{kind}:{name}"
    desc = TAG_DESCRIPTIONS.get(
        key, f"Issues covering the <strong>{display}</strong> tag."
    )
    item_total = sum(len(e["items"]) for e in entries)

    out: list[str] = []
    out.append(f'<p><a href="{TAGS_INDEX_URL}">← All tags</a></p>')
    out.append(f'<h1><span data-type="status" data-color="{color}">{display}</span></h1>')
    out.append(f"<p>{desc}</p>")
    out.append(
        f'<p><em>{item_total} item{"s" if item_total != 1 else ""} across '
        f'{len(entries)} issue{"s" if len(entries) != 1 else ""}.</em></p>'
    )
    out.append("<hr/>")
    out.append("<h2>Issues that cover this tag</h2>")
    for e in entries[:50]:
        date = e["date"]
        if date not in by_date:
            continue
        pid, title = by_date[date]
        url = issue_url(pid, title)
        out.append(f'<h3><a href="{url}">{e["friendly"]}</a></h3>')
        out.append("<ul>")
        for item in e["items"]:
            out.append(
                f'<li><strong>{item["title"]}.</strong> {item["snippet"]}</li>'
            )
        out.append("</ul>")
    if len(entries) > 50:
        out.append(
            f'<p><em>+{len(entries) - 50} more older issues. Browse the archive '
            f'via <a href="{DAILY_BRIEFS_URL}">Daily briefs</a>.</em></p>'
        )
    return "".join(out)


def render_concepts_page(by_date: dict, by_tag: dict) -> str:
    out: list[str] = []
    out.append(f'<p><a href="{TAGS_INDEX_URL}">← All tags</a></p>')
    out.append('<h1><span data-type="status" data-color="green">concepts</span></h1>')
    out.append(
        "<p>New vocabulary the briefing has flagged as worth knowing — terms or "
        "framings likely to enter product / strategy discourse over the next few "
        "quarters.</p><hr/>"
    )
    out.append("<h2>Concepts introduced</h2>")
    concepts: dict[str, list] = {}
    for key, entries in by_tag.items():
        if not key.startswith("concept:"):
            continue
        name = key[len("concept:"):]
        for e in entries:
            for item in e["items"]:
                concepts.setdefault(name, []).append({
                    "date": e["date"],
                    "friendly": e["friendly"],
                    "item_title": item["title"],
                    "snippet": item["snippet"],
                })
    for c in concepts:
        concepts[c].sort(key=lambda x: x["date"])
    for name in sorted(concepts.keys(), key=lambda n: concepts[n][0]["date"]):
        first = concepts[name][0]
        date = first["date"]
        link_html = first["friendly"]
        if date in by_date:
            pid, title = by_date[date]
            link_html = f'<a href="{issue_url(pid, title)}">{first["friendly"]}</a>'
        out.append(
            f'<h3><span data-type="status" data-color="green">concept:{name}'
            f'</span></h3>'
        )
        out.append(f"<p><strong>Introduced in:</strong> {link_html}</p>")
        out.append(f'<p>{first["snippet"]}</p>')
    return "".join(out)


def _chip(key: str, count: int, color: str, tag_page_ids: dict) -> str:
    kind, _, name = key.partition(":")
    display = (
        f"lens:{name}" if kind == "lens"
        else (f"concept:{name}" if kind == "concept" else name)
    )
    if key == "concept":
        display = "all concepts"
    label = f"{display} · {count}"
    chip_html = f'<span data-type="status" data-color="{color}">{label}</span>'
    pid = tag_page_ids.get(key)
    if pid:
        url = (
            f"https://myobconfluence.atlassian.net/wiki/spaces/{SPACE_KEY}/pages/{pid}"
        )
        return f'{chip_html} <a href="{url}">↗</a>'
    return chip_html


def render_tags_index(counts: dict, tag_page_ids: dict) -> str:
    out: list[str] = []
    out.append(f'<p><a href="{HOMEPAGE_URL}">← AI Daily Brief homepage</a></p>')
    out.append(
        '<div data-type="panel-info"><p>Every item in the AI Daily Brief is '
        "tagged. Click the ↗ next to a tag to see every issue that covered it.</p></div>"
    )
    sections = [
        ("🏢 Entities", "entity", "blue"),
        ("🏷️ Themes", "theme", "purple"),
        ("🔭 Lenses", "lens", "yellow"),
    ]
    for label, kind, color in sections:
        out.append(f"<h2>{label}</h2>")
        items = [(k, c["items"]) for k, c in counts.items() if k.startswith(kind + ":")]
        items.sort(key=lambda x: -x[1])
        chips = " &nbsp; ".join(_chip(k, v, color, tag_page_ids) for k, v in items)
        out.append(f"<p>{chips}</p>")
    out.append("<h2>💡 Concepts</h2>")
    concept_count = sum(c["items"] for k, c in counts.items() if k.startswith("concept:"))
    out.append(f"<p>{_chip('concept', concept_count, 'green', tag_page_ids)}</p>")
    return "".join(out)


def render_daily_briefs_index(issues: list, by_date: dict, headlines: dict) -> str:
    """Reverse-chronological archive table for the Daily briefs container page."""
    totals_issues = len(issues)
    totals_items = sum(i.get("items_count") or 0 for i in issues)
    totals_sources = sum(i.get("sources_scanned") or 0 for i in issues)

    out: list[str] = []
    out.append(f'<p><a href="{HOMEPAGE_URL}">← AI Daily Brief homepage</a></p>')
    out.append('<div data-type="panel-info">')
    out.append(
        f'<p><strong>{totals_issues} issues · {totals_items} items · '
        f"{totals_sources} cumulative sources scanned.</strong> Every daily issue "
        "lives as a child page of this one. The list below is the canonical "
        "reverse-chronological index — use it to navigate. (The Confluence "
        "page-tree on the left sorts by creation position, not date, so this "
        "index is the better way to browse the archive.)</p>"
    )
    out.append("</div>")
    out.append("<h2>How to find what you want</h2><ul>")
    out.append(f'<li><strong>Latest issues</strong> are surfaced on the <a href="{HOMEPAGE_URL}">AI Daily Brief homepage</a>.</li>')
    out.append(f'<li><strong>Browse by tag</strong> via the <a href="{TAGS_INDEX_URL}">Tags index</a>.</li>')
    out.append("<li><strong>Browse by date</strong> via the table below — newest at top.</li>")
    out.append("</ul>")
    out.append("<h2>📰 Archive — newest first</h2>")
    out.append("<table>")
    out.append("<thead><tr><th>Date</th><th>Items</th><th>Sources</th><th>Headline</th></tr></thead><tbody>")
    for issue in sorted(issues, key=lambda i: i["date"], reverse=True):
        date = issue["date"]
        if date not in by_date:
            continue
        pid, title = by_date[date]
        url = issue_url(pid, title)
        headline = headlines.get(date, "")
        out.append(
            f"<tr>"
            f'<td><a href="{url}"><strong>{issue["friendly"]}</strong></a></td>'
            f'<td>{issue.get("items_count") or ""}</td>'
            f'<td>{issue.get("sources_scanned") or ""}</td>'
            f'<td>{headline}</td>'
            f"</tr>"
        )
    out.append("</tbody></table>")
    out.append(f'<h2>About the publication</h2>')
    out.append(
        f'<p>The AI Daily Brief is a 5-minute morning radar on what changed in '
        f'AI in the last 24 hours, written for product managers serving '
        f'mid-market customers. See <a href="{ABOUT_URL}">About this publication</a>.</p>'
    )
    return "".join(out)


def render_homepage(issues: list, counts: dict, tag_page_ids: dict, by_date: dict) -> str:
    """Publication landing: intro, latest 6 issues, tag sidebar."""
    totals_issues = len(issues)
    totals_items = sum(i.get("items_count") or 0 for i in issues)
    totals_sources = sum(i.get("sources_scanned") or 0 for i in issues)
    new_concepts = sum(c["items"] for k, c in counts.items() if k.startswith("concept:"))

    out: list[str] = []
    out.append('<div data-type="panel-info">')
    out.append(
        '<p>📡 <strong>AI Daily Brief</strong> — a 5-minute morning radar on what '
        "changed in AI in the last 24 hours, written for product managers "
        "serving mid-market customers (typically 50–1,000-employee businesses). "
        'Every item is sourced, every item carries a <em>"why it matters (PM)"</em> '
        "note, and a second <em>mid-market lens</em> when it applies. No hype, "
        "no listicles, no recycled takes.</p>"
    )
    out.append(
        '<p>New issue every weekday morning — including Mondays, which extend '
        "back to Friday evening to cover the weekend. By "
        '<a href="mailto:james.peck@myob.com">James Peck</a>. Source code in the '
        '<a href="https://github.com/james-myob/AIResolutionProgram">AI Resolution Program repo</a>.</p>'
    )
    out.append("</div>")
    out.append("<h2>What this is</h2>")
    out.append(
        "<p>There's more AI news every day than any PM can keep up with. "
        "Important signals — new frontier models, funding moves, regulation, "
        "paradigm-shifting essays — sit alongside enormous volumes of low-value "
        "chatter. The result is most PMs either over-invest time skimming "
        "feeds, or under-invest and lose track of the field.</p>"
    )
    out.append(
        f'<p>The AI Daily Brief is the middle path: an opinionated, source-linked '
        f'digest that lets you understand the day\'s shifts in under five minutes, '
        f'with deeper context one click away. It applies a consistent '
        f"<strong>two-lens framing</strong> on every item — what it changes for "
        f"product builders, and (where relevant) what it changes for software/AI "
        f'vendors selling into mid-market businesses. The taxonomy, sources, and '
        f'editorial method are documented in <a href="{ABOUT_URL}">About this publication</a>.</p>'
    )

    out.append('<section data-type="layout-two-right-sidebar">')
    out.append('<div data-type="column">')
    out.append("<h2>Latest issues</h2>")
    out.append(
        f'<p>📚 <a href="{DAILY_BRIEFS_URL}"><strong>Browse the full archive of '
        f"{totals_issues} issues →</strong></a></p>"
    )
    for issue in sorted(issues, key=lambda i: i["date"], reverse=True)[:6]:
        date = issue["date"]
        if date not in by_date:
            continue
        pid, title = by_date[date]
        url = issue_url(pid, title)
        out.append('<div data-type="panel-success">')
        out.append(
            f'<p><strong>📄 {issue["long_date"]}</strong> &nbsp;·&nbsp; '
            f'<a href="{url}">Read issue →</a></p>'
        )
        out.append(
            f'<p>{issue.get("items_count") or "?"} items · '
            f'{issue.get("read_time_min", "5")}-min read · '
            f'{issue.get("sources_scanned") or "?"} sources scanned</p>'
        )
        out.append("</div>")
    if totals_issues > 6:
        out.append(
            f'<p><em>+{totals_issues - 6} earlier issues — browse via '
            f'<a href="{DAILY_BRIEFS_URL}">Daily briefs</a>.</em></p>'
        )
    out.append("</div>")

    out.append('<div data-type="column">')
    out.append("<h3>🔍 Browse by tag</h3>")
    out.append(
        "<p><em>Click ↗ next to a tag to see all issues that cover it. "
        "Count = items so far.</em></p>"
    )
    for label, kind, color in [
        ("🏢 Entities", "entity", "blue"),
        ("🏷️ Themes", "theme", "purple"),
        ("🔭 Lenses", "lens", "yellow"),
    ]:
        items = [
            (k, c["items"]) for k, c in counts.items()
            if k.startswith(kind + ":") and tag_page_ids.get(k)
        ]
        items.sort(key=lambda x: -x[1])
        out.append(f"<p><strong>{label}</strong></p>")
        out.append("<p>" + " &nbsp; ".join(
            _chip(k, v, color, tag_page_ids) for k, v in items
        ) + "</p>")
    out.append("<p><strong>💡 Concepts</strong></p>")
    out.append(
        f"<p>{_chip('concept', new_concepts, 'green', tag_page_ids)}</p>"
    )
    out.append(f'<p><a href="{TAGS_INDEX_URL}">View all tags →</a></p>')
    out.append("<hr/>")
    out.append("<h3>📊 So far</h3><ul>")
    out.append(f"<li>{totals_issues} issues</li>")
    out.append(f"<li>{totals_items} items</li>")
    out.append(f"<li>{totals_sources} sources scanned (cumulative)</li>")
    out.append(f"<li>{new_concepts} new concepts</li></ul>")
    out.append("</div></section>")

    out.append("<hr/>")
    out.append("<h2>📬 Delivery &amp; subscribing</h2>")
    out.append(
        "<p>Every weekday morning a new issue lands as a page under this "
        "homepage. The Confluence page <strong>is</strong> the publication — "
        "no email list, no audio, no slide pack.</p>"
    )
    out.append(
        "<p><strong>To follow along, hit the Watch button (top-right of any "
        "page).</strong> Confluence will email you whenever a new issue is "
        "published or an existing one is updated.</p>"
    )
    return "".join(out)
