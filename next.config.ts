import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer is ESM-only; requiring it from the CommonJS
  // src/lib/reportTemplate.js (shared with the standalone CLI scripts)
  // fails webpack's bundling otherwise - resolve it at runtime instead.
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
