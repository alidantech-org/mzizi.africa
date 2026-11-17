/** Next.js configuration. Scaffolded by Dryv once; this file belongs to the app. */
import { resolve } from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // The API SDK is a TypeScript package in this repository; Next compiles it with the app.
  transpilePackages: ["@mzizi/api-client"],
  // The bundler may read the SDK outside the app folder.
  turbopack: { root: resolve(import.meta.dirname, "../..") },
};

export default config;
