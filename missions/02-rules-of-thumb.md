# AI Rules of Thumb
## My Personal Model Selection Guide

*Last updated: Weekend 2 — tested across 5 models, 5 task types*

---

## The 30-Second Answer

| If I'm doing this… | Use this |
|---|---|
| Writing a draft (email, doc, summary) | **Claude** |
| Researching a live/current topic | **Perplexity** |
| Building or debugging code | **GPT-4o** |
| Analysing an image, chart, or screenshot | **GPT-4o** or **Claude** |
| Strategic planning / structured thinking | **Claude** or **GPT-4o** |
| Processing a huge document (50+ pages) | **Gemini 1.5 Pro** |
| Running something fast and cheap, quality optional | **Llama 3.1 via Groq** |
| Exploring an idea conversationally | **Claude** |

---

## Decision Tree

```
What do I need?
│
├── Something written (email, doc, report, summary)
│   └── Claude ✓
│
├── Factual research (current events, stats, sources)
│   └── Perplexity ✓
│
├── Code (generate, debug, explain, refactor)
│   ├── Quick script or boilerplate → GPT-4o ✓
│   └── Complex reasoning about code → Claude ✓
│
├── Image / visual input (chart, screenshot, photo)
│   └── GPT-4o ✓  (Claude also good)
│
├── Large document processing (long PDF, full transcript)
│   └── Gemini 1.5 Pro ✓  (1M context window)
│
├── Strategic or analytical thinking
│   ├── Need it fast with a clear framework → GPT-4o ✓
│   └── Need nuance and push-back → Claude ✓
│
└── Cost-sensitive / high-volume / quick draft
    └── Llama 3.1 70B via Groq ✓  (free tier available)
```

---

## The "Never Use X for Y" List

| Don't use | For | Because |
|---|---|---|
| Perplexity | Long-form writing | It's a research tool, not a writing assistant |
| Llama (Groq) | Image tasks | No multimodal support |
| Llama (Groq) | High-stakes outputs | Needs heavier editing; not worth the risk |
| Gemini Flash | Deep reasoning | Speed model — shallow on complex analysis |
| GPT-4o | Very long documents | 128K context; use Gemini 1.5 Pro instead |
| Any model | Replacing verification | Always sanity-check facts, numbers, citations |

---

## Cost & Speed Guide

| When I need to… | Best fit | Why |
|---|---|---|
| Minimise cost at scale | Gemini Flash or Llama | 10–50x cheaper than flagship models |
| Get a response fast | GPT-4o or Llama/Groq | Fastest time-to-first-token at quality |
| Maximise output quality | Claude 3.7 Sonnet | Best prose, reasoning, and reliability |
| Save time on editing | Claude | Outputs need least rework |
| Get sources I can trust | Perplexity | Inline citations from live web |

---

## Model Personalities (How They Feel to Use)

**Claude** — Thoughtful, careful, asks for clarification. Feels like a smart colleague who wants to give you the right answer, not just an answer. Best for anything you'd sign your name to.

**GPT-4o** — Confident, fast, code-native. Feels like a capable generalist who gets things done. Best when you want output quickly and don't need it to be perfect.

**Gemini 1.5 Pro** — Broad, solid, document-native. Feels like a librarian who's read everything. Best when you're dealing with long inputs or want wide coverage.

**Perplexity** — Search-first. Feels like a researcher who's Googling while you talk. Best when the answer depends on what happened last week.

**Llama 3.1 (Groq)** — Fast and free. Feels like a capable intern who moves quickly but needs clear instructions and editorial oversight.

---

## My Personal Defaults

- **Default tool for thinking:** Claude
- **Default tool for code:** GPT-4o
- **Default tool for research:** Perplexity
- **Go-to for big documents:** Gemini 1.5 Pro
- **Go-to when cost matters:** Llama via Groq

---

## What I'll Reassess

- [ ] Retest Llama 3.1 405B (larger version) — may close the quality gap
- [ ] Test Gemini 2.0 when available — Flash performance is improving fast
- [ ] Track editing time per model for the next 4 weekends to validate the "hidden cost" theory
- [ ] Add o1/o3 (OpenAI reasoning models) to the matrix for complex analytical tasks
