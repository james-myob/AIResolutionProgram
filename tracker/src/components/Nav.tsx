"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const [resOpen, setResOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path
      ? "text-[var(--accent)] font-semibold"
      : "text-[var(--gray)] hover:text-[var(--foreground)]";

  const isResolutionPage = pathname.startsWith("/resolutions");

  return (
    <nav className="border-b border-[var(--border)] bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-6">
        <Link href="/" className="font-bold text-lg text-[var(--foreground)] mr-4">
          AI Resolution Tracker
        </Link>
        <Link href="/" className={`text-sm transition-colors ${isActive("/")}`}>
          Dashboard
        </Link>
        <Link
          href="/missions"
          className={`text-sm transition-colors ${isActive("/missions")}`}
        >
          Missions
        </Link>
        <div className="relative">
          <button
            onClick={() => setResOpen(!resOpen)}
            className={`text-sm transition-colors flex items-center gap-1 ${
              isResolutionPage
                ? "text-[var(--accent)] font-semibold"
                : "text-[var(--gray)] hover:text-[var(--foreground)]"
            }`}
          >
            Resolutions
            <svg
              className={`w-3 h-3 transition-transform ${resOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {resOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setResOpen(false)} />
              <div className="absolute top-full left-0 mt-1 bg-white border border-[var(--border)] rounded-lg shadow-lg py-1 min-w-[180px] z-20">
                <Link
                  href="/resolutions/tools"
                  className="block px-4 py-2 text-sm hover:bg-[var(--gray-light)] transition-colors"
                  onClick={() => setResOpen(false)}
                >
                  Tools Log
                </Link>
                <Link
                  href="/resolutions/team"
                  className="block px-4 py-2 text-sm hover:bg-[var(--gray-light)] transition-colors"
                  onClick={() => setResOpen(false)}
                >
                  Team Progress
                </Link>
                <Link
                  href="/resolutions/demos"
                  className="block px-4 py-2 text-sm hover:bg-[var(--gray-light)] transition-colors"
                  onClick={() => setResOpen(false)}
                >
                  Demo Sessions
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
