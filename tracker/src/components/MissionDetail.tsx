"use client";

import Link from "next/link";
import { useMissions } from "@/lib/store";
import { MissionStatus } from "@/lib/types";
import { formatDueDate, getMissionTimingStatus } from "@/lib/dates";

const TIMING_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  on_track: { label: "On Track", color: "var(--notion-green)", bg: "var(--notion-green-bg)" },
  overdue: { label: "Overdue", color: "var(--notion-red)", bg: "var(--notion-red-bg)" },
  on_time: { label: "On Time", color: "var(--notion-green)", bg: "var(--notion-green-bg)" },
  late: { label: "Late", color: "var(--notion-red)", bg: "var(--notion-red-bg)" },
};

const STATUS_OPTIONS: { value: MissionStatus; label: string; color: string; bg: string }[] = [
  { value: "not_started", label: "Not Started", color: "var(--notion-gray)", bg: "var(--notion-gray-bg)" },
  { value: "in_progress", label: "In Progress", color: "var(--notion-orange)", bg: "var(--notion-orange-bg)" },
  { value: "complete", label: "Complete", color: "var(--notion-green)", bg: "var(--notion-green-bg)" },
];

export default function MissionDetail({ id }: { id: string }) {
  const { missions, updateMission, loaded } = useMissions();

  if (!loaded) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--notion-text-tertiary)" }}>
        Loading...
      </div>
    );
  }

  const mission = missions.find((m) => m.id === id);

  if (!mission) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--notion-text-secondary)" }}>Mission not found.</p>
        <Link href="/missions" className="text-sm mt-2 inline-block" style={{ color: "var(--notion-accent)" }}>
          Back to Missions
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: MissionStatus) => {
    const updates: Partial<typeof mission> = { status: newStatus };
    if (newStatus === "complete") {
      updates.completedAt = new Date().toISOString();
    } else {
      updates.completedAt = null;
    }
    updateMission(mission.id, updates);
  };

  const missionIcon =
    mission.category === "Foundation" ? "🏗️" :
    mission.category === "Core Projects" ? "⚡" :
    mission.category === "Automation" ? "🤖" :
    mission.category === "System & Build" ? "🔨" : "⭐";

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <Link
        href="/missions"
        className="text-sm transition-colors inline-flex items-center gap-1 mb-6"
        style={{ color: "var(--notion-text-secondary)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--notion-text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--notion-text-secondary)")}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8.5 3L4.5 7L8.5 11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Missions
      </Link>

      {/* Page title */}
      <div className="mb-6">
        <span className="text-5xl mb-2 block">{missionIcon}</span>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--notion-text)" }}
        >
          {mission.number === 0 ? "Day 0" : `Weekend ${mission.number}`}: {mission.title}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--notion-text-secondary)" }}>
          {mission.description}
        </p>
      </div>

      {/* Properties - Notion style */}
      <div
        className="rounded border mb-6"
        style={{ borderColor: "var(--notion-border)" }}
      >
        {/* Status */}
        <div
          className="flex items-center px-3 py-2"
          style={{ borderBottom: "1px solid var(--notion-border)" }}
        >
          <span
            className="text-xs font-medium w-28 flex-shrink-0"
            style={{ color: "var(--notion-text-secondary)" }}
          >
            Status
          </span>
          <div className="flex gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className="text-xs px-2 py-0.5 rounded-sm transition-all"
                style={{
                  backgroundColor: mission.status === opt.value ? opt.bg : "transparent",
                  color: mission.status === opt.value ? opt.color : "var(--notion-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (mission.status !== opt.value) {
                    e.currentTarget.style.backgroundColor = "var(--notion-sidebar-hover)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (mission.status !== opt.value) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div
          className="flex items-center px-3 py-2"
          style={{ borderBottom: "1px solid var(--notion-border)" }}
        >
          <span
            className="text-xs font-medium w-28 flex-shrink-0"
            style={{ color: "var(--notion-text-secondary)" }}
          >
            Category
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-sm"
            style={{ backgroundColor: "var(--notion-purple-bg)", color: "var(--notion-purple)" }}
          >
            {mission.category}
          </span>
        </div>

        {/* Due date */}
        {mission.dueDate && (() => {
          const timing = getMissionTimingStatus(mission.dueDate, mission.status, mission.completedAt);
          const td = TIMING_BADGE[timing];
          return (
            <div
              className="flex items-center px-3 py-2"
              style={{ borderBottom: "1px solid var(--notion-border)" }}
            >
              <span
                className="text-xs font-medium w-28 flex-shrink-0"
                style={{ color: "var(--notion-text-secondary)" }}
              >
                Due Date
              </span>
              <span className="text-sm" style={{ color: "var(--notion-text)" }}>
                {formatDueDate(mission.dueDate)}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-sm ml-2"
                style={{ color: td.color, backgroundColor: td.bg }}
              >
                {td.label}
              </span>
            </div>
          );
        })()}

        {/* Completed */}
        {mission.completedAt && (
          <div className="flex items-center px-3 py-2">
            <span
              className="text-xs font-medium w-28 flex-shrink-0"
              style={{ color: "var(--notion-text-secondary)" }}
            >
              Completed
            </span>
            <span className="text-sm" style={{ color: "var(--notion-green)" }}>
              {new Date(mission.completedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <div
          className="text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--notion-text-secondary)" }}
        >
          Notes
        </div>
        <textarea
          value={mission.notes}
          onChange={(e) => updateMission(mission.id, { notes: e.target.value })}
          placeholder="What did you build? What did you learn? Jot it down..."
          className="w-full min-h-[200px] text-sm rounded border p-3 resize-y transition-colors"
          style={{
            borderColor: "var(--notion-border)",
            color: "var(--notion-text)",
            backgroundColor: "var(--notion-bg)",
          }}
        />
      </div>
    </div>
  );
}
