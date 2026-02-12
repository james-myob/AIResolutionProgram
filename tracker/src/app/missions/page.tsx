"use client";

import Link from "next/link";
import { useMissions } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";
import { MissionStatus } from "@/lib/types";
import { formatDueDate, getMissionTimingStatus } from "@/lib/dates";

const TIMING_DISPLAY = {
  on_track: { label: "On Track", color: "var(--green)", bg: "var(--green-light)" },
  overdue: { label: "Overdue", color: "var(--red)", bg: "var(--red-light)" },
  on_time: { label: "On Time", color: "var(--green)", bg: "var(--green-light)" },
  late: { label: "Late", color: "var(--red)", bg: "var(--red-light)" },
};

const STATUS_DISPLAY: Record<MissionStatus, { label: string; color: string; bg: string }> = {
  complete: { label: "Complete", color: "var(--green)", bg: "var(--green-light)" },
  in_progress: { label: "In Progress", color: "var(--amber)", bg: "var(--amber-light)" },
  not_started: { label: "Not Started", color: "var(--gray)", bg: "var(--gray-light)" },
};

const CATEGORIES = ["Foundation", "Core Projects", "Automation", "System & Build", "Bonus"] as const;

export default function MissionsPage() {
  const { missions, updateMission, loaded } = useMissions();

  if (!loaded) {
    return <div className="text-[var(--gray)] py-12 text-center">Loading...</div>;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Missions</h1>
        <span className="text-sm text-[var(--gray)]">
          {completed}/{missions.length} done
        </span>
      </div>

      <ProgressBar current={completed} total={missions.length} color="var(--green)" />

      {CATEGORIES.map((category) => {
        const categoryMissions = missions.filter((m) => m.category === category);
        if (categoryMissions.length === 0) return null;

        return (
          <div key={category} className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--gray-light)]">
              <h2 className="text-sm font-semibold text-[var(--gray)]">{category}</h2>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {categoryMissions.map((mission) => {
                const status = STATUS_DISPLAY[mission.status];
                const timing = getMissionTimingStatus(mission.dueDate, mission.status, mission.completedAt);
                const timingDisplay = TIMING_DISPLAY[timing];
                return (
                  <div
                    key={mission.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--gray-light)]/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleComplete(mission.id, mission.status)}
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        mission.status === "complete"
                          ? "bg-[var(--green)] border-[var(--green)] text-white"
                          : "border-[var(--border)] hover:border-[var(--gray)]"
                      }`}
                    >
                      {mission.status === "complete" && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <Link href={`/missions/${mission.id}`} className="flex-1 min-w-0">
                      <span className="font-medium text-sm">
                        {mission.number === 0 ? "Day 0" : `Wk ${mission.number}`}: {mission.title}
                      </span>
                    </Link>
                    {mission.dueDate && (
                      <span className="text-xs flex-shrink-0 text-[var(--gray)]">
                        Due {formatDueDate(mission.dueDate)}
                      </span>
                    )}
                    <span
                      className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.label}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                      style={{ color: timingDisplay.color, backgroundColor: timingDisplay.bg }}
                    >
                      {timingDisplay.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
