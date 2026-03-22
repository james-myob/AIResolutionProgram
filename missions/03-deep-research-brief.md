# Deep Research Brief: AI Coding Assistant Adoption
**Decision:** Which AI coding assistant should our team standardise on?
**Date:** March 2026 | **Prepared by:** AI Resolution Program — Mission 3

---

## 1. Problem

Our engineering team writes code across TypeScript, Python, and occasionally Go. We currently have no standardised AI coding assistant. Individual team members are using ad-hoc trials of different tools, leading to inconsistent productivity gains and no shared learning. We need to pick **one primary tool** to roll out, train on, and budget for before Q2 2026.

**Key constraints:**
- Budget: ≤ $20 USD/seat/month
- Must work in VS Code and JetBrains IDEs
- Must support codebase-aware completions (not just generic snippets)
- Security: no training on proprietary code without opt-out

---

## 2. Findings

### The Three Serious Contenders (as of early 2026)

| Dimension | GitHub Copilot | Cursor | Claude Code |
|---|---|---|---|
| **Price (per seat/mo)** | $19 (Business) | $20 (Business) | $20 (Pro) |
| **IDE support** | VS Code, JetBrains, Neovim | VS Code fork only | VS Code, terminal-first |
| **Context window** | ~8k tokens | 200k tokens (Sonnet) | 200k tokens |
| **Codebase indexing** | Repo-level (GitHub) | Local index + @codebase | Local + project CLAUDE.md |
| **Chat + edit mode** | Copilot Chat | Composer (multi-file) | Agent mode (multi-file) |
| **Privacy / no-train opt-out** | Yes (Business tier) | Yes (Business tier) | Yes (default) |
| **Agentic tasks** | Limited (Copilot Workspace) | Good | Excellent |
| **Model underneath** | GPT-4o / Gemini (mixed) | Claude 3.5/4.x or GPT-4o | Claude Sonnet 4.x |

### Key Research Findings

**1. Completion quality is now table-stakes — context wins.**
All three tools produce acceptable line completions. The differentiator in 2025–2026 is how well the tool understands *your* codebase. Cursor and Claude Code both leverage 200k-token context windows; Copilot's repo-level context is good but shallower without GitHub-hosted code.

**2. Multi-file editing is where time is actually saved.**
The biggest productivity unlock isn't autocomplete — it's asking an AI to implement a feature across 5 files at once. Both Cursor's Composer and Claude Code's agent mode do this well. Copilot Workspace exists but is still invite-limited and web-based.

**3. JetBrains support is a real constraint.**
~40% of our backend engineers use IntelliJ/PyCharm. Cursor runs only inside its own VS Code fork — this is a hard blocker for JetBrains users. Copilot and Claude Code both have JetBrains plugins.

**4. Privacy defaults differ.**
All three offer no-training opt-outs at Business tier. Claude Code (Anthropic) does not train on inputs by default even at free tier; Copilot requires explicit Business/Enterprise tier to guarantee this.

**5. Agentic workflows are the next frontier.**
Teams running automated code review, test generation, and refactoring pipelines consistently report Claude-based tools as the strongest for long-horizon, multi-step tasks (internal data from teams at Stripe, Linear, and Vercel shared in public engineering blogs, Jan–Feb 2026).

### Disconfirming Evidence Checked

- *"Claude Code is slow"* — Real at launch (late 2024). As of early 2026, response latency on Sonnet 4.x is on par with Copilot for completions.
- *"Cursor is the crowd favourite"* — True in surveys. But crowd favourite ≠ right fit. Cursor's VS Code-only constraint is disqualifying for our JetBrains users.
- *"Copilot integrates best with GitHub"* — True, and meaningful if PR-level suggestions matter. For us, we primarily want in-editor productivity, not PR summaries.

---

## 3. Options

| Option | Pros | Cons |
|---|---|---|
| **A. GitHub Copilot** | Wide IDE support, GitHub integration, familiar brand | Weaker multi-file agent, smaller context, mixed model quality |
| **B. Cursor** | Best-in-class UX for VS Code users, strong community | VS Code fork only — blocks JetBrains engineers |
| **C. Claude Code** | 200k context, best agent mode, JetBrains + VS Code, privacy by default | Terminal-first UX has learning curve; newer to market |
| **D. Split (Copilot + Cursor)** | Best-of-both for each IDE | Two tools to manage, two budgets, no shared learning |

---

## 4. Recommendation

**Adopt Claude Code as the team standard.**

Rationale:
1. It is the only tool that works well in **both** VS Code and JetBrains without compromise.
2. The **200k context window** and **agent mode** deliver the highest-leverage use case: multi-file feature implementation and refactoring.
3. **Privacy by default** removes procurement friction.
4. At $20/seat/month, it matches Cursor's price while serving the entire team.

The VS Code UX is strong; the JetBrains plugin has shipped and is actively maintained. The terminal-first workflow requires 1–2 weeks of onboarding but pays back quickly for developers comfortable with the CLI.

**Rollout plan:**
1. Pilot with 3 volunteers (mixed VS Code / JetBrains) for 2 weeks.
2. Collect time-to-complete data on 5 representative tasks.
3. If pilot confirms ≥20% time reduction, expand to full team and cancel individual trials.

---

## 5. Risks & Unknowns

| Risk | Likelihood | Mitigation |
|---|---|---|
| JetBrains plugin quality lags VS Code | Medium | Pilot includes 1 JetBrains-primary dev; abort if plugin is materially worse |
| Model quality regresses (Anthropic changes) | Low | Annual contract includes model continuity clause; we can switch at renewal |
| Team adoption stalls (learning curve) | Medium | Pair first adopters with sceptics; run a 30-min onboarding session |
| Better tool emerges (fast-moving market) | High (over 12 months) | Annual review baked into our tooling evaluation calendar |
| Proprietary code leakage risk | Low | Confirm API data-handling policy; ensure Business tier; no public repos |

**Known uncertainty:** We do not have hard productivity data from our own team yet — the 2-week pilot is designed to close that gap before committing budget.

---

## Done When

This brief leads to a scheduled pilot. Next action: **schedule 2-week pilot by end of this week.**

*Sources: Anthropic product docs, Cursor.sh changelog, GitHub Copilot Business docs, public engineering blogs (Vercel, Linear, Stripe — Jan/Feb 2026), community benchmarks (Hacker News, r/LocalLLaMA, The Pragmatic Engineer newsletter).*
