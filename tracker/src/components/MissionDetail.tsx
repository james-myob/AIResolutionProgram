"use client";

import Link from "next/link";
import { useMissions } from "@/lib/store";
import { MissionStatus } from "@/lib/types";
import { formatDueDate } from "@/lib/dates";

const STATUS_OPTIONS: { value: MissionStatus; label: string }[] = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
];

export default function MissionDetail({ id }: { id: string }) {
  const { missions, updateMission, loaded } = useMissions();

  if (!loaded) {
    return <div className="text-[var(--gray)] py-12 text-center">Loading...</div>;
  }

  const mission = missions.find((m) => m.id === id);

  if (!mission) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--gray)]">Mission not found.</p>
        <Link href="/missions" className="text-[var(--accent)] text-sm mt-2 inline-block">
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

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href="/missions"
        className="text-sm text-[var(--gray)] hover:text-[var(--foreground)] transition-colors"
      >
        &larr; Back to Missions
      </Link>

      <div>
        <h1 className="text-2xl font-bold">
          {mission.number === 0 ? "Day 0" : `Weekend ${mission.number}`}: {mission.title}
        </h1>
        <p className="text-[var(--gray)] mt-1">{mission.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium w-20">Status</label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                  mission.status === opt.value
                    ? opt.value === "complete"
                      ? "bg-[var(--green-light)] border-[var(--green)] text-[var(--green)]"
                      : opt.value === "in_progress"
                      ? "bg-[var(--amber-light)] border-[var(--amber)] text-[var(--amber)]"
                      : "bg-[var(--gray-light)] border-[var(--gray)] text-[var(--gray)]"
                    : "border-[var(--border)] text-[var(--gray)] hover:border-[var(--gray)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {mission.dueDate && (() => {
          const isOverdue =
            mission.status !== "complete" &&
            new Date(mission.dueDate + "T23:59:59") < new Date();
          return (
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium w-20">Due</label>
              <span
                className="text-sm"
                style={{ color: isOverdue ? "var(--red)" : "var(--gray)" }}
              >
                {formatDueDate(mission.dueDate)}
                {isOverdue && " — Overdue"}
              </span>
            </div>
          );
        })()}

        {mission.completedAt && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium w-20">Completed</label>
            <span className="text-sm text-[var(--green)]">
              {new Date(mission.completedAt).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-sm font-semibold text-[var(--gray)] uppercase tracking-wide mb-3">
          Notes
        </h2>
        <textarea
          value={mission.notes}
          onChange={(e) => updateMission(mission.id, { notes: e.target.value })}
          placeholder="What did you build? What did you learn? Jot it down..."
          className="w-full min-h-[160px] text-sm border border-[var(--border)] rounded-lg p-3 resize-y focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>
    </div>
  );
}
