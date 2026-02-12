"use client";

import Link from "next/link";
import { useMissions, useTools, useTeam, useDemos } from "@/lib/store";
import { getPaceStatus, formatDueDate } from "@/lib/dates";
import ProgressBar from "@/components/ProgressBar";

export default function Dashboard() {
  const { missions, loaded: mLoaded } = useMissions();
  const { tools, loaded: tLoaded } = useTools();
  const { members, progress, loaded: teamLoaded } = useTeam();
  const { demos, loaded: dLoaded } = useDemos();

  if (!mLoaded || !tLoaded || !teamLoaded || !dLoaded) {
    return <div className="text-[var(--gray)] py-12 text-center">Loading...</div>;
  }

  const completedMissions = missions.filter((m) => m.status === "complete").length;
  const totalMissions = missions.length;
  const toolsLogged = tools.length;
  const demosCompleted = demos.filter((d) => d.didDemo).length;

  const coreMissionIds = missions
    .filter((m) => m.number >= 1 && m.number <= 10)
    .map((m) => m.id);
  const membersOnTrack = members.filter((member) => {
    const memberCompleted = progress.filter(
      (p) => p.teamMemberId === member.id && p.completed && coreMissionIds.includes(p.missionId)
    ).length;
    return memberCompleted >= 5;
  }).length;

  const nextMission = missions.find((m) => m.status !== "complete");

  const pace = getPaceStatus(missions);
  const paceConfig = {
    ahead: { label: "Ahead of Schedule", color: "var(--green)", bg: "var(--green-light)" },
    on_track: { label: "On Track", color: "var(--green)", bg: "var(--green-light)" },
    behind: { label: "Behind Schedule", color: "var(--red)", bg: "var(--red-light)" },
  }[pace.status];

  const nextDueMission = missions.find(
    (m) => m.status !== "complete" && m.dueDate
  );

  const lastTool = tools.length > 0 ? tools[tools.length - 1] : null;
  const lastToolMission = lastTool
    ? missions.find((m) => m.id === lastTool.missionId)
    : null;

  return (
    <div className="space-y-8">
      {/* Schedule Status Banner */}
      <div
        className="rounded-xl border p-6 flex items-center justify-between"
        style={{ backgroundColor: paceConfig.bg, borderColor: paceConfig.color }}
      >
        <div>
          <h2 className="text-lg font-semibold" style={{ color: paceConfig.color }}>
            {paceConfig.label}
          </h2>
          <p className="text-sm mt-1" style={{ color: paceConfig.color, opacity: 0.8 }}>
            {pace.missionsCompleted} completed &middot; {pace.missionsDue} due by today
          </p>
        </div>
        {nextDueMission?.dueDate && (
          <div className="text-right">
            <p className="text-xs text-[var(--gray)]">Next deadline</p>
            <p className="text-sm font-semibold" style={{ color: paceConfig.color }}>
              {formatDueDate(nextDueMission.dueDate)}
            </p>
            <p className="text-xs text-[var(--gray)]">
              {nextDueMission.number === 0 ? "Day 0" : `Wk ${nextDueMission.number}`}: {nextDueMission.title}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-semibold mb-3">Overall Progress</h2>
        <ProgressBar current={completedMissions} total={totalMissions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/missions"
          className="bg-white rounded-xl border border-[var(--border)] p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h3 className="font-semibold mb-1">Missions</h3>
          <p className="text-sm text-[var(--gray)] mb-4">
            {completedMissions}/{totalMissions} complete
          </p>
          <ProgressBar
            current={completedMissions}
            total={totalMissions}
            color="var(--green)"
            size="sm"
          />
          {nextMission && (
            <p className="text-xs text-[var(--gray)] mt-3">
              Next: {nextMission.number === 0 ? "Day 0" : `Weekend ${nextMission.number}`}: {nextMission.title}
            </p>
          )}
        </Link>

        <Link
          href="/resolutions/tools"
          className="bg-white rounded-xl border border-[var(--border)] p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h3 className="font-semibold mb-1">New AI Tools</h3>
          <p className="text-sm text-[var(--gray)] mb-4">
            {toolsLogged}/3 logged
          </p>
          <ProgressBar
            current={Math.min(toolsLogged, 3)}
            total={3}
            color="var(--accent)"
            size="sm"
          />
          {lastTool && (
            <p className="text-xs text-[var(--gray)] mt-3">
              Last: {lastTool.toolName}
              {lastToolMission && ` (Wk ${lastToolMission.number})`}
            </p>
          )}
        </Link>

        <Link
          href="/resolutions/team"
          className="bg-white rounded-xl border border-[var(--border)] p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h3 className="font-semibold mb-1">Team Progress</h3>
          <p className="text-sm text-[var(--gray)] mb-4">
            {members.length === 0
              ? "No team members added yet"
              : `${membersOnTrack}/${members.length} on track`}
          </p>
          {members.length > 0 && (
            <ProgressBar
              current={membersOnTrack}
              total={members.length}
              color="var(--amber)"
              size="sm"
            />
          )}
        </Link>

        <Link
          href="/resolutions/demos"
          className="bg-white rounded-xl border border-[var(--border)] p-6 hover:border-[var(--accent)] transition-colors"
        >
          <h3 className="font-semibold mb-1">Demo Sessions</h3>
          <p className="text-sm text-[var(--gray)] mb-4">
            {demosCompleted}/10 done
          </p>
          <ProgressBar
            current={demosCompleted}
            total={10}
            color="var(--green)"
            size="sm"
          />
          {demosCompleted < 10 && (
            <p className="text-xs text-[var(--gray)] mt-3">
              Next: Session {demosCompleted + 1}
            </p>
          )}
        </Link>
      </div>

      {nextMission && (
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-sm font-semibold text-[var(--gray)] uppercase tracking-wide mb-3">
            Next Up
          </h3>
          <Link
            href={`/missions/${nextMission.id}`}
            className="hover:text-[var(--accent)] transition-colors"
          >
            <p className="font-semibold text-lg">
              {nextMission.number === 0 ? "Day 0" : `Weekend ${nextMission.number}`}:{" "}
              {nextMission.title}
            </p>
            <p className="text-[var(--gray)] text-sm mt-1">
              {nextMission.description}
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
