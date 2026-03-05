"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: "🏠",
  },
  {
    label: "Missions",
    href: "/missions",
    icon: "🚀",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: "⚡",
  },
];

const RESOLUTION_ITEMS = [
  {
    label: "Tools Log",
    href: "/resolutions/tools",
    icon: "🔧",
  },
  {
    label: "Team Progress",
    href: "/resolutions/team",
    icon: "👥",
  },
  {
    label: "Demo Sessions",
    href: "/resolutions/demos",
    icon: "🎤",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [resolutionsOpen, setResolutionsOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="sidebar-transition flex-shrink-0 h-screen sticky top-0 flex flex-col overflow-hidden"
      style={{
        width: collapsed ? 48 : 240,
        backgroundColor: "var(--notion-sidebar)",
      }}
    >
      {/* Workspace header */}
      <div
        className="flex items-center gap-2 px-3 h-11 flex-shrink-0"
        style={{ borderBottom: "1px solid transparent" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: "var(--notion-orange)", color: "white" }}
            >
              A
            </div>
            <span
              className="text-sm font-semibold truncate"
              style={{ color: "var(--notion-text)" }}
            >
              AI Resolution
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-6 h-6 rounded flex-shrink-0 transition-colors"
          style={{ color: "var(--notion-text-secondary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--notion-sidebar-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            {collapsed ? (
              <path d="M6 3.5l5 4.5-5 4.5V3.5z" />
            ) : (
              <path d="M10 3.5L5 8l5 4.5V3.5z" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1 px-1">
        {/* Quick links */}
        {!collapsed && (
          <div className="mb-1">
            <button
              className="flex items-center gap-2 w-full px-2 py-1 rounded text-sm transition-colors"
              style={{ color: "var(--notion-text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "var(--notion-sidebar-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5L14 14" strokeLinecap="round" />
              </svg>
              <span>Search</span>
            </button>
          </div>
        )}

        {/* Main nav items */}
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors mb-px"
              style={{
                background: active
                  ? "var(--notion-sidebar-active)"
                  : "transparent",
                color: active
                  ? "var(--notion-text)"
                  : "var(--notion-text-secondary)",
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background =
                    "var(--notion-sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span className="text-base leading-none w-5 text-center flex-shrink-0">
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        {/* Resolutions section */}
        <div className="mt-4">
          {!collapsed && (
            <button
              onClick={() => setResolutionsOpen(!resolutionsOpen)}
              className="flex items-center gap-1 w-full px-2 py-1 text-xs font-medium uppercase tracking-wider transition-colors"
              style={{ color: "var(--notion-text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--notion-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  "var(--notion-text-secondary)")
              }
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="currentColor"
                className="transition-transform"
                style={{
                  transform: resolutionsOpen
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
                }}
              >
                <path d="M3 1.5l4 3.5-4 3.5V1.5z" />
              </svg>
              Resolutions
            </button>
          )}
          {(resolutionsOpen || collapsed) &&
            RESOLUTION_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded text-sm transition-colors mb-px"
                  style={{
                    padding: collapsed ? "4px 8px" : "4px 8px 4px 20px",
                    background: active
                      ? "var(--notion-sidebar-active)"
                      : "transparent",
                    color: active
                      ? "var(--notion-text)"
                      : "var(--notion-text-secondary)",
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background =
                        "var(--notion-sidebar-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span className="text-base leading-none w-5 text-center flex-shrink-0">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* Bottom section */}
      {!collapsed && (
        <div
          className="px-3 py-3 text-xs flex-shrink-0"
          style={{
            color: "var(--notion-text-tertiary)",
            borderTop: "1px solid var(--notion-border)",
          }}
        >
          10-Weekend AI Program
        </div>
      )}
    </aside>
  );
}
