/** Next.js configuration. Old top-level addresses redirect into the place-based model. */
import type { NextConfig } from "next";

const view = (id: string) => `/ke?view=${id}`;

const nextConfig: NextConfig = {
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
  async redirects() {
    return [
      { source: "/places", destination: "/ke", permanent: false },
      { source: "/places/:county", destination: "/ke/:county", permanent: false },
      { source: "/explore", destination: "/", permanent: false },
      { source: "/leaders", destination: view("leaders"), permanent: false },
      { source: "/institutions", destination: view("institutions"), permanent: false },
      { source: "/arms", destination: view("arms"), permanent: false },
      { source: "/power", destination: view("power"), permanent: false },
      { source: "/law", destination: view("law"), permanent: false },
      { source: "/law/:chapter", destination: "/ke?view=law&view.chapter=:chapter", permanent: false },
      { source: "/parliament", destination: view("parliament"), permanent: false },
      { source: "/elections", destination: view("elections"), permanent: false },
      { source: "/money", destination: view("finance"), permanent: false },
      { source: "/money/suppliers", destination: view("suppliers"), permanent: false },
      { source: "/statistics", destination: view("statistics"), permanent: false },
      { source: "/compare", destination: view("compare"), permanent: false },
      { source: "/sources", destination: view("sources"), permanent: false },
    ];
  },
};

export default nextConfig;
