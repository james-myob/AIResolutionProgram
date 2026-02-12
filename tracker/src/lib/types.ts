export type MissionStatus = "not_started" | "in_progress" | "complete";

export interface Mission {
  id: string;
  number: number;
  title: string;
  description: string;
  category: "Foundation" | "Core Projects" | "Automation" | "System & Build" | "Bonus";
  status: MissionStatus;
  dueDate: string | null;
  completedAt: string | null;
  notes: string;
}

export interface NewToolEntry {
  id: string;
  toolName: string;
  missionId: string;
  taskUsedFor: string;
  strengths: string;
  weaknesses: string;
  loggedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
}

export interface TeamProgress {
  teamMemberId: string;
  missionId: string;
  completed: boolean;
}

export interface DemoSession {
  id: string;
  sessionNumber: number;
  missionId: string;
  date: string | null;
  didDemo: boolean;
  rippleEffect: string;
}
