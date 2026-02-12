"use client";

import { useState } from "react";
import Link from "next/link";
import { useMissions, useTools } from "@/lib/store";
import ProgressBar from "@/components/ProgressBar";
import { NewToolEntry } from "@/lib/types";

export default function ToolsLogPage() {
  const { missions, loaded: mLoaded } = useMissions();
  const { tools, addTool, updateTool, deleteTool, loaded: tLoaded } = useTools();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    toolName: "",
    missionId: "",
    taskUsedFor: "",
    strengths: "",
    weaknesses: "",
  });

  if (!mLoaded || !tLoaded) {
    return <div className="text-[var(--gray)] py-12 text-center">Loading...</div>;
  }

  const resetForm = () => {
    setForm({ toolName: "", missionId: "", taskUsedFor: "", strengths: "", weaknesses: "" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.toolName.trim()) return;

    if (editingId) {
      updateTool(editingId, { ...form });
    } else {
      const entry: NewToolEntry = {
        id: `tool-${Date.now()}`,
        ...form,
        loggedAt: new Date().toISOString(),
      };
      addTool(entry);
    }
    resetForm();
  };

  const startEdit = (tool: NewToolEntry) => {
    setForm({
      toolName: tool.toolName,
      missionId: tool.missionId,
      taskUsedFor: tool.taskUsedFor,
      strengths: tool.strengths,
      weaknesses: tool.weaknesses,
    });
    setEditingId(tool.id);
    setShowForm(true);
  };

  const getMissionLabel = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return "—";
    return mission.number === 0 ? "Day 0: Setup" : `Wk ${mission.number}: ${mission.title}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New AI Tools Explored</h1>
        <span className="text-sm text-[var(--gray)]">{tools.length}/3 target</span>
      </div>

      <ProgressBar current={Math.min(tools.length, 3)} total={3} color="var(--accent)" />

      {/* Tool entries */}
      <div className="space-y-4">
        {tools.map((tool, index) => {
          const mission = missions.find((m) => m.id === tool.missionId);
          return (
            <div
              key={tool.id}
              className="bg-white rounded-xl border border-[var(--border)] p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm text-[var(--gray)] mr-2">{index + 1}.</span>
                  <span className="font-semibold">{tool.toolName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {mission && (
                    <Link
                      href={`/missions/${mission.id}`}
                      className="text-xs px-2 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] hover:underline"
                    >
                      {mission.number === 0 ? "Day 0" : `Weekend ${mission.number}`}
                    </Link>
                  )}
                  <button
                    onClick={() => startEdit(tool)}
                    className="text-xs text-[var(--gray)] hover:text-[var(--foreground)]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTool(tool.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--gray)] mb-3">Task: {tool.taskUsedFor}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-[var(--green-light)] rounded-lg p-3">
                  <span className="font-medium text-[var(--green)]">Does well: </span>
                  {tool.strengths}
                </div>
                <div className="bg-[var(--amber-light)] rounded-lg p-3">
                  <span className="font-medium text-[var(--amber)]">Falls short: </span>
                  {tool.weaknesses}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state placeholder */}
        {tools.length < 3 && !showForm && (
          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-sm text-[var(--gray)] mb-1">
              {tools.length === 0
                ? "No tools logged yet. Try something new this weekend!"
                : `${3 - tools.length} more to go`}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 space-y-4">
          <h3 className="font-semibold">{editingId ? "Edit Tool" : "Log New Tool"}</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Tool / Platform Name</label>
            <input
              type="text"
              value={form.toolName}
              onChange={(e) => setForm({ ...form, toolName: e.target.value })}
              placeholder="e.g. Cursor, Midjourney, Claude..."
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mission Used In</label>
            <select
              value={form.missionId}
              onChange={(e) => setForm({ ...form, missionId: e.target.value })}
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="">Select a mission...</option>
              {missions.map((m) => (
                <option key={m.id} value={m.id}>
                  {getMissionLabel(m.id)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">What task did you use it on?</label>
            <input
              type="text"
              value={form.taskUsedFor}
              onChange={(e) => setForm({ ...form, taskUsedFor: e.target.value })}
              placeholder="e.g. Built research brief with AI pair coding"
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">What it does well</label>
              <textarea
                value={form.strengths}
                onChange={(e) => setForm({ ...form, strengths: e.target.value })}
                placeholder="e.g. Great at code generation from natural language"
                className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 min-h-[80px] resize-y focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Where it falls short</label>
              <textarea
                value={form.weaknesses}
                onChange={(e) => setForm({ ...form, weaknesses: e.target.value })}
                placeholder="e.g. Gets confused on large files"
                className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 min-h-[80px] resize-y focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={!form.toolName.trim()}
              className="text-sm px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {editingId ? "Save Changes" : "Log Tool"}
            </button>
            <button
              onClick={resetForm}
              className="text-sm px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--gray-light)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          + Log New Tool
        </button>
      )}
    </div>
  );
}
