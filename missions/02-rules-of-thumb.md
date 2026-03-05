# AI Rules of Thumb
## My Personal Model Selection Guide

*Last updated: March 2026 — updated to reflect current model landscape*

---

## The 30-Second Answer

| If I'm doing this… | Use this |
|---|---|
| Writing a draft (email, doc, summary) | **Claude Sonnet 4.6** |
| Researching a live/current topic | **Perplexity Sonar Pro** |
| Building or debugging code | **GPT-4.1** |
| Analysing an image, chart, or screenshot | **GPT-4.1** or **Claude Sonnet 4.6** |
| Strategic planning / structured thinking | **Claude Sonnet 4.6** or **GPT-4.1** |
| Processing a huge document (50+ pages) | **Gemini 2.5 Pro** |
| Ultra-long context (book-length, giant codebase) | **Llama 4 Scout** (10M tokens) |
| Running something fast and cheap, quality optional | **Llama 4 Maverick via Groq** |
| Hard reasoning / complex analysis | **o3** or **Claude Opus 4.6** |
| Exploring an idea conversationally | **Claude Sonnet 4.6** |

---

## Decision Tree

```
What do I need?
│
├── Something written (email, doc, report, summary)
│   └── Claude Sonnet 4.6 ✓
│
├── Factual research (current events, stats, sources)
│   └── Perplexity Sonar Pro ✓
│
├── Code (generate, debug, explain, refactor)
│   ├── Quick script or boilerplate → GPT-4.1 ✓
│   └── Complex reasoning about code → Claude Sonnet 4.6 ✓
│
├── Image / visual input (chart, screenshot, photo)
│   └── GPT-4.1 ✓  (Claude Sonnet 4.6 also good)
│
├── Large document processing (long PDF, full transcript)
│   └── Gemini 2.5 Pro ✓  (1M context window)
│
├── Ultra-long context (10M+ tokens, giant codebase)
│   └── Llama 4 Scout ✓  (10M token context — open weight, free to self-host)
│
├── Hard reasoning / complex analysis
│   ├── Fast + affordable → o3 ✓
│   └── Maximum quality → Claude Opus 4.6 ✓
│
├── Strategic or analytical thinking
│   ├── Need it fast with a clear framework → GPT-4.1 ✓
│   └── Need nuance and push-back → Claude Sonnet 4.6 ✓
│
└── Cost-sensitive / high-volume / quick draft
    └── Llama 4 Maverick via Groq ✓  (~$0.15/$0.60 per 1M, near-frontier quality)
```

---

## The "Never Use X for Y" List

| Don't use | For | Because |
|---|---|---|
| Perplexity Sonar | Long-form writing | It's a research tool, not a writing assistant |
| Llama 4 Maverick | High-stakes outputs without review | Near-frontier but still needs editorial oversight |
| Gemini 2.0 Flash | Deep reasoning | Speed model — shallow on complex analysis |
| GPT-4.1 | Ultra-long contexts (>1M tokens) | Capped at 1M; use Llama 4 Scout instead |
| o3-pro | Routine tasks | $20/$80 per 1M — overkill and expensive for everyday use |
| Any model | Replacing verification | Always sanity-check facts, numbers, citations |

---

## Cost & Speed Guide

| When I need to… | Best fit | Why |
|---|---|---|
| Minimise cost at scale | Llama 4 Maverick or GPT-4.1 Nano | $0.10–0.15/$0.40–0.60 per 1M — near-frontier at near-zero cost |
| Get a response fast | Gemini 2.0 Flash or Grok 4 Fast | Sub-second latency, very cheap |
| Maximise output quality | Claude Sonnet 4.6 | Best prose, reasoning, and reliability |
| Maximum reasoning quality | Claude Opus 4.6 or o3 | Top-tier chains of thought |
| Save time on editing | Claude Sonnet 4.6 | Outputs need least rework |
| Get sources I can trust | Perplexity Sonar Pro | Inline citations from live web |

---

## Model Personalities (How They Feel to Use)

**Claude Sonnet 4.6** — Thoughtful, careful, asks for clarification. Feels like a smart colleague who wants to give you the right answer, not just an answer. Best for anything you'd sign your name to.

**GPT-4.1** — Confident, fast, code-native, with a massive 1M context window. Feels like a capable generalist who gets things done. Best when you want output quickly and have a large codebase or document to paste in.

**Gemini 2.5 Pro** — Broad, solid, document-native. Feels like a librarian who's read everything. Best when you're dealing with long inputs or want wide coverage — native 1M context, strong multimodal.

**Perplexity Sonar Pro** — Search-first. Feels like a researcher who's Googling while you talk. Best when the answer depends on what happened last week. Cites sources inline so you skip the verification step.

**Llama 4 Maverick (Groq)** — Fast, cheap, and now genuinely competitive. Feels like a capable junior who's had a significant upgrade. Near-frontier quality at ~$0.15/$0.60 per 1M tokens; first Llama with native multimodal.

**Grok 4** — Direct and opinionated. Feels like someone who's extremely online and very confident. Best when you want fast, punchy output or need to reason about current events from X/Twitter context.

**o3** — Slow and deliberate. Feels like a specialist brought in for the hard problems. Best for multi-step reasoning, maths, or anything where being right matters more than being fast.

---

## My Personal Defaults

- **Default tool for thinking:** Claude Sonnet 4.6
- **Default tool for code:** GPT-4.1
- **Default tool for research:** Perplexity Sonar Pro
- **Go-to for big documents:** Gemini 2.5 Pro
- **Go-to when cost matters:** Llama 4 Maverick via Groq
- **Go-to for hard reasoning:** o3

---

## What I'll Reassess

- [ ] Track editing time per model for the next 4 weekends to validate the "hidden cost" theory
- [ ] Test Llama 4 Scout on actual 10M-token use cases — does the context quality hold up?
- [ ] Compare o3 vs Claude Opus 4.6 head-to-head on hard reasoning tasks
- [ ] Evaluate Grok 4 Fast — 2M context at $0.20/$0.50 may be the best value model available
- [ ] Test Mistral Large 3 for enterprise-sensitive workloads (European data residency option)
