# Model Topography Sheet
## Weekend 2: The Model Mapping Project

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

| Model | Provider | Context Window | Cost (input/output per 1M tokens) | Best Access |
|---|---|:---:|---|---|
| Claude 3.7 Sonnet | Anthropic | 200K | $3 / $15 | claude.ai, API |
| GPT-4o | OpenAI | 128K | $2.50 / $10 | ChatGPT, API |
| Gemini 1.5 Pro | Google | 1M | $1.25 / $5 | Gemini.google.com, API |
| Perplexity Pro | Perplexity AI | 32K | ~$20/mo subscription | perplexity.ai |
| Llama 3.1 70B | Meta (via Groq) | 128K | ~$0.59 / $0.79 | groq.com, Ollama |
| Gemini Flash 1.5 | Google | 1M | $0.075 / $0.30 | API only |

---

## Task Performance Comparison

### Deep Research

**Prompt:** *What are the main factors driving enterprise AI adoption in 2024, and what are the biggest barriers?*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude 3.7 Sonnet | 5 | Medium | Structured, nuanced, flags uncertainty | Minimal — publishable with light edits |
| GPT-4o | 4 | Fast | Confident, comprehensive, slightly generic | Light cleanup on specifics |
| Gemini 1.5 Pro | 4 | Medium | Broad coverage, good at citing recent context | Some tightening needed |
| Perplexity Pro | 5 | Fast | Cites live sources inline — best for factual currency | Minimal — citations save verification time |
| Llama 3.1 70B | 3 | Very Fast | Solid but surface-level; lacks synthesis | Significant — needs depth added |

**Winner for Deep Research:** Perplexity (live citations) or Claude (synthesis quality)

---

### Writing / Drafting

**Prompt:** *Write a 200-word executive summary of a Q3 performance review for a software team that hit 90% of OKRs.*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude 3.7 Sonnet | 5 | Medium | Reads like a human wrote it; balanced tone | Almost none |
| GPT-4o | 4 | Fast | Clean, professional, slightly formulaic | 5–10 min to add voice |
| Gemini 1.5 Pro | 3 | Medium | Competent but bland; over-uses bullet points | 15–20 min to reshape |
| Perplexity Pro | 2 | Fast | Not optimised for prose generation | Heavy rewrite needed |
| Llama 3.1 70B | 3 | Very Fast | Decent structure, flat voice | 15 min to add personality |

**Winner for Writing:** Claude — consistently produces draft-ready prose

---

### Strategy / Planning

**Prompt:** *50-person SaaS, plateauing growth. 90-day plan to reactivate churned customers.*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude 3.7 Sonnet | 5 | Medium | Asks clarifying questions, then gives nuanced plan | Very little — output is actionable |
| GPT-4o | 5 | Fast | Strong frameworks, well-structured, confident | Minimal |
| Gemini 1.5 Pro | 4 | Medium | Good breadth, sometimes misses depth on tactics | Light editing |
| Perplexity Pro | 3 | Fast | Pulls in real examples but doesn't synthesise well | Significant restructuring |
| Llama 3.1 70B | 3 | Very Fast | Generic playbook output | Heavy editing to contextualise |

**Winner for Strategy:** Tie — Claude (nuance) or GPT-4o (speed + structure)

---

### Data Analysis

**Prompt:** *Sales data: Date, Region, Product, Revenue, Units. What analysis would you run first and why?*

| Model | Quality (1–5) | Speed | Style Notes | Editing Time Needed |
|---|:---:|---|---|---|
| Claude 3.7 Sonnet | 5 | Medium | Walks through reasoning step-by-step; asks what decision you're trying to make | Minimal — thinking process is transparent |
| GPT-4o | 5 | Fast | Immediately jumps to code; suggests Python/pandas approach | Very little if you want code |
| Gemini 1.5 Pro | 4 | Medium | Good structure; data-native feel | Light edits |
| Perplexity Pro | 2 | Fast | Not suited for analytical reasoning tasks | Not the right tool |
| Llama 3.1 70B | 3 | Very Fast | Lists analyses without prioritisation rationale | Needs significant context-setting |

**Winner for Data:** GPT-4o (if you want code fast) or Claude (if you want to think through the problem)

---

### Visual / Multimodal

**Prompt:** *Describe what a clear org chart for a matrix organisation of 200 people should look like.*
*+ Image input test: uploaded a cluttered org chart PNG and asked "what's wrong with this?"*

| Model | Text Description Quality | Image Input | Speed | Notes |
|---|:---:|:---:|---|---|
| Claude 3.7 Sonnet | 5 | Yes | Medium | Strong visual reasoning; specific, actionable critique of uploaded chart |
| GPT-4o | 5 | Yes | Fast | Excellent multimodal; best for "describe what you see" tasks |
| Gemini 1.5 Pro | 4 | Yes | Medium | Good image analysis; strongest for long documents / PDFs |
| Perplexity Pro | 3 | Limited | Fast | Weak on image input; better for text-based visual queries |
| Llama 3.1 70B | 2 | No | Very Fast | Text only (via Groq); not suitable for visual tasks |

**Winner for Visual/Multimodal:** GPT-4o (speed + accuracy) or Claude (reasoning depth)

---

## Summary Scorecard

| Model | Research | Writing | Strategy | Data | Visual | Overall |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Claude 3.7 Sonnet | 5 | 5 | 5 | 5 | 5 | **25/25** |
| GPT-4o | 4 | 4 | 5 | 5 | 5 | **23/25** |
| Gemini 1.5 Pro | 4 | 3 | 4 | 4 | 4 | **19/25** |
| Perplexity Pro | 5 | 2 | 3 | 2 | 3 | **15/25** |
| Llama 3.1 70B | 3 | 3 | 3 | 3 | 2 | **14/25** |

> Note: Overall score isn't everything — Perplexity's live search is irreplaceable for factual currency even with a lower total score.

---

## Key Observations

1. **No single model wins every category.** Perplexity is unbeatable for live research but poor at prose. Llama is fast and free but requires more prompting craft.
2. **Speed vs. quality tradeoff is real.** Llama/Flash models are 5–10x faster and near-free, but you'll spend editing time you saved on generation.
3. **Context window matters at scale.** Gemini's 1M context is genuinely useful for pasting full reports, long transcripts, or large codebases. Claude and GPT-4o are fine for most daily tasks.
4. **Editing time is the hidden cost.** A "free" or "fast" model that needs 30 min of editing can cost more (in your time) than a paid model you barely touch.
5. **Multimodal capability separates the tier-1 models.** Llama (via Groq) falls behind immediately when image input is needed.
