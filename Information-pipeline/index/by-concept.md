# Index — By Concept

> Every emerging concept introduced across daily briefings, with first-mention date, plain-English explainer, and chronological list of subsequent appearances. **Auto-generation not yet built — Mission 7 deliverable.** Until then, manually appended.

A concept earns an entry when the term is genuinely new in the discourse or being repositioned in a way that's catching on. Synonyms for existing concepts and ordinary product names don't qualify (see `prompts/editor-system.md` §"Concept tracking").

---

## `concept:agent-dreaming`
**First mention:** 2026-05-21

**Plain English:** A scheduled, background memory-consolidation process that runs between an AI agent's active work sessions. While the agent is idle, a separate process reviews past task logs, extracts recurring patterns, surfaces lessons from previous errors, and writes consolidated memory notes — so the agent wakes up with that context already integrated next time. The name is an explicit analogy to how human brains consolidate memories during sleep. Functionally distinct from RAG-based memory (reactive, on-demand retrieval) or long-context storage: agent dreaming is proactive and periodic, running on a schedule without a human trigger. Anthropic's implementation in Claude Code is the first to productise this pattern as a first-class feature.

**Origin:** Anthropic Code with Claude 2026 — [event page](https://claude.com/code-with-claude) · [MindStudio breakdown](https://www.mindstudio.ai/blog/code-with-claude-2026-new-agent-features)

**Appearances:**
- 2026-05-21 — [briefing](../daily/2026-05-21.md)

---

## `concept:agent-harness`
**First mention:** 2026-05-20

**Plain English:** The runtime layer that wraps an LLM with tools, memory, permissions, and loop control — the thing that turns a model into an agent. Distinct from the model itself: the harness handles "after the model says X, what tools does it have access to, what's its working memory, when does it stop?" Vendors are increasingly selling the harness as a product separate from the model (Claude Code, Codex, LangChain Deep Agents, Google's Antigravity), the way orchestration was sold separately from compute in earlier infra cycles.

**Origin:** V. Trivedy — *The Anatomy of an Agent Harness* ([vtrivedy.com](https://www.vtrivedy.com/posts/the-anatomy-of-an-agent-harness)). Reached named-product credibility in mainstream developer publications on 20 May 2026 ([NVIDIA Developer Blog](https://developer.nvidia.com/blog/)).

**Appearances:**
- 2026-05-20 — [briefing](../daily/2026-05-20.md)

---

## `concept:pelicanmaxxing`
**First mention:** 2026-07-22

**Plain English:** The phenomenon where a model appears to perform unusually well on a single viral, informal benchmark — like Simon Willison's "draw a pelican riding a bicycle" prompt — not necessarily because a lab deliberately trained for it, but because enough attention on one informal test turns it into a de facto target that distorts what the result actually signals about general capability. A cousin of "benchmaxxing" (deliberately optimizing for a known formal benchmark), applied to informal, meme-status evals.

**Origin:** [dylancastillo.co — "Are AI Labs Pelicanmaxxing?"](https://dylancastillo.co/posts/pelicanmaxxing.html)

**Appearances:**
- 2026-07-22 — [briefing](../daily/2026-07-22.md)
