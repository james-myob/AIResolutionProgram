# Model Topography Sheet
## Weekend 2: The Model Mapping Project

> **Last updated: March 2026.** Models and pricing in this space change rapidly — treat costs as approximate and verify before building anything budget-sensitive.

---

## Test Setup

**Consistent prompts used across all models:**

| Task Category | Test Prompt |
|---|---|
| Deep Research | "What are the main factors driving enterprise AI adoption in 2024, and what are the biggest barriers?" |
| Writing | "Write a 200-word executive summary of a Q3 performance review for a software team that hit 90% of OKRs." |
| Strategy | "We're a 50-person SaaS company with plateauing growth. Give me a 90-day plan to reactivate churned customers." |
| Data | "I have sales data with columns: Date, Region, Product, Revenue, Units. What analysis would you run first and why?" |
| Visual | "Describe what a clear org chart for a matrix organisation of 200 people should look like. What makes it readable?" |

---

## Model Specs Matrix

### Flagship / Balanced Models

| Model | Provider | Context Window | Cost (input/output per 1M tokens) | Best Access |
|---|---|:---:|---|---|
| Claude Opus 4.6 | Anthropic | 200K (1M beta) | $15 / $75 | API |
| Claude Sonnet 4.6 | Anthropic | 200K (1M beta) | $3 / $15 | claude.ai, API |
| GPT-4.1 | OpenAI | 1M | $2 / $8 | ChatGPT, API |
| o3 | OpenAI | 200K | $2 / $8 | ChatGPT Plus, API |
| o3-pro | OpenAI | 200K | $20 / $80 | ChatGPT Pro, API |
| Gemini 2.5 Pro | Google | 1M | $1.25 / $10 | Gemini.google.com, API |
| Grok 4 | xAI | 256K | $3 / $15 | grok.com, API |
| Mistral Large 3 | Mistral | 262K | $0.50 / $1.50 | API |
| Sonar Pro | Perplexity | 200K | $3 / $15 + search fees | perplexity.ai, API |

### Speed / Cost-Optimised Models

| Model | Provider | Context Window | Cost (input/output per 1M tokens) | Best Access |
|---|---|:---:|---|---|
| Claude Haiku 4.5 | Anthropic | 200K | $0.80 / $4 | API |
| GPT-4.1 Mini | OpenAI | 1M | $0.40 / $1.60 | API |
| GPT-4.1 Nano | OpenAI | 1M | $0.10 / $0.40 | API |
| o4-mini | OpenAI | 200K | $1.10 / $4.40 | API |
| Gemini 2.0 Flash | Google | 1M | $0.10 / $0.40 | API |
| Grok 4 Fast | xAI | 2M | $0.20 / $0.50 | API |
| Llama 4 Maverick | Meta (via Groq) | 1M | ~$0.15 / $0.60 | groq.com, Ollama |
| Llama 4 Scout | Meta (via Groq) | 10M | ~$0.08 / $0.30 | groq.com, Ollama |
| Mistral Small 3.2 | Mistral | 128K | $0.06 / $0.18 | API |

---

## Task Performance Comparison

### Deep Research

**Prompt:** *What are the main factors driving enterprise AI adoption in 2024, and what are the biggest barriers?*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude Sonnet 4.6 | 5 | Medium | Structured, nuanced, flags uncertainty; asks clarifying questions | Minimal — publishable with light edits |
| GPT-4.1 | 4 | Fast | Confident, comprehensive, 1M context means you can paste entire reports as context | Light cleanup on specifics |
| Gemini 2.5 Pro | 5 | Medium | Excellent reasoning depth; strong at synthesising long documents | Minimal |
| Sonar Pro | 5 | Fast | Cites live sources inline — best for factual currency; grounded answers | Minimal — citations save verification time |
| Llama 4 Maverick | 4 | Very Fast | Significant jump from Llama 3; solid synthesis but still trails top proprietary models | Light editing |
| Grok 4 | 4 | Fast | Strong on current events; pulls from X (Twitter) context; confident tone | Light cleanup |

**Winner for Deep Research:** Sonar Pro (live citations) or Claude/Gemini (synthesis quality)

---

### Writing / Drafting

**Prompt:** *Write a 200-word executive summary of a Q3 performance review for a software team that hit 90% of OKRs.*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude Sonnet 4.6 | 5 | Medium | Reads like a human wrote it; balanced tone; best prose in class | Almost none |
| GPT-4.1 | 4 | Fast | Clean, professional, slightly formulaic but consistent | 5–10 min to add voice |
| Gemini 2.5 Pro | 4 | Medium | Significantly improved over 1.5; natural prose, less bullet-heavy | 10 min to reshape |
| Sonar Pro | 2 | Fast | Not optimised for prose generation; search grounding works against it here | Heavy rewrite needed |
| Llama 4 Maverick | 4 | Very Fast | Noticeably better than Llama 3; decent structure and voice | 10 min to polish |
| Grok 4 | 4 | Fast | Punchy, direct writing style; good for shorter formats | 5–10 min to soften tone |

**Winner for Writing:** Claude — consistently produces draft-ready prose

---

### Strategy / Planning

**Prompt:** *50-person SaaS, plateauing growth. 90-day plan to reactivate churned customers.*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude Sonnet 4.6 | 5 | Medium | Asks clarifying questions, then gives nuanced, actionable plan | Very little — output is directly usable |
| GPT-4.1 | 5 | Fast | Strong frameworks, well-structured, confident; great at structured plans | Minimal |
| Gemini 2.5 Pro | 5 | Medium | Excellent breadth and depth; improved strategic reasoning over predecessors | Light editing |
| Sonar Pro | 3 | Fast | Pulls in real examples but synthesis and structure still weak | Significant restructuring |
| Llama 4 Maverick | 4 | Very Fast | Noticeably better than Llama 3; gives real tactical depth | Light editing to contextualise |
| Grok 4 | 4 | Fast | Direct, opinionated strategy output; sometimes overconfident | Light editing |

