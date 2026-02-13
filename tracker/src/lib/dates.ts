// Mission 1 starts Monday February 9, 2026
// Each mission runs for 2 weeks, due on Thursday of the second week
const MISSION_1_START = new Date(2026, 1, 9); // Feb 9, 2026

export function getMissionDueDate(missionNumber: number): Date {
  if (missionNumber === 0) {
    // Setup should be done by the time Mission 1 starts
    return new Date(2026, 1, 9);
  }
  // Missions 1–10 (and 11 for bonus) each get a 2-week window
  const start = new Date(MISSION_1_START);
  start.setDate(start.getDate() + (missionNumber - 1) * 14);
  start.setDate(start.getDate() + 10); // Thursday of second week
  return start;
}

export function getMissionDueDateISO(missionNumber: number): string {
  return getMissionDueDate(missionNumber).toISOString().split("T")[0];
}

export function formatDueDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-AU", { month: "short", day: "numeric" });
}

export type TimingStatus = "on_track" | "overdue" | "on_time" | "late";

export function getMissionTimingStatus(
  dueDate: string | null,
  status: string,
  completedAt: string | null
): TimingStatus {
  if (!dueDate) return "on_track";
  const due = new Date(dueDate + "T23:59:59");
  if (status === "complete") {
    if (!completedAt) return "on_time";
    const completed = new Date(completedAt);
    return completed <= due ? "on_time" : "late";
  }
  return new Date() <= due ? "on_track" : "overdue";
}

export function isCompletionOnTime(
  dueDate: string | null,
  completedAt: string | null
): boolean {
  if (!dueDate || !completedAt) return true;
  return new Date(completedAt) <= new Date(dueDate + "T23:59:59");
}

export type PaceStatus = "ahead" | "on_track" | "behind";

export function getPaceStatus(
  missions: { number: number; status: string }[]
): { status: PaceStatus; missionsDue: number; missionsOverdue: number; missionsDueToday: number; missionsCompleted: number } {
  const now = new Date();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  let missionsOverdue = 0;
  let missionsDueToday = 0;

  for (const m of missions) {
    if (m.status === "complete") continue;
    const due = getMissionDueDate(m.number);
    if (due < startOfToday) {
      missionsOverdue++;
    } else if (due <= endOfToday) {
      missionsDueToday++;
    }
  }

  const missionsDue = missionsOverdue + missionsDueToday;

  // Total missions expected by now (including completed) for pace calculation
  const totalExpectedByNow = missions.filter((m) => {
    const due = getMissionDueDate(m.number);
    return due <= endOfToday;
  }).length;

  const missionsCompleted = missions.filter(
    (m) => m.status === "complete"
  ).length;

  let status: PaceStatus;
  if (missionsCompleted > totalExpectedByNow) {
    status = "ahead";
  } else if (missionsCompleted >= totalExpectedByNow) {
    status = "on_track";
  } else {
    status = "behind";
  }

  return { status, missionsDue, missionsOverdue, missionsDueToday, missionsCompleted };
}
