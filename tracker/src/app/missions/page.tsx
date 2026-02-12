"use client";

import Link from "next/link";
import { useMissions } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";
import { MissionStatus } from "@/lib/types";
import { formatDueDate, getMissionTimingStatus } from "@/lib/dates";

const TIMING_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  on_track: { label: "On Track", color: "var(--notion-green)", bg: "var(--notion-green-bg)" },
  overdue: { label: "Overdue", color: "var(--notion-red)", bg: "var(--notion-red-bg)" },
  on_time: { label: "On Time", color: "var(--notion-green)", bg: "var(--notion-green-bg)" },
  late: { label: "Late", color: "var(--notion-red)", bg: "var(--notion-red-bg)" },
};

const STATUS_BADGE: Record<MissionStatus, { label: string; color: string; bg: string }> = {
  complete: { label: "Complete", color: "var(--notion-green)", bg: "var(--notion-green-bg)" },
  in_progress: { label: "In Progress", color: "var(--notion-orange)", bg: "var(--notion-orange-bg)" },
  not_started: { label: "Not Started", color: "var(--notion-gray)", bg: "var(--notion-gray-bg)" },
};

const CATEGORIES = ["Foundation", "Core Projects", "Automation", "System & Build", "Bonus"] as const;

const CATEGORY_ICONS: Record<string, string> = {
  Foundation: "🏗️",
  "Core Projects": "⚡",
  Automation: "🤖",
  "System & Build": "🔨",
  Bonus: "⭐",
};

export default function MissionsPage() {
  const { missions, updateMission, loaded } = useMissions();

  if (!loaded) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--notion-text-tertiary)" }}>
        Loading...
      </div>
    );
  }

  const completed = missions.filter((m) => m.status === "complete").length;

  const toggleComplete = (id: string, currentStatus: MissionStatus) => {
    if (currentStatus === "complete") {
      updateMission(id, { status: "not_started", completedAt: null });
    } else {
      updateMission(id, { status: "complete", completedAt: new Date().toISOString() });
    }
  };

  return (
    <div>
      {/* Page title */}
      <div className="mb-8 mt-4">
        <span className="text-5xl mb-2 block">🚀</span>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--notion-text)" }}
        >
          Missions
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--notion-text-secondary)" }}>
          {completed} of {missions.length} complete
        </p>
      </div>

      <div className="mb-6">
        <ProgressBar current={completed} total={missions.length} color="var(--notion-green)" />
      </div>

      {/* Notion-style database table */}
      <div
        className="rounded border"
        style={{ borderColor: "var(--notion-border)" }}
      >
        {/* Table header */}
        <div
          className="grid text-xs font-medium uppercase tracking-wider px-3 py-2"
          style={{
            gridTemplateColumns: "32px 1fr 80px 90px 80px",
            color: "var(--notion-text-secondary)",
            borderBottom: "1px solid var(--notion-border)",
            backgroundColor: "var(--notion-sidebar)",
          }}
        >
          <span></span>
          <span>Mission</span>
          <span>Due</span>
          <span>Status</span>
          <span>Timing</span>
        </div>

        {CATEGORIES.map((category) => {
          const categoryMissions = missions.filter((m) => m.category === category);
          if (categoryMissions.length === 0) return null;

          return (
            <div key={category}>
              {/* Category group header */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: "var(--notion-sidebar)",
                  borderBottom: "1px solid var(--notion-border)",
                  color: "var(--notion-text-secondary)",
                }}
              >
                <span>{CATEGORY_ICONS[category]}</span>
                <span>{category}</span>
                <span style={{ color: "var(--notion-text-tertiary)" }}>
                  {categoryMissions.filter((m) => m.status === "complete").length}/{categoryMissions.length}
                </span>
              </div>

              {/* Missions in category */}
              {categoryMissions.map((mission) => {
                const status = STATUS_BADGE[mission.status];
                const timing = getMissionTimingStatus(mission.dueDate, mission.status, mission.completedAt);
                const timingDisplay = TIMING_BADGE[timing];
                return (
                  <div
                    key={mission.id}
                    className="grid items-center px-3 py-2 transition-colors"
                    style={{
                      gridTemplateColumns: "32px 1fr 80px 90px 80px",
                      borderBottom: "1px solid var(--notion-border)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--notion-sidebar)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleComplete(mission.id, mission.status)}
                      className="flex items-center justify-center w-4 h-4 rounded-sm border transition-colors"
                      style={{
                        borderColor:
                          mission.status === "complete"
                            ? "var(--notion-green)"
                            : "var(--notion-border-dark)",
                        backgroundColor:
                          mission.status === "complete"
                            ? "var(--notion-green)"
                            : "transparent",
                        color: "white",
                      }}
                    >
                      {mission.status === "complete" && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Title */}
                    <Link
                      href={`/missions/${mission.id}`}
                      className="text-sm transition-colors truncate"
                      style={{
                        color: mission.status === "complete" ? "var(--notion-text-secondary)" : "var(--notion-text)",
                        textDecoration: mission.status === "complete" ? "line-through" : "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--notion-accent)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          mission.status === "complete"
                            ? "var(--notion-text-secondary)"
                            : "var(--notion-text)")
                      }
                    >
                      <span className="font-medium">
                        {mission.number === 0 ? "Day 0" : `Wk ${mission.number}`}
                      </span>
                      <span style={{ color: "var(--notion-text-tertiary)", margin: "0 4px" }}>·</span>
                      {mission.title}
                    </Link>

                    {/* Due date */}
                    <span className="text-xs" style={{ color: "var(--notion-text-secondary)" }}>
                      {mission.dueDate ? formatDueDate(mission.dueDate) : "—"}
                    </span>

                    {/* Status badge */}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-sm w-fit"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.label}
                    </span>

                    {/* Timing badge */}
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-sm w-fit"
                      style={{ color: timingDisplay.color, backgroundColor: timingDisplay.bg }}
                    >
                      {timingDisplay.label}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
