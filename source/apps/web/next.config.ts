/** Shared framework setup. Real and demo routes are defined by the App Router folders. */
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  // The demo includes its exact /demo entry URL; permit that worker scope without granting the root scope.
  async headers() {
    return [{ source: "/demo/sw.js", headers: [{ key: "Service-Worker-Allowed", value: "/demo" }] }];
  },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};
export default nextConfig;
