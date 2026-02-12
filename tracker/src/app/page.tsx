"use client";

import Link from "next/link";
import { useMissions, useTools, useTeam, useDemos } from "@/lib/store";
import { getPaceStatus, formatDueDate, isCompletionOnTime, getMissionDueDate, getMissionTimingStatus } from "@/lib/dates";
import ProgressBar from "@/components/ProgressBar";

export default function Dashboard() {
  const { missions, loaded: mLoaded } = useMissions();
  const { tools, loaded: tLoaded } = useTools();
  const { members, progress, loaded: teamLoaded } = useTeam();
  const { demos, loaded: dLoaded } = useDemos();

  if (!mLoaded || !tLoaded || !teamLoaded || !dLoaded) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--notion-text-tertiary)" }}>
        Loading...
      </div>
    );
  }

  const completedMissions = missions.filter((m) => m.status === "complete").length;
  const totalMissions = missions.length;
  const toolsLogged = tools.length;
  const demosCompleted = demos.filter((d) => d.didDemo).length;

  const coreMissions = missions.filter((m) => m.number >= 1 && m.number <= 10);
  const coreMissionIds = coreMissions.map((m) => m.id);

  const getMemberLateCount = (memberId: string) =>
    coreMissions.filter((m) => {
      const entry = progress.find(
        (p) => p.teamMemberId === memberId && p.missionId === m.id && p.completed
      );
      return entry && !isCompletionOnTime(m.dueDate, entry.completedAt);
    }).length;

  const membersAllOnTime = members.filter((member) => {
    const memberCompleted = progress.filter(
      (p) => p.teamMemberId === member.id && p.completed && coreMissionIds.includes(p.missionId)
    ).length;
    return memberCompleted > 0 && getMemberLateCount(member.id) === 0;
  }).length;
  const membersWithLate = members.filter(
    (m) => getMemberLateCount(m.id) > 0
  ).length;

  const nextMission = missions.find((m) => m.status !== "complete");
  const pace = getPaceStatus(missions);

  const paceConfig = {
    ahead: { label: "Ahead of Schedule", color: "var(--notion-green)", bg: "var(--notion-green-bg)", icon: "🟢" },
    on_track: { label: "On Track", color: "var(--notion-green)", bg: "var(--notion-green-bg)", icon: "🟢" },
    behind: { label: "Behind Schedule", color: "var(--notion-red)", bg: "var(--notion-red-bg)", icon: "🔴" },
  }[pace.status];

  // All missions that are due by today (complete or not)
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const allDueMissions = missions.filter((m) => {
    const due = getMissionDueDate(m.number);
    return due <= today;
  });
  // Incomplete ones that need attention
  const dueMissions = allDueMissions.filter((m) => m.status !== "complete");

  const nextDueMission = missions.find(
    (m) => m.status !== "complete" && m.dueDate
  );

  const lastTool = tools.length > 0 ? tools[tools.length - 1] : null;
  const lastToolMission = lastTool
    ? missions.find((m) => m.id === lastTool.missionId)
    : null;

  return (
    <div>
      {/* Page title - Notion style */}
      <div className="mb-8 mt-4">
        <span className="text-5xl mb-2 block">📋</span>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--notion-text)" }}
        >
          Dashboard
        </h1>
      </div>

      {/* Schedule status - Notion callout style */}
      <div className="rounded border mb-6" style={{ borderColor: "var(--notion-border)" }}>
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            backgroundColor: paceConfig.bg,
            borderBottom: allDueMissions.length > 0 ? "1px solid var(--notion-border)" : "none",
          }}
        >
          <span className="text-lg">{paceConfig.icon}</span>
          <div className="flex-1">
            <span className="font-semibold text-sm" style={{ color: paceConfig.color }}>
              {paceConfig.label}
            </span>
            <span className="text-sm ml-3" style={{ color: paceConfig.color, opacity: 0.8 }}>
              {pace.missionsCompleted} completed &middot; {pace.missionsDue} due by today
            </span>
          </div>
          {nextDueMission?.dueDate && (
            <div className="text-right">
              <span className="text-xs" style={{ color: "var(--notion-text-secondary)" }}>
                Next deadline: {formatDueDate(nextDueMission.dueDate)}
              </span>
            </div>
          )}
        </div>
        {/* Due by today breakdown - always show what's due */}
        {allDueMissions.length > 0 && (
          <div>
            <div
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium uppercase tracking-wider"
              style={{
                color: "var(--notion-text-secondary)",
                backgroundColor: "var(--notion-sidebar)",
                borderBottom: "1px solid var(--notion-border)",
              }}
            >
              Due by today
            </div>
            {allDueMissions.map((m) => {
              const isComplete = m.status === "complete";
              const timing = getMissionTimingStatus(m.dueDate, m.status, m.completedAt);
              const isOverdue = timing === "overdue";
              const isLate = timing === "late";
              return (
                <Link
                  key={m.id}
                  href={`/missions/${m.id}`}
                  className="flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ borderBottom: "1px solid var(--notion-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Checkbox indicator */}
                  <span
                    className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isComplete ? "var(--notion-green)" : "var(--notion-gray-bg)",
                      color: "white",
                    }}
                  >
                    {isComplete && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span
                    className="text-sm flex-1"
                    style={{
                      color: isComplete ? "var(--notion-text-secondary)" : "var(--notion-text)",
                      textDecoration: isComplete ? "line-through" : "none",
                      fontWeight: isComplete ? 400 : 500,
                    }}
                  >
                    {m.number === 0 ? "Day 0" : `Wk ${m.number}`}: {m.title}
                  </span>
                  {m.dueDate && (
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--notion-text-secondary)" }}>
                      {formatDueDate(m.dueDate)}
                    </span>
                  )}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-sm flex-shrink-0"
                    style={{
                      backgroundColor: isComplete
                        ? (isLate ? "var(--notion-red-bg)" : "var(--notion-green-bg)")
                        : (isOverdue ? "var(--notion-red-bg)" : "var(--notion-gray-bg)"),
                      color: isComplete
                        ? (isLate ? "var(--notion-red)" : "var(--notion-green)")
                        : (isOverdue ? "var(--notion-red)" : "var(--notion-gray)"),
                    }}
                  >
                    {isComplete
                      ? (isLate ? "Late" : "On Time")
                      : (isOverdue ? "Overdue" : "Not Started")}
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    stroke="var(--notion-text-tertiary)" strokeWidth="1.5"
                    className="flex-shrink-0"
                  >
                    <path d="M5.5 3L9.5 7L5.5 11" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Overall progress - Notion property style */}
      <div className="mb-8">
        <div
          className="text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--notion-text-secondary)" }}
        >
          Overall Progress
        </div>
        <ProgressBar current={completedMissions} total={totalMissions} color="var(--notion-green)" />
      </div>

      {/* Notion-style database/table view of quick stats */}
      <div
        className="rounded border mb-8"
        style={{ borderColor: "var(--notion-border)" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-4 text-xs font-medium uppercase tracking-wider px-3 py-2"
          style={{
            color: "var(--notion-text-secondary)",
            borderBottom: "1px solid var(--notion-border)",
            backgroundColor: "var(--notion-sidebar)",
          }}
        >
          <span>Section</span>
          <span>Progress</span>
          <span>Status</span>
          <span>Detail</span>
        </div>

        {/* Missions row */}
        <Link
          href="/missions"
          className="grid grid-cols-4 items-center px-3 py-2.5 transition-colors"
          style={{ borderBottom: "1px solid var(--notion-border)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span className="flex items-center gap-2 text-sm">
            <span>🚀</span>
            <span className="font-medium">Missions</span>
          </span>
          <span className="text-sm" style={{ color: "var(--notion-text-secondary)" }}>
            {completedMissions}/{totalMissions}
          </span>
          <span>
            <span
              className="text-xs px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: completedMissions === totalMissions ? "var(--notion-green-bg)" : "var(--notion-blue-bg)",
                color: completedMissions === totalMissions ? "var(--notion-green)" : "var(--notion-blue)",
              }}
            >
              {completedMissions === totalMissions ? "Complete" : "In Progress"}
            </span>
          </span>
          <span className="text-xs" style={{ color: "var(--notion-text-secondary)" }}>
            {nextMission
              ? `Next: ${nextMission.number === 0 ? "Day 0" : `Wk ${nextMission.number}`}`
              : "All done"}
          </span>
        </Link>

        {/* Tools row */}
        <Link
          href="/resolutions/tools"
          className="grid grid-cols-4 items-center px-3 py-2.5 transition-colors"
          style={{ borderBottom: "1px solid var(--notion-border)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span className="flex items-center gap-2 text-sm">
            <span>🔧</span>
            <span className="font-medium">Tools Log</span>
          </span>
          <span className="text-sm" style={{ color: "var(--notion-text-secondary)" }}>
            {toolsLogged}/3
          </span>
          <span>
            <span
              className="text-xs px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: toolsLogged >= 3 ? "var(--notion-green-bg)" : "var(--notion-yellow-bg)",
                color: toolsLogged >= 3 ? "var(--notion-green)" : "var(--notion-yellow)",
              }}
            >
              {toolsLogged >= 3 ? "Target Met" : `${3 - toolsLogged} to go`}
            </span>
          </span>
          <span className="text-xs" style={{ color: "var(--notion-text-secondary)" }}>
            {lastTool
              ? `Last: ${lastTool.toolName}${lastToolMission ? ` (Wk ${lastToolMission.number})` : ""}`
              : "None yet"}
          </span>
        </Link>

        {/* Team row */}
        <Link
          href="/resolutions/team"
          className="grid grid-cols-4 items-center px-3 py-2.5 transition-colors"
          style={{ borderBottom: "1px solid var(--notion-border)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span className="flex items-center gap-2 text-sm">
            <span>👥</span>
            <span className="font-medium">Team</span>
          </span>
          <span className="text-sm" style={{ color: "var(--notion-text-secondary)" }}>
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
          <span>
            {members.length > 0 ? (
              <span className="flex gap-2 text-xs">
                <span style={{ color: "var(--notion-green)" }}>{membersAllOnTime} on time</span>
                {membersWithLate > 0 && (
                  <span style={{ color: "var(--notion-red)" }}>{membersWithLate} late</span>
                )}
              </span>
            ) : (
              <span className="text-xs" style={{ color: "var(--notion-text-tertiary)" }}>
                No members
              </span>
            )}
          </span>
          <span className="text-xs" style={{ color: "var(--notion-text-secondary)" }}>
            Track completion
          </span>
        </Link>

        {/* Demos row */}
        <Link
          href="/resolutions/demos"
          className="grid grid-cols-4 items-center px-3 py-2.5 transition-colors"
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span className="flex items-center gap-2 text-sm">
            <span>🎤</span>
            <span className="font-medium">Demos</span>
          </span>
          <span className="text-sm" style={{ color: "var(--notion-text-secondary)" }}>
            {demosCompleted}/10
          </span>
          <span>
            <span
              className="text-xs px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: demosCompleted >= 10 ? "var(--notion-green-bg)" : "var(--notion-blue-bg)",
                color: demosCompleted >= 10 ? "var(--notion-green)" : "var(--notion-blue)",
              }}
            >
              {demosCompleted >= 10 ? "Complete" : `${10 - demosCompleted} remaining`}
            </span>
          </span>
          <span className="text-xs" style={{ color: "var(--notion-text-secondary)" }}>
            Session {Math.min(demosCompleted + 1, 10)}
          </span>
        </Link>
      </div>

      {/* Next Up - Notion callout style */}
      {nextMission && (
        <div>
          <div
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: "var(--notion-text-secondary)" }}
          >
            Next Up
          </div>
          <Link
            href={`/missions/${nextMission.id}`}
            className="block rounded border px-4 py-3 transition-colors"
            style={{ borderColor: "var(--notion-border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--notion-sidebar)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="font-semibold text-sm" style={{ color: "var(--notion-text)" }}>
              {nextMission.number === 0 ? "Day 0" : `Weekend ${nextMission.number}`}:{" "}
              {nextMission.title}
            </div>
            <div className="text-sm mt-0.5" style={{ color: "var(--notion-text-secondary)" }}>
              {nextMission.description}
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