**Winner for Strategy:** Claude (nuance) or GPT-4.1 (speed + structure)

---

### Data Analysis

**Prompt:** *Sales data: Date, Region, Product, Revenue, Units. What analysis would you run first and why?*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude Sonnet 4.6 | 5 | Medium | Walks through reasoning step-by-step; asks what decision you're trying to make | Minimal — transparent thinking |
| GPT-4.1 | 5 | Fast | Immediately produces code; Python/pandas approach; 1M context handles large datasets | Very little if you want code |
| Gemini 2.5 Pro | 5 | Medium | Data-native feel; strong code generation and reasoning; excellent for long CSV contexts | Light edits |
| Sonar Pro | 2 | Fast | Not suited for analytical reasoning | Not the right tool |
| Llama 4 Maverick | 4 | Very Fast | Good analytical framing; usable code output | Light context-setting |
| Grok 4 | 4 | Fast | Clean code output; good at explaining analytical choices | Light edits |

**Winner for Data:** GPT-4.1 (code speed + 1M context for large files) or Claude (thinking through the problem)

---

### Visual / Multimodal

**Prompt:** *Describe what a clear org chart for a matrix organisation of 200 people should look like.*
*+ Image input test: uploaded a cluttered org chart PNG and asked "what's wrong with this?"*

| Model | Text Description Quality | Image Input | Speed | Notes |
|---|:---:|:---:|---|---|
| Claude Sonnet 4.6 | 5 | Yes | Medium | Strong visual reasoning; specific, actionable critique of uploaded chart |
| GPT-4.1 | 5 | Yes | Fast | Excellent multimodal; best for "describe what you see" tasks; video input supported |
| Gemini 2.5 Pro | 5 | Yes | Medium | Best-in-class for long documents and PDFs; native multimodal from the ground up |
| Sonar Pro | 3 | Limited | Fast | Weak on image input; better for text-based visual queries |
| Llama 4 Maverick | 4 | Yes | Fast | Natively multimodal (unlike Llama 3); handles images well via Groq |
| Grok 4 | 4 | Yes | Fast | Strong image reasoning; native integration with X/Twitter image posts |

**Winner for Visual/Multimodal:** GPT-4.1 or Gemini 2.5 Pro — both are native multimodal with broad input support

---

## Summary Scorecard

| Model | Research | Writing | Strategy | Data | Visual | Overall |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Claude Sonnet 4.6 | 5 | 5 | 5 | 5 | 5 | **25/25** |
| GPT-4.1 | 4 | 4 | 5 | 5 | 5 | **23/25** |
| Gemini 2.5 Pro | 5 | 4 | 5 | 5 | 5 | **24/25** |
| Sonar Pro | 5 | 2 | 3 | 2 | 3 | **15/25** |
| Llama 4 Maverick | 4 | 4 | 4 | 4 | 4 | **20/25** |
| Grok 4 | 4 | 4 | 4 | 4 | 4 | **20/25** |

> Note: Overall score isn't everything — Sonar Pro's live search is irreplaceable for factual currency. Llama 4 and Grok 4 are now genuinely competitive with the top proprietary models at a fraction of the price.

---

## Quick Reference: Which Model for What

| Use Case | Recommended Model | Why |
|---|---|---|
| Best writing / prose | Claude Sonnet 4.6 | Consistently draft-ready output |
| Best reasoning / hard problems | Claude Opus 4.6 or o3 | Top-tier reasoning chains |
| Live research / fact-checking | Sonar Pro | Inline citations, web-grounded |
| Code generation | GPT-4.1 | Fast, accurate, 1M context for large codebases |
| Analysing long documents | Gemini 2.5 Pro | Native 1M token context |
| Budget / high-volume | Llama 4 Maverick or GPT-4.1 Nano | Near-frontier quality at near-zero cost |
| Speed at scale | Gemini 2.0 Flash or Grok 4 Fast | Sub-second latency, very cheap |
| Ultra-long context | Llama 4 Scout | 10M token context window |

---

## Key Observations

1. **The gap between open and closed models has nearly closed.** Llama 4 Maverick scores competitively with GPT-4.1 at ~$0.15/$0.60 — 10–20x cheaper than frontier proprietary models.
2. **Context windows have exploded.** 1M tokens is now the standard for flagship models. Llama 4 Scout offers 10M, and Grok 4 Fast offers 2M. Paste entire codebases, legal contracts, or full research reports without chunking.
3. **Speed vs. quality tradeoff is narrowing.** Flash/nano/fast-tier models (Gemini 2.0 Flash, GPT-4.1 Nano, Grok 4 Fast) are near-frontier quality at near-zero cost — the "cheap = bad" assumption no longer holds for most tasks.
4. **Editing time remains the hidden cost.** Even at this tier of models, a Sonar Pro response that needs 30 min of structural editing is more expensive (in your time) than a Claude response you barely touch.
5. **Multimodal is now table stakes.** Every major model supports images natively; Llama 4 Maverick is the first Llama model to do so. Text-only models are now the exception, not the rule.
6. **Specialisation still matters.** Sonar Pro for live search, o3/o3-pro for hard reasoning tasks, Gemini 2.5 Pro for long documents — the best tool depends on the job.
7. **Pricing has dropped dramatically since 2024.** Gemini 2.5 Pro at $1.25/$10 and Mistral Large 3 at $0.50/$1.50 deliver near-frontier performance at a fraction of GPT-4-era prices.
