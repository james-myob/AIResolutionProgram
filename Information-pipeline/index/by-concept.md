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

## `concept:ai-safety-trilemma`
**First mention:** 2026-08-03

**Plain English:** A framing for why AI safety guardrails can't fully deliver on three goals at once: letting a model be genuinely useful (Useful Capability), guaranteeing it can't be misused (Reliable Safety), and keeping it openly accessible to anyone (Open Access). Push hard on any two and the third slips — a fully open, fully capable model is hard to make reliably safe; a reliably safe, fully open model tends to lose real capability; a capable, reliably safe model usually isn't fully open. Trusted, hard-to-copy credentials are proposed as a partial way to escape the trade-off.

**Origin:** ["Safeguards Based on Copyable Context Cannot Provide Reliable Safety for LLMs"](https://arxiv.org/abs/2607.27951), via Hugging Face Daily Papers.

**Appearances:**
- 2026-08-03 — [briefing](../daily/2026-08-03.md)
