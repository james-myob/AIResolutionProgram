"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export default function ProgressBar({
  current,
  total,
  color = "var(--notion-accent)",
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const height = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: "var(--notion-text-secondary)" }}>
            {current} of {total}
          </span>
          <span style={{ color: "var(--notion-text-secondary)" }}>{pct}%</span>
        </div>
      )}
      <div
        className={`w-full rounded-full ${height}`}
        style={{ backgroundColor: "var(--notion-sidebar)" }}
      >
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
