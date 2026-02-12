"use client";

import { useMissions, useDemos } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";

export default function DemoSessionsPage() {
  const { missions, loaded: mLoaded } = useMissions();
  const { demos, updateDemo, loaded: dLoaded } = useDemos();

  if (!mLoaded || !dLoaded) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--notion-text-tertiary)" }}>
        Loading...
      </div>
    );
  }

  const demosCompleted = demos.filter((d) => d.didDemo).length;
  const rippleEffects = demos.filter((d) => d.rippleEffect.trim()).length;

  return (
    <div>
      {/* Page title */}
      <div className="mb-8 mt-4">
        <span className="text-5xl mb-2 block">🎤</span>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--notion-text)" }}
        >
          Demo Sessions
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--notion-text-secondary)" }}>
          {demosCompleted} of 10 complete
        </p>
      </div>

      <div className="mb-6">
        <ProgressBar current={demosCompleted} total={10} color="var(--notion-green)" />
      </div>

      {/* Notion-style table */}
      <div
        className="rounded border mb-6"
        style={{ borderColor: "var(--notion-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--notion-sidebar)" }}>
              <th
                className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider w-8"
                style={{ color: "var(--notion-text-secondary)", borderBottom: "1px solid var(--notion-border)" }}
              >
                #
              </th>
              <th
                className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider"
                style={{ color: "var(--notion-text-secondary)", borderBottom: "1px solid var(--notion-border)" }}
              >
                Mission
              </th>
              <th
                className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider w-32"
                style={{ color: "var(--notion-text-secondary)", borderBottom: "1px solid var(--notion-border)" }}
              >
                Date
              </th>
              <th
                className="text-center px-3 py-2 font-medium text-xs uppercase tracking-wider w-16"
                style={{ color: "var(--notion-text-secondary)", borderBottom: "1px solid var(--notion-border)" }}
              >
                Demo
              </th>
              <th
                className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider"
                style={{ color: "var(--notion-text-secondary)", borderBottom: "1px solid var(--notion-border)" }}
              >
                Ripple Effect
              </th>
            </tr>
          </thead>
          <tbody>
            {demos.map((demo) => {
              const mission = missions.find((m) => m.id === demo.missionId);
              return (
                <tr
                  key={demo.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid var(--notion-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-3 py-2" style={{ color: "var(--notion-text-tertiary)" }}>
                    {demo.sessionNumber}
                  </td>
                  <td className="px-3 py-2" style={{ color: "var(--notion-text)" }}>
                    {mission
                      ? `Wk ${mission.number}: ${mission.title}`
                      : `Session ${demo.sessionNumber}`}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={demo.date || ""}
                      onChange={(e) => updateDemo(demo.id, { date: e.target.value || null })}
                      className="text-sm rounded border px-2 py-0.5 w-full"
                      style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => updateDemo(demo.id, { didDemo: !demo.didDemo })}
                      className="w-4 h-4 rounded-sm border flex items-center justify-center mx-auto transition-colors"
                      style={{
                        borderColor: demo.didDemo ? "var(--notion-green)" : "var(--notion-border-dark)",
                        backgroundColor: demo.didDemo ? "var(--notion-green)" : "transparent",
                        color: "white",
                      }}
                    >
                      {demo.didDemo && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={demo.rippleEffect}
                      onChange={(e) => updateDemo(demo.id, { rippleEffect: e.target.value })}
                      placeholder="One thing someone asked or tried after..."
                      className="text-sm rounded border px-2 py-0.5 w-full"
                      style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ripple effect callout */}
      <div
        className="flex items-center gap-3 rounded px-4 py-3 text-sm"
        style={{
          backgroundColor: rippleEffects >= 3 ? "var(--notion-green-bg)" : "var(--notion-gray-bg)",
          color: rippleEffects >= 3 ? "var(--notion-green)" : "var(--notion-text-secondary)",
        }}
      >
        <span>{rippleEffects >= 3 ? "🎯" : "💡"}</span>
        <span>
          Ripple effect goal: 3+ sessions where someone tried something new
          — currently at {rippleEffects}/3
          {rippleEffects >= 3 && " — target met!"}
        </span>
      </div>
    </div>
  );
}
