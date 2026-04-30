import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Mission 4 — serve the static artifact at /Data-analysis (no .html, no trailing slash)
      { source: "/Data-analysis", destination: "/Data-analysis/index.html" },
    ];
  },
};

export default nextConfig;
