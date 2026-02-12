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
    return (
      <div className="py-20 text-center" style={{ color: "var(--notion-text-tertiary)" }}>
        Loading...
      </div>
    );
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
    <div>
      {/* Page title */}
      <div className="mb-8 mt-4">
        <span className="text-5xl mb-2 block">🔧</span>
        <h1
          className="text-4xl font-bold tracking-tight"
          style={{ color: "var(--notion-text)" }}
        >
          Tools Log
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--notion-text-secondary)" }}>
          {tools.length} of 3 target
        </p>
      </div>

      <div className="mb-6">
        <ProgressBar current={Math.min(tools.length, 3)} total={3} color="var(--notion-accent)" />
      </div>

      {/* Tool entries - Notion style list */}
      <div className="mb-6">
        {tools.map((tool, index) => {
          const mission = missions.find((m) => m.id === tool.missionId);
          return (
            <div
              key={tool.id}
              className="rounded border mb-3 transition-colors"
              style={{ borderColor: "var(--notion-border)" }}
            >
              {/* Tool header */}
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ borderBottom: "1px solid var(--notion-border)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: "var(--notion-text-tertiary)" }}>
                    {index + 1}.
                  </span>
                  <span className="font-semibold text-sm" style={{ color: "var(--notion-text)" }}>
                    {tool.toolName}
                  </span>
                  {mission && (
                    <Link
                      href={`/missions/${mission.id}`}
                      className="text-xs px-1.5 py-0.5 rounded-sm"
                      style={{ backgroundColor: "var(--notion-blue-bg)", color: "var(--notion-blue)" }}
                    >
                      {mission.number === 0 ? "Day 0" : `Wk ${mission.number}`}
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(tool)}
                    className="text-xs transition-colors"
                    style={{ color: "var(--notion-text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--notion-text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--notion-text-secondary)")}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTool(tool.id)}
                    className="text-xs transition-colors"
                    style={{ color: "var(--notion-text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--notion-red)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--notion-text-secondary)")}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Properties */}
              <div className="text-sm">
                <div
                  className="flex px-3 py-1.5"
                  style={{ borderBottom: "1px solid var(--notion-border)" }}
                >
                  <span className="text-xs w-24 flex-shrink-0" style={{ color: "var(--notion-text-secondary)" }}>
                    Task
                  </span>
                  <span style={{ color: "var(--notion-text)" }}>{tool.taskUsedFor || "—"}</span>
                </div>
                <div
                  className="flex px-3 py-1.5"
                  style={{ borderBottom: "1px solid var(--notion-border)" }}
                >
                  <span className="text-xs w-24 flex-shrink-0" style={{ color: "var(--notion-text-secondary)" }}>
                    Strengths
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-sm"
                    style={{ backgroundColor: "var(--notion-green-bg)", color: "var(--notion-green)" }}
                  >
                    {tool.strengths || "—"}
                  </span>
                </div>
                <div className="flex px-3 py-1.5">
                  <span className="text-xs w-24 flex-shrink-0" style={{ color: "var(--notion-text-secondary)" }}>
                    Weaknesses
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-sm"
                    style={{ backgroundColor: "var(--notion-orange-bg)", color: "var(--notion-orange)" }}
                  >
                    {tool.weaknesses || "—"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {tools.length < 3 && !showForm && (
          <div
            className="border border-dashed rounded px-4 py-6 text-center"
            style={{ borderColor: "var(--notion-border-dark)" }}
          >
            <p className="text-sm" style={{ color: "var(--notion-text-tertiary)" }}>
              {tools.length === 0
                ? "No tools logged yet. Try something new this weekend!"
                : `${3 - tools.length} more to go`}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div
          className="rounded border px-4 py-4 mb-4"
          style={{ borderColor: "var(--notion-border)" }}
        >
          <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--notion-text)" }}>
            {editingId ? "Edit Tool" : "Log New Tool"}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--notion-text-secondary)" }}>
                Tool / Platform Name
              </label>
              <input
                type="text"
                value={form.toolName}
                onChange={(e) => setForm({ ...form, toolName: e.target.value })}
                placeholder="e.g. Cursor, Midjourney, Claude..."
                className="w-full text-sm rounded border px-3 py-1.5"
                style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--notion-text-secondary)" }}>
                Mission Used In
              </label>
              <select
                value={form.missionId}
                onChange={(e) => setForm({ ...form, missionId: e.target.value })}
                className="w-full text-sm rounded border px-3 py-1.5"
                style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
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
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--notion-text-secondary)" }}>
                What task did you use it on?
              </label>
              <input
                type="text"
                value={form.taskUsedFor}
                onChange={(e) => setForm({ ...form, taskUsedFor: e.target.value })}
                placeholder="e.g. Built research brief with AI pair coding"
                className="w-full text-sm rounded border px-3 py-1.5"
                style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--notion-text-secondary)" }}>
                  What it does well
                </label>
                <textarea
                  value={form.strengths}
                  onChange={(e) => setForm({ ...form, strengths: e.target.value })}
                  placeholder="e.g. Great at code generation"
                  className="w-full text-sm rounded border px-3 py-1.5 min-h-[70px] resize-y"
                  style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--notion-text-secondary)" }}>
                  Where it falls short
                </label>
                <textarea
                  value={form.weaknesses}
                  onChange={(e) => setForm({ ...form, weaknesses: e.target.value })}
                  placeholder="e.g. Gets confused on large files"
                  className="w-full text-sm rounded border px-3 py-1.5 min-h-[70px] resize-y"
                  style={{ borderColor: "var(--notion-border)", color: "var(--notion-text)" }}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSubmit}
                disabled={!form.toolName.trim()}
                className="text-xs px-3 py-1.5 rounded text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: "var(--notion-accent)" }}
              >
                {editingId ? "Save Changes" : "Log Tool"}
              </button>
              <button
                onClick={resetForm}
                className="text-xs px-3 py-1.5 rounded border transition-colors"
                style={{ borderColor: "var(--notion-border)", color: "var(--notion-text-secondary)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="text-xs px-3 py-1.5 rounded text-white transition-opacity"
          style={{ backgroundColor: "var(--notion-accent)" }}
        >
          + New Tool
        </button>
      )}
    </div>
  );
}
