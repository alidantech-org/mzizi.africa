import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Scaffolded by Dryv once; this file belongs to the project. SWC compiles the specs because
 * NestJS dependency injection needs decorator metadata, which Vitest's default esbuild lacks;
 * tsconfig paths resolve import aliases such as #/ and @/.
 * Run from this directory: `vitest run --root <this directory>`.
 */
export default defineConfig({
  test: {
    include: ["**/*.spec.ts"],
    exclude: ["**/node_modules/**"],
    testTimeout: 30_000,
  },
  plugins: [tsconfigPaths({ projects: ["tsconfig.json"] }), swc.vite({ module: { type: "es6" } })],
});
