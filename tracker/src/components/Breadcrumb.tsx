"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/missions": "Missions",
  "/resolutions/tools": "Tools Log",
  "/resolutions/team": "Team Progress",
  "/resolutions/demos": "Demo Sessions",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  if (parts.length === 0) return null;

  let path = "";
  for (const part of parts) {
    path += `/${part}`;
    const label = ROUTE_LABELS[path];
    if (label) {
      crumbs.push({ label, href: path });
    } else if (parts[0] === "missions" && parts.length === 2) {
      crumbs.push({ label: "Mission Detail", href: path });
    }
  }

  if (crumbs.length === 0) return null;

  return (
    <div className="flex items-center gap-1 text-sm mb-1" style={{ color: "var(--notion-text-secondary)" }}>
      <Link
        href="/"
        className="transition-colors hover:underline"
        style={{ color: "var(--notion-text-secondary)" }}
      >
        AI Resolution Tracker
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <span style={{ color: "var(--notion-text-tertiary)" }}>/</span>
          <Link
            href={crumb.href}
            className="transition-colors hover:underline"
            style={{ color: "var(--notion-text-secondary)" }}
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </div>
  );
}
