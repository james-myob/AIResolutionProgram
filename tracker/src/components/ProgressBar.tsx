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
  color = "var(--accent)",
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[var(--gray)]">
            {current}/{total}
          </span>
          <span className="text-[var(--gray)]">{pct}%</span>
        </div>
      )}
      <div className={`w-full bg-[var(--gray-light)] rounded-full ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
