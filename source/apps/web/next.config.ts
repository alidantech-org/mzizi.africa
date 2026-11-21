/** Shared framework setup. Real and demo routes are defined by the App Router folders. */
import type { NextConfig } from "next";
/** Hostnames the dev server may be reached on besides localhost, for example a forwarded port (comma separated). */
const devOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  // Without this the dev server answers 403 to scripts requested from another host, so the page never hydrates and buttons do nothing.
  allowedDevOrigins: devOrigins,
  // Server actions check that the request origin matches the host; behind a forwarded port they must be told which hosts are theirs.
  experimental: { serverActions: { allowedOrigins: devOrigins } },
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: { "/demo/**": ["./src/app/demo/_assets/**/*"] },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};
export default nextConfig;
