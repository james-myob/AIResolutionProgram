"use client";

import { useState } from "react";
import { useMissions, useTeam } from "@/lib/store";

export default function TeamProgressPage() {
  const { missions, loaded: mLoaded } = useMissions();
  const { members, progress, addMember, removeMember, toggleProgress, loaded: tLoaded } = useTeam();
  const [newName, setNewName] = useState("");

  if (!mLoaded || !tLoaded) {
    return <div className="text-[var(--gray)] py-12 text-center">Loading...</div>;
  }

  // Core missions only (1-10)
  const coreMissions = missions.filter((m) => m.number >= 1 && m.number <= 10);

  const getMemberCompleted = (memberId: string) =>
    progress.filter(
      (p) =>
        p.teamMemberId === memberId &&
        p.completed &&
        coreMissions.some((m) => m.id === p.missionId)
    ).length;

  const isCompleted = (memberId: string, missionId: string) =>
    progress.some(
      (p) => p.teamMemberId === memberId && p.missionId === missionId && p.completed
    );

  const handleAddMember = () => {
    if (newName.trim()) {
      addMember(newName.trim());
      setNewName("");
    }
  };

  // Members needing attention (less than half done relative to what's expected)
  const behindMembers = members.filter((m) => getMemberCompleted(m.id) < 3);

  const membersOnTrack = members.filter(
    (m) => getMemberCompleted(m.id) >= 5
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Progress</h1>
        {members.length > 0 && (
          <span className="text-sm text-[var(--gray)]">
            {membersOnTrack}/{members.length} on track
          </span>
        )}
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-8 text-center">
          <p className="text-[var(--gray)] mb-4">
            No team members added yet. Add your team to start tracking their progress.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--gray-light)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--gray)] sticky left-0 bg-[var(--gray-light)]">
                  Name
                </th>
                {coreMissions.map((m) => (
                  <th
                    key={m.id}
                    className="px-2 py-3 font-semibold text-[var(--gray)] text-center min-w-[40px]"
                    title={`Wk ${m.number}: ${m.title}`}
                  >
                    M{m.number}
                  </th>
                ))}
                <th className="px-3 py-3 font-semibold text-[var(--gray)] text-center">
                  Total
                </th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {members.map((member) => {
                const completed = getMemberCompleted(member.id);
                return (
                  <tr key={member.id} className="hover:bg-[var(--gray-light)]/50">
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white">
                      {member.name}
                    </td>
                    {coreMissions.map((m) => (
                      <td key={m.id} className="px-2 py-2 text-center">
                        <button
                          onClick={() => toggleProgress(member.id, m.id)}
                          className={`w-6 h-6 rounded text-xs flex items-center justify-center mx-auto transition-colors ${
                            isCompleted(member.id, m.id)
                              ? "bg-[var(--green)] text-white"
                              : "bg-[var(--gray-light)] text-[var(--gray)] hover:bg-[var(--border)]"
                          }`}
                        >
                          {isCompleted(member.id, m.id) ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            "·"
                          )}
                        </button>
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center font-medium">
                      {completed}/10
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removeMember(member.id)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Needs attention */}
      {behindMembers.length > 0 && (
        <div className="text-sm text-[var(--amber)] bg-[var(--amber-light)] rounded-lg p-3">
          Needs attention: {behindMembers.map((m) => `${m.name} (${getMemberCompleted(m.id)}/10)`).join(", ")}
        </div>
      )}

      {/* Add member */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
          placeholder="Team member name"
          className="text-sm border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)]"
        />
        <button
          onClick={handleAddMember}
          disabled={!newName.trim()}
          className="text-sm px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          + Add Team Member
        </button>
      </div>
    </div>
  );
}
