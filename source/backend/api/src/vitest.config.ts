import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

/**
 * Scaffolded by Dryv once; this file belongs to the project. SWC compiles the specs because
 * NestJS dependency injection needs decorator metadata, which Vitest's default esbuild lacks.
 * Run from this directory: `vitest run --root <this directory>`.
 */
export default defineConfig({
  test: {
    // Integration specs share the one scratch database (mzizi_test), so they run one file at a time when it is configured.
    fileParallelism: !process.env.TEST_DATABASE_URL,
    include: ["**/*.spec.ts"],
    exclude: ["**/node_modules/**"],
    testTimeout: 30_000,
    hookTimeout: 120_000,
  },
  plugins: [tsconfigPaths({ projects: ["tsconfig.json"] }), swc.vite({ module: { type: "es6" } })],
});
