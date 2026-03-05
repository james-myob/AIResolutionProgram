"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModelResult = {
  id: string;
  label: string;
  provider: "anthropic" | "openai" | "manual";
  text: string;
  streaming: boolean;
  done: boolean;
  elapsed?: number;
  error?: string;
};

type ManualSlot = {
  id: string;
  label: string;
  text: string;
};

type Phase = "input" | "running" | "done";

// ─── Constants ────────────────────────────────────────────────────────────────

const API_MODELS: {
  id: string;
  label: string;
  provider: "anthropic" | "openai";
  defaultOn: boolean;
}[] = [
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "anthropic", defaultOn: false },
  { id: "claude-opus-4-6", label: "Claude Opus 4.6", provider: "anthropic", defaultOn: false },
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5", provider: "anthropic", defaultOn: false },
  { id: "gpt-4.1", label: "GPT-4.1", provider: "openai", defaultOn: true },
  { id: "gpt-4.1-mini", label: "GPT-4.1 Mini", provider: "openai", defaultOn: false },
  { id: "o3", label: "o3", provider: "openai", defaultOn: false },
  { id: "gpt-5.2", label: "GPT-5.2", provider: "openai", defaultOn: false },
  { id: "gpt-5.3", label: "GPT-5.3", provider: "openai", defaultOn: false },
];

const CATEGORIES = ["Writing", "Research", "Strategy", "Code", "Visual", "Other"];

