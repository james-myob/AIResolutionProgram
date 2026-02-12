"use client";

import { useMissions, useDemos } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";

export default function DemoSessionsPage() {
  const { missions, loaded: mLoaded } = useMissions();
  const { demos, updateDemo, loaded: dLoaded } = useDemos();

  if (!mLoaded || !dLoaded) {
    return <div className="text-[var(--gray)] py-12 text-center">Loading...</div>;
  }

  const demosCompleted = demos.filter((d) => d.didDemo).length;
  const rippleEffects = demos.filter((d) => d.rippleEffect.trim()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Demo Sessions</h1>
        <span className="text-sm text-[var(--gray)]">{demosCompleted}/10 complete</span>
      </div>

      <ProgressBar current={demosCompleted} total={10} color="var(--green)" />

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--gray-light)]">
              <th className="text-left px-4 py-3 font-semibold text-[var(--gray)] w-8">#</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--gray)]">Mission</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--gray)] w-32">Date</th>
              <th className="text-center px-4 py-3 font-semibold text-[var(--gray)] w-20">Demo?</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--gray)]">Ripple Effect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {demos.map((demo) => {
              const mission = missions.find((m) => m.id === demo.missionId);
              return (
                <tr key={demo.id} className="hover:bg-[var(--gray-light)]/50">
                  <td className="px-4 py-3 text-[var(--gray)]">{demo.sessionNumber}</td>
                  <td className="px-4 py-3">
                    {mission
                      ? `Wk ${mission.number}: ${mission.title}`
                      : `Session ${demo.sessionNumber}`}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="date"
                      value={demo.date || ""}
                      onChange={(e) => updateDemo(demo.id, { date: e.target.value || null })}
                      className="text-sm border border-[var(--border)] rounded px-2 py-1 w-full focus:outline-none focus:border-[var(--accent)]"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => updateDemo(demo.id, { didDemo: !demo.didDemo })}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center mx-auto transition-colors ${
                        demo.didDemo
                          ? "bg-[var(--green)] border-[var(--green)] text-white"
                          : "border-[var(--border)] hover:border-[var(--gray)]"
                      }`}
                    >
                      {demo.didDemo && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={demo.rippleEffect}
                      onChange={(e) => updateDemo(demo.id, { rippleEffect: e.target.value })}
                      placeholder="One thing someone asked or tried after..."
                      className="text-sm border border-[var(--border)] rounded px-2 py-1 w-full focus:outline-none focus:border-[var(--accent)]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ripple effect goal */}
      <div
        className={`text-sm rounded-lg p-3 ${
          rippleEffects >= 3
            ? "bg-[var(--green-light)] text-[var(--green)]"
            : "bg-[var(--gray-light)] text-[var(--gray)]"
        }`}
      >
        Ripple effect goal: 3+ sessions where someone tried something new
        &mdash; currently at {rippleEffects}/3
        {rippleEffects >= 3 && " — target met!"}
      </div>
    </div>
  );
}
