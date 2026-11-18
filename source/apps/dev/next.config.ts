/** Next.js configuration. Scaffolded by Dryv once; this file belongs to the app. */
import { resolve } from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // Development pages are opened as 127.0.0.1 as well as localhost; Next blocks dev resources (hydration, HMR) from other origins.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // The repository has its own AGENTS.md; do not let `next dev` write another one inside the app.
  agentRules: false,
  // The API SDK is a TypeScript package in this repository; Next compiles it with the app.
  transpilePackages: ["@mzizi/api-client", "@mzizi/engine-client", "@mzizi/ui-web"],
  // The bundler may read the SDK outside the app folder.
  turbopack: { root: resolve(import.meta.dirname, "../..") },
};

export default config;
