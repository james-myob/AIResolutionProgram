"use client";

import { useState, useRef, useEffect } from "react";
import { useMissions, useTeam } from "@/lib/store";
import { isCompletionOnTime, getDaysDelta, formatDaysDelta } from "@/lib/dates";

export default function TeamProgressPage() {
  const { missions, loaded: mLoaded } = useMissions();
  const {
    members,
    progress,
    addMember,
    removeMember,
    toggleProgress,
    updateProgressDate,
    loaded: tLoaded,
  } = useTeam();
  const [newName, setNewName] = useState("");
  // Track which cell's date is being edited: "memberId:missionId" or null
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && dateInputRef.current) {
      dateInputRef.current.showPicker?.();
    }
  }, [editingCell]);

  if (!mLoaded || !tLoaded) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--notion-text-tertiary)" }}>
        Loading...
      </div>
    );
  }

  const coreMissions = missions.filter((m) => m.number >= 1 && m.number <= 10);

  const getProgressEntry = (memberId: string, missionId: string) =>
    progress.find(
      (p) => p.teamMemberId === memberId && p.missionId === missionId && p.completed
    );

  const getMemberCompleted = (memberId: string) =>
    progress.filter(
      (p) =>
        p.teamMemberId === memberId &&
        p.completed &&
        coreMissions.some((m) => m.id === p.missionId)
    ).length;

  const getMemberOnTime = (memberId: string) =>
    coreMissions.filter((m) => {
      const entry = getProgressEntry(memberId, m.id);
      return entry && isCompletionOnTime(m.dueDate, entry.completedAt);
    }).length;

  const getMemberLate = (memberId: string) =>
    coreMissions.filter((m) => {
      const entry = getProgressEntry(memberId, m.id);
      return entry && !isCompletionOnTime(m.dueDate, entry.completedAt);
    }).length;

  const getMemberAvgDelta = (memberId: string): number | null => {
    const deltas: number[] = [];
    for (const m of coreMissions) {
      const entry = getProgressEntry(memberId, m.id);
      if (entry) {
        const d = getDaysDelta(m.dueDate, entry.completedAt);
        if (d !== null) deltas.push(d);
      }
    }
    if (deltas.length === 0) return null;
    return deltas.reduce((sum, v) => sum + v, 0) / deltas.length;
  };

  const formatAvgDelta = (avg: number): string => {
    const rounded = Math.round(avg * 10) / 10;
    if (rounded < 0) return `${Math.abs(rounded)}d early`;
    if (rounded === 0) return "On time";
    return `${rounded}d late`;
  };

  const handleAddMember = () => {
    if (newName.trim()) {
      addMember(newName.trim());
      setNewName("");
    }
  };

  const handleDateChange = (memberId: string, missionId: string, dateStr: string) => {
    if (dateStr) {
      // Store as ISO datetime at noon local to avoid timezone edge issues
      updateProgressDate(memberId, missionId, dateStr + "T12:00:00");
    }
    setEditingCell(null);
  };

  const cellKey = (memberId: string, missionId: string) => `${memberId}:${missionId}`;

  const getCompletedDateValue = (completedAt: string | null): string => {
    if (!completedAt) return "";
    const d = new Date(completedAt);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const allOnTime = members.filter(
    (m) => getMemberCompleted(m.id) > 0 && getMemberLate(m.id) === 0
  ).length;
  const someLate = members.filter((m) => getMemberLate(m.id) > 0).length;

  return (
    <div>
      {/* Page title */}
      <div className="mb-8 mt-4">
        <span className="text-5xl mb-2 block">👥</span>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--notion-text)" }}
        >
          Team Progress
        </h1>
        {members.length > 0 && (
          <p className="mt-1 text-sm" style={{ color: "var(--notion-text-secondary)" }}>
            {allOnTime} all on time &middot; {someLate} with late
          </p>
        )}
      </div>

      {members.length === 0 ? (
        <div
          className="border border-dashed rounded px-4 py-8 text-center mb-6"
          style={{ borderColor: "var(--notion-border-dark)" }}
        >
          <p className="text-sm" style={{ color: "var(--notion-text-tertiary)" }}>
            No team members added yet. Add your team to start tracking.
          </p>
        </div>
      ) : (
        <>
          {/* Notion-style table */}
          <div
            className="rounded border overflow-x-auto mb-4"
            style={{ borderColor: "var(--notion-border)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "var(--notion-sidebar)", borderBottom: "1px solid var(--notion-border)" }}>
                  <th
                    className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wider sticky left-0"
                    style={{ color: "var(--notion-text-secondary)", backgroundColor: "var(--notion-sidebar)" }}
                  >
                    Name
                  </th>
                  {coreMissions.map((m) => (
                    <th
                      key={m.id}
                      className="px-1.5 py-2 font-medium text-xs text-center min-w-[56px]"
                      style={{ color: "var(--notion-text-secondary)" }}
                      title={`Wk ${m.number}: ${m.title}`}
                    >
                      M{m.number}
                    </th>
                  ))}
                  <th className="px-2 py-2 font-medium text-xs text-center" style={{ color: "var(--notion-text-secondary)" }}>
                    Done
                  </th>
                  <th className="px-2 py-2 font-medium text-xs text-center" style={{ color: "var(--notion-green)" }}>
                    On Time
                  </th>
                  <th className="px-2 py-2 font-medium text-xs text-center" style={{ color: "var(--notion-red)" }}>
                    Late
                  </th>
                  <th className="px-2 py-2 font-medium text-xs text-center" style={{ color: "var(--notion-text-secondary)" }}>
                    Avg
                  </th>
                  <th className="px-2 py-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const completed = getMemberCompleted(member.id);
                  const onTime = getMemberOnTime(member.id);
                  const late = getMemberLate(member.id);
                  const avgDelta = getMemberAvgDelta(member.id);
                  return (
                    <tr
                      key={member.id}
                      className="transition-colors"
                      style={{ borderBottom: "1px solid var(--notion-border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td
                        className="px-3 py-1.5 font-medium text-sm sticky left-0"
                        style={{ backgroundColor: "inherit", color: "var(--notion-text)" }}
                      >
                        {member.name}
                      </td>
                      {coreMissions.map((m) => {
                        const entry = getProgressEntry(member.id, m.id);
                        const isComplete = !!entry;
                        const onTimeCompletion = entry
                          ? isCompletionOnTime(m.dueDate, entry.completedAt)
                          : true;
                        const delta = entry ? getDaysDelta(m.dueDate, entry.completedAt) : null;
                        const isEditing = editingCell === cellKey(member.id, m.id);

                        return (
                          <td key={m.id} className="px-1.5 py-1 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <button
                                onClick={() => toggleProgress(member.id, m.id)}
                                className="w-5 h-5 rounded-sm text-xs flex items-center justify-center mx-auto transition-colors"
                                style={{
                                  backgroundColor: isComplete
                                    ? onTimeCompletion
                                      ? "var(--notion-green)"
                                      : "var(--notion-red)"
                                    : "var(--notion-gray-bg)",
                                  color: isComplete ? "white" : "var(--notion-text-tertiary)",
                                }}
                                title={
                                  entry?.completedAt
                                    ? `Completed ${new Date(entry.completedAt).toLocaleDateString()}`
                                    : undefined
                                }
                              >
                                {isComplete ? (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  ""
                                )}
                              </button>
                              {isComplete && delta !== null && (
                                <>
                                  {isEditing ? (
                                    <input
                                      ref={dateInputRef}
                                      type="date"
                                      defaultValue={getCompletedDateValue(entry?.completedAt ?? null)}
                                      onChange={(e) =>
                                        handleDateChange(member.id, m.id, e.target.value)
                                      }
                                      onBlur={() => setEditingCell(null)}
                                      className="w-[70px] text-center rounded border px-0.5"
                                      style={{
                                        fontSize: "9px",
                                        borderColor: "var(--notion-border)",
                                        color: "var(--notion-text)",
                                      }}
                                    />
                                  ) : (
                                    <button
                                      onClick={() => setEditingCell(cellKey(member.id, m.id))}
                                      className="leading-none rounded px-1 py-0.5 transition-colors cursor-pointer hover:opacity-80"
                                      style={{
                                        fontSize: "9px",
                                        color: delta < 0
                                          ? "var(--notion-green)"
                                          : delta === 0
                                            ? "var(--notion-text-secondary)"
                                            : "var(--notion-red)",
                                        backgroundColor: delta < 0
                                          ? "var(--notion-green-bg, rgba(0,135,90,0.08))"
                                          : delta === 0
                                            ? "var(--notion-gray-bg)"
                                            : "var(--notion-red-bg, rgba(235,87,87,0.08))",
                                      }}
                                      title="Click to edit completion date"
                                    >
                                      {formatDaysDelta(delta)}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-2 py-1.5 text-center text-xs font-medium" style={{ color: "var(--notion-text)" }}>
                        {completed}/10
                      </td>
                      <td className="px-2 py-1.5 text-center text-xs font-medium" style={{ color: "var(--notion-green)" }}>
                        {onTime}
                      </td>
                      <td className="px-2 py-1.5 text-center text-xs font-medium" style={{ color: "var(--notion-red)" }}>
                        {late}
                      </td>
                      <td
                        className="px-2 py-1.5 text-center text-xs font-medium"
                        style={{
                          color:
                            avgDelta === null
                              ? "var(--notion-text-tertiary)"
                              : avgDelta < 0
                                ? "var(--notion-green)"
                                : avgDelta === 0
                                  ? "var(--notion-text-secondary)"
                                  : "var(--notion-red)",
                        }}
                      >
                        {avgDelta !== null ? formatAvgDelta(avgDelta) : "—"}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-xs transition-colors"
                          style={{ color: "var(--notion-text-tertiary)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--notion-red)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--notion-text-tertiary)")}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs mb-6" style={{ color: "var(--notion-text-secondary)" }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "var(--notion-green)" }}></span>
              On Time / Early
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "var(--notion-red)" }}></span>
              Late
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "var(--notion-gray-bg)" }}></span>
              Not Done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="italic">Click timing label to edit date</span>
            </span>
          </div>
        </>
      )}

      {/* Add member */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
          placeholder="Team member name"
          className="text-sm rounded border px-3 py-1.5"
          style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
        />
        <button
          onClick={handleAddMember}
          disabled={!newName.trim()}
          className="text-xs px-3 py-1.5 rounded text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "var(--notion-accent)" }}
        >
          + Add Member
        </button>
      </div>
    </div>
  );
}
