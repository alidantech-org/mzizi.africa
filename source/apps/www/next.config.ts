import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repository root has its own lockfile for the command runner; this app is the Turbopack root.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
