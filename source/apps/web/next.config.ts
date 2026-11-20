/** Shared framework setup. Real and demo routes are defined by the App Router folders. */
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: { "/demo/**": ["./src/app/demo/_assets/**/*"] },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};
export default nextConfig;
