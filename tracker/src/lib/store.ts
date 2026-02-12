"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mission,
  NewToolEntry,
  TeamMember,
  TeamProgress,
  DemoSession,
} from "./types";
import { SEED_MISSIONS, SEED_DEMO_SESSIONS } from "./seed";
import { getMissionDueDateISO } from "./dates";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage("tracker_missions", SEED_MISSIONS);
    // Backfill due dates for missions saved before due dates were added
    const migrated = stored.map((m) => ({
      ...m,
      dueDate: m.dueDate || getMissionDueDateISO(m.number),
    }));
    setMissions(migrated);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveToStorage("tracker_missions", missions);
  }, [missions, loaded]);

  const updateMission = useCallback((id: string, updates: Partial<Mission>) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  return { missions, updateMission, loaded };
}

export function useTools() {
  const [tools, setTools] = useState<NewToolEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTools(loadFromStorage("tracker_tools", []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveToStorage("tracker_tools", tools);
  }, [tools, loaded]);

  const addTool = useCallback((tool: NewToolEntry) => {
    setTools((prev) => [...prev, tool]);
  }, []);

  const updateTool = useCallback((id: string, updates: Partial<NewToolEntry>) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTool = useCallback((id: string) => {
    setTools((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tools, addTool, updateTool, deleteTool, loaded };
}

export function useTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [progress, setProgress] = useState<TeamProgress[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMembers(loadFromStorage("tracker_team_members", []));
    setProgress(loadFromStorage("tracker_team_progress", []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveToStorage("tracker_team_members", members);
      saveToStorage("tracker_team_progress", progress);
    }
  }, [members, progress, loaded]);

  const addMember = useCallback((name: string) => {
    const member: TeamMember = { id: `member-${Date.now()}`, name };
    setMembers((prev) => [...prev, member]);
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setProgress((prev) => prev.filter((p) => p.teamMemberId !== id));
  }, []);

  const toggleProgress = useCallback(
    (teamMemberId: string, missionId: string) => {
      setProgress((prev) => {
        const existing = prev.find(
          (p) => p.teamMemberId === teamMemberId && p.missionId === missionId
        );
        if (existing) {
          return prev.map((p) =>
            p.teamMemberId === teamMemberId && p.missionId === missionId
              ? { ...p, completed: !p.completed }
              : p
          );
        }
        return [...prev, { teamMemberId, missionId, completed: true }];
      });
    },
    []
  );

  return { members, progress, addMember, removeMember, toggleProgress, loaded };
}

export function useDemos() {
  const [demos, setDemos] = useState<DemoSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDemos(loadFromStorage("tracker_demos", SEED_DEMO_SESSIONS));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveToStorage("tracker_demos", demos);
  }, [demos, loaded]);

  const updateDemo = useCallback(
    (id: string, updates: Partial<DemoSession>) => {
      setDemos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    []
  );

  return { demos, updateDemo, loaded };
}
