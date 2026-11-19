/** Next.js configuration. Scaffolded by Dryv once; this file belongs to the app. */
import { resolve } from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // Development pages are opened as 127.0.0.1 as well as localhost; Next blocks dev resources (hydration, HMR) from other origins.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "mz-web.alidantech.org",
    "mz-app.alidantech.org",
    "mz-api.alidantech.org",
  ],
  // The repository has its own AGENTS.md; do not let `next dev` write another one inside the app.
  agentRules: false,
  // The API SDK is a TypeScript package in this repository; Next compiles it with the app.
  transpilePackages: ["@mzizi/api-client", "@mzizi/ui-web"],
  // Addresses that existed before the agreed hierarchy; they redirect permanently so no shared link breaks.
  // async redirects() {
  //   const move = (from: string, to: string) => [
  //     { source: from, destination: to, permanent: true },
  //     { source: `${from}/:rest*`, destination: `${to}/:rest*`, permanent: true },
  //   ];
  //   return [
  //     ...move("/parties", "/politics/parties"),
  //     ...move("/parliament", "/government/parliament"),
  //     ...move("/motions", "/government/parliament/motions"),
  //     ...move("/institutions", "/government/institutions"),
  //     ...move("/constitution", "/government/law"),
  //     ...move("/law", "/government/law"),
  //     ...move("/tenders", "/procurement/tenders"),
  //     ...move("/leaderboards", "/data/rankings"),
  //     ...move("/compare", "/data/compare"),
  //     ...move("/source-browse", "/data/sources"),
  //     ...move("/evidence-view", "/data/sources"),
  //     ...move("/saved", "/me/saved"),
  //     ...move("/profile", "/me"),
  //     ...move("/statistics", "/data/statistics"),
  //     ...move("/browse", "/places"),
  //     ...move("/civic", "/finance"),
  //     { source: "/place-search", destination: "/search", permanent: true },
  //     { source: "/place-profile", destination: "/places", permanent: true },
  //     { source: "/feature-browse", destination: "/places", permanent: true },
  //     { source: "/feature-detail", destination: "/places", permanent: true },
  //   ];
  // },
  // The bundler may read the SDK outside the app folder.
  turbopack: { root: resolve(import.meta.dirname, "../..") },
};

export default config;
