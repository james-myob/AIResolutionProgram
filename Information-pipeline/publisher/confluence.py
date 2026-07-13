"""Thin client over the Confluence v2 REST API for the AI Daily Brief publisher.

Auth uses Basic Auth with an Atlassian API token:
  https://id.atlassian.com/manage-profile/security/api-tokens

Configuration is via env vars set in the GitHub Action:
  CONFLUENCE_BASE_URL  e.g. https://myobconfluence.atlassian.net/wiki
  CONFLUENCE_EMAIL     the Atlassian account email (e.g. james.peck@myob.com)
  CONFLUENCE_API_TOKEN the API token generated in Atlassian profile settings

Fixed page IDs for this publication live in constants below; if the tree is
ever rearranged, only these need to change.
"""
from __future__ import annotations

import os
import time
from typing import Any

import requests

BASE_URL = os.environ.get("CONFLUENCE_BASE_URL", "https://myobconfluence.atlassian.net/wiki")
EMAIL = os.environ.get("CONFLUENCE_EMAIL", "")
API_TOKEN = os.environ.get("CONFLUENCE_API_TOKEN", "")

SPACE_ID = "10554835614"                   # James Peck personal space
SPACE_KEY = "~712020456db008c5c746a684901e35cea3e13a"
HOMEPAGE_ID = "12024578071"                # AI Daily Brief
DAILY_BRIEFS_ID = "12031984216"            # Daily briefs container
TAGS_INDEX_ID = "12026511459"              # Tags — AI Daily Brief
ABOUT_ID = "12024578165"                   # About this publication

# Existing tag pages (key = "<kind>:<name>" or "concept" for the concepts page).
EXISTING_TAG_PAGES: dict[str, tuple[str, str]] = {
    "concept":                 ("12026183775", "Tag: concepts"),
    "entity:anthropic":        ("12025299244", "Tag: anthropic"),
    "entity:google":           ("12026413170", "Tag: google"),
    "entity:openai":           ("12026216556", "Tag: openai"),
    "entity:claude-code":      ("12026773646", "Tag: claude-code"),
    "entity:meta":             ("12025561380", "Tag: meta"),
    "entity:cohere":           ("12025561405", "Tag: cohere"),
    "entity:xai":              ("12025725099", "Tag: xai"),
    "entity:webmcp":           ("12025757842", "Tag: webmcp"),
    "entity:claude-fable-5":   ("12027986429", "Tag: claude-fable-5"),
    "entity:codex":            ("12027625746", "Tag: codex"),
    "entity:google-deepmind":  ("12027035926", "Tag: google-deepmind"),
    "entity:microsoft":        ("12027756928", "Tag: microsoft"),
    "entity:spacex":           ("12027986496", "Tag: spacex"),
    "theme:agents":            ("12025266351", "Tag: agents"),
    "theme:enterprise":        ("12025954508", "Tag: enterprise"),
    "theme:pricing":           ("12025593999", "Tag: pricing"),
    "theme:open-source":       ("12026511490", "Tag: open-source"),
    "theme:regulation":        ("12026642523", "Tag: regulation"),
    "theme:research":          ("12025692376", "Tag: research"),
    "theme:funding":           ("12028379383", "Tag: funding"),
    "theme:ipo":               ("12027887936", "Tag: ipo"),
    "theme:policy":            ("12027789829", "Tag: policy"),
    "theme:safety":            ("12027167034", "Tag: safety"),
    "theme:security":          ("12027756970", "Tag: security"),
    "lens:mid-market":         ("12026413198", "Tag: mid-market"),
}


class ConfluenceError(RuntimeError):
    pass


def _session() -> requests.Session:
    if not EMAIL or not API_TOKEN:
        raise ConfluenceError(
            "CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must both be set"
        )
    s = requests.Session()
    s.auth = (EMAIL, API_TOKEN)
    s.headers.update({
        "Accept": "application/json",
        "Content-Type": "application/json",
    })
    return s


def _request(method: str, path: str, **kwargs) -> Any:
    """Make a Confluence API call with basic retry on 429/5xx."""
    url = f"{BASE_URL}{path}"
    sess = _session()
    for attempt in range(4):
        r = sess.request(method, url, timeout=30, **kwargs)
        if r.status_code == 429 or r.status_code >= 500:
            sleep_for = min(2 ** attempt, 8)
            time.sleep(sleep_for)
            continue
        if not r.ok:
            raise ConfluenceError(
                f"{method} {path} failed: {r.status_code} {r.text[:500]}"
            )
        if r.status_code == 204 or not r.text:
            return None
        return r.json()
    raise ConfluenceError(f"{method} {path} failed after retries")


def find_page_id_by_title(title: str) -> str | None:
    """Return the ID of the page in James's personal space with this exact title,
    or None if not found. Uses CQL search."""
    cql = f'title = "{title}" AND space = "{SPACE_KEY}" AND type = page'
    data = _request("GET", "/rest/api/content/search", params={
        "cql": cql,
        "limit": 5,
    })
    results = data.get("results", []) if isinstance(data, dict) else []
    for r in results:
        if r.get("title") == title:
            return r.get("id")
    return None


def get_page(page_id: str) -> dict:
    return _request("GET", f"/api/v2/pages/{page_id}", params={"body-format": "storage"})


def create_page(*, parent_id: str, title: str, body_html: str) -> dict:
    payload = {
        "spaceId": SPACE_ID,
        "status": "current",
        "title": title,
        "parentId": parent_id,
        "body": {
            "representation": "storage",
            "value": body_html,          # Confluence auto-converts HTML+ to storage
        },
    }
    return _request("POST", "/api/v2/pages", json=payload)


def update_page(*, page_id: str, title: str, body_html: str, version_message: str = "") -> dict:
    """Update a page's body (and optionally title). Preserves parentId."""
    current = get_page(page_id)
    next_version = current["version"]["number"] + 1
    payload = {
        "id": page_id,
        "status": "current",
        "title": title,
        "body": {
            "representation": "storage",
            "value": body_html,
        },
        "version": {
            "number": next_version,
            "message": version_message,
        },
    }
    return _request("PUT", f"/api/v2/pages/{page_id}", json=payload)


def list_children(parent_id: str) -> list[dict]:
    """Return every child page of parent_id (paginated automatically)."""
    out: list[dict] = []
    cursor = None
    while True:
        params: dict[str, Any] = {"limit": 250}
        if cursor:
            params["cursor"] = cursor
        data = _request("GET", f"/api/v2/pages/{parent_id}/children", params=params)
        out.extend(data.get("results", []))
        links = data.get("_links", {})
        next_url = links.get("next") or ""
        if "cursor=" not in next_url:
            break
        cursor = next_url.split("cursor=", 1)[1].split("&", 1)[0]
    return out
