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

export type PaceStatus = "ahead" | "on_track" | "behind";

export function getPaceStatus(
  missions: { number: number; status: string }[]
): { status: PaceStatus; missionsDue: number; missionsCompleted: number } {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // end of today so "due today" counts as due

  const missionsDue = missions.filter((m) => {
    const due = getMissionDueDate(m.number);
    return due <= today;
  }).length;

  const missionsCompleted = missions.filter(
    (m) => m.status === "complete"
  ).length;

  let status: PaceStatus;
  if (missionsCompleted > missionsDue) {
    status = "ahead";
  } else if (missionsCompleted >= missionsDue) {
    status = "on_track";
  } else {
    status = "behind";
  }

  return { status, missionsDue, missionsCompleted };
}