const PROVIDER_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  anthropic: {
    bg: "var(--notion-orange-bg)",
    color: "var(--notion-orange)",
    border: "var(--notion-orange)",
  },
  openai: {
    bg: "var(--notion-green-bg)",
    color: "var(--notion-green)",
    border: "var(--notion-green)",
  },
  manual: {
    bg: "var(--notion-purple-bg)",
    color: "var(--notion-purple)",
    border: "var(--notion-purple)",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function fmtElapsed(ms: number) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

// ─── ModelColumn ─────────────────────────────────────────────────────────────

function ModelColumn({ result }: { result: ModelResult }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const s = PROVIDER_STYLE[result.provider];

  // Auto-scroll while streaming
  useEffect(() => {
    const el = bodyRef.current;
    if (el && result.streaming) el.scrollTop = el.scrollHeight;
  }, [result.text, result.streaming]);

  return (
    <div
      className="flex flex-col flex-shrink-0 rounded border"
      style={{ width: 320, borderColor: "var(--notion-border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 flex-shrink-0 border-b rounded-t"
        style={{
          borderColor: "var(--notion-border)",
          backgroundColor: "var(--notion-sidebar)",
        }}
      >
        <span className="font-medium text-sm truncate pr-2" style={{ color: "var(--notion-text)" }}>
          {result.label}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-sm flex-shrink-0"
          style={{ backgroundColor: s.bg, color: s.color }}
        >
          {result.provider}
        </span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-3 py-2"
        style={{ height: "55vh" }}
      >
        {result.error ? (
          <p className="text-sm" style={{ color: "var(--notion-red)" }}>
            {result.error}
          </p>
        ) : result.text ? (
          <pre
            className="text-sm whitespace-pre-wrap font-sans"
            style={{ color: "var(--notion-text)", lineHeight: 1.6 }}
          >
            {result.text}
          </pre>
        ) : (
          <div
            className="flex items-center gap-2 text-sm pt-1"
            style={{ color: "var(--notion-text-tertiary)" }}
          >
            <span className="animate-pulse">●</span>
            <span>Waiting…</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-3 py-1.5 border-t text-xs flex-shrink-0 rounded-b"
        style={{
          borderColor: "var(--notion-border)",
          color: "var(--notion-text-secondary)",
          backgroundColor: "var(--notion-sidebar)",
        }}
      >
        <span>{wordCount(result.text)} words</span>
        {result.done && result.elapsed != null && (
          <span>{fmtElapsed(result.elapsed)}</span>
        )}
        {result.streaming && !result.done && (
          <span style={{ color: "var(--notion-accent)" }}>streaming…</span>
        )}
        {result.provider === "manual" && result.done && (
          <span style={{ color: "var(--notion-purple)" }}>manual</span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(
    new Set(API_MODELS.filter((m) => m.defaultOn).map((m) => m.id))
  );
  const [manualSlots, setManualSlots] = useState<ManualSlot[]>([]);
  const [results, setResults] = useState<ModelResult[]>([]);
  const [analysis, setAnalysis] = useState("");
  const [analysisStreaming, setAnalysisStreaming] = useState(false);
  const analysisRef = useRef<HTMLDivElement>(null);

  // ── Model selection ────────────────────────────────────────────────────────

  const toggleModel = (id: string) => {
    setSelectedModels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addManualSlot = () => {
    if (manualSlots.length >= 5) return;
    setManualSlots((prev) => [
      ...prev,
      { id: `manual-${Date.now()}`, label: "", text: "" },
    ]);
  };

  const updateManualSlot = (id: string, field: "label" | "text", value: string) => {
    setManualSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const removeManualSlot = (id: string) => {
    setManualSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Run ───────────────────────────────────────────────────────────────────

  const run = useCallback(async () => {
    if (!prompt.trim() || selectedModels.size === 0) return;

    const modelsToRun = Array.from(selectedModels);

    const initialResults: ModelResult[] = modelsToRun.map((id) => {
      const config = API_MODELS.find((m) => m.id === id)!;
      return {
        id,
        label: config.label,
        provider: config.provider,
        text: "",
        streaming: false,
        done: false,
      };
    });

    setResults(initialResults);
    setAnalysis("");
    setAnalysisStreaming(false);
    setPhase("running");

    try {
      const res = await fetch("/api/compare/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), models: modelsToRun }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const handleEvent = (event: Record<string, unknown>) => {
        if (event.type === "complete") return;
        const modelId = event.model as string;
        if (!modelId) return;

        setResults((prev) =>
          prev.map((r) => {
            if (r.id !== modelId) return r;
            if (event.error) {
              return { ...r, error: event.error as string, done: true, streaming: false };
            }
            if (event.done) {
              return {
                ...r,
                done: true,
                streaming: false,
                elapsed: event.elapsed as number | undefined,
              };
            }
            if (event.delta) {
              return { ...r, text: r.text + (event.delta as string), streaming: true };
            }
            return r;
          })
        );
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              handleEvent(JSON.parse(line.slice(6)));
            } catch {
              // skip malformed
            }
          }
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
    }

    setPhase("done");
  }, [prompt, selectedModels]);

  // ── Analyse ───────────────────────────────────────────────────────────────

  const runAnalysis = useCallback(async () => {
    const apiResults = results.map((r) => ({ label: r.label, text: r.text }));
    const manualResults = manualSlots
      .filter((s) => s.label.trim() && s.text.trim())
      .map((s) => ({ label: s.label, text: s.text }));

    const allResults = [...apiResults, ...manualResults];
    if (allResults.length === 0) return;

    setAnalysis("");
    setAnalysisStreaming(true);

    try {
      const res = await fetch("/api/compare/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), category, results: allResults }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.delta) {
                setAnalysis((prev) => prev + event.delta);
                if (analysisRef.current) {
                  analysisRef.current.scrollTop = analysisRef.current.scrollHeight;
                }
              }
              if (event.done) setAnalysisStreaming(false);
            } catch {
              // skip malformed
            }
          }
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysisStreaming(false);
    }
  }, [results, manualSlots, prompt, category]);

  // ── Export ────────────────────────────────────────────────────────────────

  const exportMarkdown = () => {
    const date = new Date().toISOString().slice(0, 16).replace("T", " ");
    const slug = prompt.slice(0, 40).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const sections: string[] = [
      `# Model Comparison — ${date}`,
      "",
      `**Prompt:** ${prompt}`,
      category ? `**Category:** ${category}` : "",
      "",
      "---",
      "",
    ];

    for (const r of results) {
      sections.push(
        `## ${r.label}`,
        `*${r.provider} · ${wordCount(r.text)} words${r.elapsed != null ? ` · ${fmtElapsed(r.elapsed)}` : ""}*`,
        "",
        r.error ? `> Error: ${r.error}` : r.text,
        ""
      );
    }

    for (const s of manualSlots.filter((s) => s.label && s.text)) {
      sections.push(
        `## ${s.label} (manual)`,
        `*manual · ${wordCount(s.text)} words*`,
        "",
        s.text,
        ""
      );
    }

    if (analysis) {
      sections.push("---", "", "## Analysis", "", analysis, "");
    }

    const blob = new Blob([sections.filter((l) => l !== null).join("\n")], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comparison-${slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPhase("input");
    setResults([]);
    setAnalysis("");
    setAnalysisStreaming(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    // Break out of the layout's max-w-4xl px-24 py-8 constraints
    <div style={{ margin: "-32px -96px" }}>
      {/* Input panel */}
      {phase === "input" ? (
        <div className="px-8 py-6 border-b" style={{ borderColor: "var(--notion-border)" }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold" style={{ color: "var(--notion-text)" }}>
              Model Comparison
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--notion-text-secondary)" }}>
              Run the same prompt across models and compare the outputs side-by-side.
            </p>
          </div>

          {/* Prompt */}
          <div className="mb-4">
            <label
              className="block text-xs font-medium uppercase tracking-wider mb-1.5"
              style={{ color: "var(--notion-text-secondary)" }}
            >
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Enter a prompt to test across models…"
              className="w-full rounded border px-3 py-2 text-sm resize-none focus:outline-none"
              style={{
                borderColor: "var(--notion-border)",
                color: "var(--notion-text)",
                backgroundColor: "var(--notion-bg)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--notion-accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--notion-border)")}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label
              className="block text-xs font-medium uppercase tracking-wider mb-1.5"
              style={{ color: "var(--notion-text-secondary)" }}
            >
              Category (optional)
            </label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? null : cat)}
                  className="text-xs px-2.5 py-1 rounded-sm border transition-colors"
                  style={{
                    borderColor:
                      category === cat ? "var(--notion-accent)" : "var(--notion-border)",
                    backgroundColor:
                      category === cat ? "var(--notion-accent-bg)" : "transparent",
                    color:
                      category === cat
                        ? "var(--notion-accent)"
                        : "var(--notion-text-secondary)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* API models */}
          <div className="mb-5">
            <label
              className="block text-xs font-medium uppercase tracking-wider mb-1.5"
              style={{ color: "var(--notion-text-secondary)" }}
            >
              API Models
            </label>
            <div className="flex gap-2 flex-wrap">
              {API_MODELS.map((m) => {
                const selected = selectedModels.has(m.id);
                const s = PROVIDER_STYLE[m.provider];
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleModel(m.id)}
                    className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-sm border transition-colors"
                    style={{
                      borderColor: selected ? s.border : "var(--notion-border)",
                      backgroundColor: selected ? s.bg : "transparent",
                      color: selected ? s.color : "var(--notion-text-secondary)",
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: selected ? s.border : "var(--notion-border-dark)",
                        backgroundColor: selected ? s.color : "transparent",
                      }}
                    >
                      {selected && (
                        <svg className="w-2 h-2" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual slots (can be added at input stage) */}
          {manualSlots.length > 0 && (
            <div className="mb-4">
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                style={{ color: "var(--notion-text-secondary)" }}
              >
                Manual Models
              </label>
              <ManualSlotList
                slots={manualSlots}
                onUpdate={updateManualSlot}
                onRemove={removeManualSlot}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={run}
              disabled={!prompt.trim() || selectedModels.size === 0}
              className="px-4 py-2 rounded text-sm font-medium transition-colors"
              style={{
                backgroundColor:
                  !prompt.trim() || selectedModels.size === 0
                    ? "var(--notion-gray-bg)"
                    : "var(--notion-text)",
                color:
                  !prompt.trim() || selectedModels.size === 0
                    ? "var(--notion-text-tertiary)"
                    : "white",
              }}
            >
              Run Comparison
            </button>
            {manualSlots.length < 5 && (
              <button
                onClick={addManualSlot}
                className="text-sm transition-colors"
                style={{ color: "var(--notion-text-secondary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--notion-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--notion-text-secondary)")
                }
              >
                + Add manual model
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Collapsed prompt bar */
        <div
          className="flex items-center gap-3 px-8 py-2.5 border-b"
          style={{
            borderColor: "var(--notion-border)",
            backgroundColor: "var(--notion-sidebar)",
          }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wider flex-shrink-0"
            style={{ color: "var(--notion-text-secondary)" }}
          >
            Prompt
          </span>
          <span
            className="text-sm flex-1 truncate"
            style={{ color: "var(--notion-text)" }}
          >
            {prompt}
          </span>
          {category && (
            <span
              className="text-xs px-2 py-0.5 rounded-sm flex-shrink-0"
              style={{
                backgroundColor: "var(--notion-accent-bg)",
                color: "var(--notion-accent)",
              }}
            >
              {category}
            </span>
          )}
          <button
            onClick={reset}
            className="text-xs px-2.5 py-1 rounded border flex-shrink-0 transition-colors"
            style={{
              borderColor: "var(--notion-border)",
              color: "var(--notion-text-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--notion-sidebar-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Reset
          </button>
        </div>
      )}

      {/* Results columns */}
      {results.length > 0 && (
        <div
          className="overflow-x-auto px-8 py-4"
          style={{ backgroundColor: "var(--notion-bg)" }}
        >
          <div className="flex gap-3">
            {results.map((result) => (
              <ModelColumn key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom section: manual inputs + analysis + export */}
      {phase === "done" && (
        <div
          className="px-8 py-5 border-t"
          style={{ borderColor: "var(--notion-border)" }}
        >
          {/* Manual model inputs */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--notion-text-secondary)" }}
              >
                Manual Models
              </span>
              {manualSlots.length < 5 && (
                <button
                  onClick={addManualSlot}
                  className="text-xs transition-colors"
                  style={{ color: "var(--notion-accent)" }}
                >
                  + Add
                </button>
              )}
            </div>

            {manualSlots.length === 0 ? (
              <button
                onClick={addManualSlot}
                className="w-full text-sm text-left px-3 py-2.5 rounded border border-dashed transition-colors"
                style={{
                  borderColor: "var(--notion-border)",
                  color: "var(--notion-text-tertiary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--notion-border-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--notion-border)")
                }
              >
                + Paste a response from Gemini, Perplexity, Grok, or any other model
              </button>
            ) : (
              <ManualSlotList
                slots={manualSlots}
                onUpdate={updateManualSlot}
                onRemove={removeManualSlot}
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-5">
            {!analysis && !analysisStreaming && (
              <button
                onClick={runAnalysis}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: "var(--notion-text)", color: "white" }}
              >
                Analyse
              </button>
            )}
            {(analysis || phase === "done") && (
              <button
                onClick={exportMarkdown}
                className="px-4 py-2 rounded border text-sm transition-colors"
                style={{
                  borderColor: "var(--notion-border)",
                  color: "var(--notion-text-secondary)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--notion-sidebar)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Export as Markdown
              </button>
            )}
          </div>

          {/* Analysis output */}
          {(analysisStreaming || analysis) && (
            <div>
              <div
                className="text-xs font-medium uppercase tracking-wider mb-2"
                style={{ color: "var(--notion-text-secondary)" }}
              >
                Analysis
                {analysisStreaming && (
                  <span style={{ color: "var(--notion-accent)" }}> — streaming…</span>
                )}
              </div>
              <div
                ref={analysisRef}
                className="rounded border px-4 py-3 overflow-y-auto"
                style={{
                  borderColor: "var(--notion-border)",
                  maxHeight: 360,
                  backgroundColor: "var(--notion-sidebar)",
                }}
              >
                <pre
                  className="text-sm whitespace-pre-wrap font-sans"
                  style={{ color: "var(--notion-text)", lineHeight: 1.7 }}
                >
                  {analysis}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ManualSlotList ───────────────────────────────────────────────────────────

function ManualSlotList({
  slots,
  onUpdate,
  onRemove,
}: {
  slots: ManualSlot[];
  onUpdate: (id: string, field: "label" | "text", value: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {slots.map((slot) => (
        <div key={slot.id} className="flex gap-2 items-start">
          <input
            value={slot.label}
            onChange={(e) => onUpdate(slot.id, "label", e.target.value)}
            placeholder="Model name (e.g. Gemini 2.5 Pro)"
            className="rounded border px-2 py-1.5 text-xs focus:outline-none flex-shrink-0"
            style={{
              width: 180,
              borderColor: "var(--notion-border)",
              color: "var(--notion-text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--notion-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--notion-border)")}
          />
          <textarea
            value={slot.text}
            onChange={(e) => onUpdate(slot.id, "text", e.target.value)}
            placeholder="Paste the model output here…"
            rows={3}
            className="flex-1 rounded border px-2 py-1.5 text-xs resize-none focus:outline-none"
            style={{
              borderColor: "var(--notion-border)",
              color: "var(--notion-text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--notion-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--notion-border)")}
          />
          <button
            onClick={() => onRemove(slot.id)}
            className="text-xs px-2 py-1.5 rounded border flex-shrink-0 transition-colors"
            style={{
              borderColor: "var(--notion-border)",
              color: "var(--notion-text-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--notion-red-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
