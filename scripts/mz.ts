#!/usr/bin/env bun
/**
 * mz: the single entry point for every repository command.
 *
 *   bun run <command>            the common commands are package.json scripts
 *   bun scripts/mz.ts <command>  the same, with arguments and options
 *
 * Options: `--only <names>` limits project commands to named projects or kinds (python, bun, flutter, all).
 * The command table below is the source of `bun run help`; see scripts/README.md for the full guide.
 */
import { group, rootStep, stages, step } from "./lib/exec.ts";
import { root } from "./lib/paths.ts";
import { select } from "./lib/projects.ts";
import { checkBoundaries } from "./tasks/boundaries.ts";
import { checkFrontend } from "./tasks/frontend.ts";
import * as dryv from "./tasks/dryv.ts";
import { type QualityKind, qualitySteps } from "./tasks/quality.ts";
import { forgetEditorCache, syncSchemas } from "./tasks/schemas.ts";
import { type Mode, serve } from "./tasks/serve.ts";
import { clean, doctor, prepareSteps, syncSteps } from "./tasks/setup.ts";
import { checkStructure } from "./tasks/structure.ts";

/** Parsed command line: positional arguments after the command, and the `--only` filter. */
type Context = {
  readonly rest: readonly string[];
  readonly only: string | undefined;
};
type Command = {
  readonly summary: string;
  readonly run: (context: Context) => Promise<boolean> | boolean;
};

/** A command that runs one kind of quality step across the selected projects. */
const quality = (kind: QualityKind, summary: string, concurrency = 1): Command => ({
  summary,
  run: ({ only }) => group(kind, qualitySteps(kind, select(only)), concurrency),
});

/** A command that forwards its arguments to a console command of the Python workspace. */
const passthrough = (program: string, summary: string): Command => ({
  summary,
  run: ({ rest }) => group(program, [rootStep(program, ["uv", "run", program, ...rest])]),
});

const postgres = (): string => process.env.MZIZI_PG_CONTAINER ?? "postgis";

/** Every database administration command enters the Bun database CLI. */
const databaseCli = async ({ rest }: Context): Promise<boolean> => {
  const result = await Bun.spawn(["bun", "src/cli.ts", ...rest], {
    cwd: `${root}/source/backend/database`,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  }).exited;
  return result === 0;
};

/** The stages of `check`: everything that must pass before a commit. */
const checkStages = (only: string | undefined): [string, ReturnType<typeof qualitySteps>][] => {
  const selected = select(only);
  return (["format:check", "lint", "typecheck", "test"] as const).map((kind) => [kind, qualitySteps(kind, selected)]);
};

export const commands: Record<string, Command> = {
  setup: {
    summary: "install every dependency, link Dryv and create the development sign-in keys",
    run: ({ only }) =>
      stages([
        ["sync", syncSteps(select(only))],
        ["prepare", prepareSteps()],
      ]),
  },
  sync: {
    summary: "install dependencies as locked (uv sync, bun install per project)",
    run: ({ only }) => group("sync", syncSteps(select(only))),
  },
  doctor: {
    summary: "report required tools and local files",
    run: () => doctor(),
  },
  clean: {
    summary: "delete caches and build output (add --deep to delete dependencies too)",
    run: ({ rest }) => {
      clean(rest.includes("--deep"));
      return true;
    },
  },
  dev: {
    summary: "run services in watch mode: dev [api] [engine] [www]",
    run: async ({ rest }) => (await serve("dev" satisfies Mode, rest)) === 0,
  },
  start: {
    summary: "run services in start mode (run build first): start [api] [engine] [www]",
    run: async ({ rest }) => (await serve("start", rest)) === 0,
  },
  build: quality("build", "build the apps and the Python wheels"),
  format: quality("format", "format Python (ruff) and TypeScript (Biome, Prettier)"),
  "format:check": quality("format:check", "fail when a file is not formatted"),
  lint: quality("lint", "lint Python (ruff) and TypeScript (Biome, ESLint)"),
  "lint:fix": quality("lint:fix", "apply safe lint fixes"),
  typecheck: quality("typecheck", "type check Python (mypy) and TypeScript (tsc)"),
  test: quality("test", "run pytest, bun test and vitest"),
  structure: {
    summary: "enforce folder layout, file headers and hard file size limits for manual code",
    run: () => checkStructure(),
  },
  boundaries: {
    summary: "report import-boundary violations of packages and the engine (--strict fails on any)",
    run: ({ rest }) => checkBoundaries(rest.includes("--strict")),
  },
  frontend: {
    summary: "gate the web app: no browser fetch, no route handlers, no client route files",
    run: () => checkFrontend(),
  },
  check: {
    summary: "format:check, lint, typecheck, structure, boundaries, frontend gates and test",
    run: async ({ only }) => {
      const structure = checkStructure();
      const boundaries = checkBoundaries(true);
      const frontend = checkFrontend();
      return (await stages(checkStages(only))) && structure && boundaries && frontend;
    },
  },
  "check:all": {
    summary: "check, plus Dryv contract checks, seed registry, docs validation and builds",
    run: async ({ only }) => {
      const structure = checkStructure();
      const boundaries = checkBoundaries(true);
      const extra: [string, ReturnType<typeof qualitySteps>][] = [
        ["dryv:check", dryv.checkSteps()],
        ["seed", [rootStep("Seed registry", ["uv", "run", "mzizi-manifest", "check"])]],
        ["docs", [rootStep("Task workspace", ["task", "validate"])]],
        ["build", qualitySteps("build", select(only))],
      ];
      return (await stages([...checkStages(only), ...extra])) && structure && boundaries;
    },
  },
  "dryv:link": {
    summary: "link the local Dryv checkout into dryv/node_modules (DRYV_HOME)",
    run: () => group("dryv:link", dryv.linkSteps()),
  },
  "dryv:check": {
    summary: "typecheck, audit, doctor and compile the contracts",
    run: () => group("dryv:check", dryv.checkSteps()),
  },
  "dryv:api": {
    summary: "run the Dryv engine API on :8750 in the foreground",
    run: () => group("dryv:api", [dryv.apiStep()]),
  },
  "dryv:api:stop": {
    summary: "stop the Dryv engine API",
    run: () => dryv.stopApi(),
  },
  "dryv:trust": {
    summary: "trust the project packs (once per machine)",
    run: () => dryv.trust(),
  },
  "dryv:generate": {
    summary: "generate database artifacts from the current schema and operation contracts",
    run: () => dryv.generate(),
  },
  "dryv:database:typecheck": {
    summary: "typecheck the database root and neutral schemas",
    run: () => group("database types", [step("database:typecheck", `${root}/dryv`, ["bun", "run", "database:typecheck"])]),
  },
  "dryv:database:check": {
    summary: "check only the database contracts and canonical stores",
    run: () => group("database contracts", [step("database:check", `${root}/dryv`, ["bun", "run", "database:check"])]),
  },
  "dryv:database:plan": {
    summary: "plan the database app (--store main|operations is optional)",
    run: ({ rest }) => dryv.database("plan", rest),
  },
  "dryv:database:generate": {
    summary: "generate canonical store models and SQL without API follow-ups",
    run: ({ rest }) => dryv.database("generate", rest),
  },
  "dryv:database:verify": {
    summary: "check canonical database output without writing files",
    run: ({ rest }) => dryv.database("verify", rest),
  },
  "dryv:verify": {
    summary: "fail when the generated output is not current",
    run: () => dryv.verify(),
  },
  catalog: {
    summary: "generate the system catalogs with Dryv",
    run: async () => dryv.catalog(),
  },
  "schemas:sync": {
    summary: "regenerate, check and publish source/schema (--local, --dry-run, --no-dryv)",
    run: ({ rest }) => syncSchemas(rest),
  },
  "schemas:forget-cache": {
    summary: "delete the editor's cached copies of the published schemas (then reload the editor window)",
    run: () => forgetEditorCache(),
  },
  "db:up": {
    summary: "start the local PostGIS container (MZIZI_PG_CONTAINER, default postgis)",
    run: () => group("db:up", [rootStep("docker start", ["docker", "start", postgres()])]),
  },
  "db:down": {
    summary: "stop the local PostGIS container",
    run: () => group("db:down", [rootStep("docker stop", ["docker", "stop", postgres()])]),
  },
  "infra:up": {
    summary: "start persistent local Temporal and object-store services",
    run: () =>
      group("infra:up", [rootStep("docker compose", ["docker", "compose", "-f", "compose.local.yaml", "up", "-d"])]),
  },
  "infra:down": {
    summary: "stop local Temporal and object-store services while preserving their volumes",
    run: () => group("infra:down", [rootStep("docker compose", ["docker", "compose", "-f", "compose.local.yaml", "down"])]),
  },
  db: {
    summary: "database CLI: assemble | status | plan | migrate | verify | roles",
    run: databaseCli,
  },
  "db:ts": { summary: "alias for the database CLI", run: databaseCli },
  "dev:data": {
    summary: "create and fill the dev database (mzizi_ux): migrations, roles, invented dev seed and geoBoundaries outlines",
    run: () => group("dev:data", [rootStep("dev data", ["bash", "scripts/dev/dev-data.sh"])]),
  },
  "dev:stack": {
    summary: "run one dev service against the dev database: dev:stack api | engine | web | portal | flutter | smoke | stop",
    run: ({ rest }) => group("dev:stack", [rootStep("stack", ["bash", "scripts/dev/stack.sh", ...rest])]),
  },
  seed: passthrough("mzizi-manifest", "seed registry: seed check | lock | report | validate-structure <dir>"),
  engine: passthrough("mzizi-engine", "engine: engine serve | capabilities | check"),
  "docs:validate": {
    summary: "validate the Task workspace in .docs",
    run: () => group("docs", [step("task validate", root, ["task", "validate"])]),
  },
};

/** Print the command table. */
export function help(): void {
  console.log("Usage: bun run <command> [-- args]   or   bun scripts/mz.ts <command> [args] [--only <names>]\n");
  for (const [name, command] of Object.entries(commands)) console.log(`  ${name.padEnd(15)} ${command.summary}`);
  console.log("\n--only takes project names or kinds: python, scripts, dryv, api, database, www, app, bun, flutter, all");
}

/** Split the arguments into the command, its positional arguments and the `--only` value. */
export function parse(argv: readonly string[]): {
  command: string;
  context: Context;
} {
  const [command = "help", ...tail] = argv;
  const at = tail.findIndex((arg) => arg === "--only" || arg.startsWith("--only="));
  if (at < 0) return { command, context: { rest: tail, only: undefined } };
  const inline = tail[at]?.startsWith("--only=") ? tail[at]?.slice("--only=".length) : undefined;
  const only = inline ?? tail[at + 1];
  return {
    command,
    context: {
      rest: tail.filter((_, index) => index !== at && (inline !== undefined || index !== at + 1)),
      only,
    },
  };
}

if (import.meta.main) {
  const { command, context } = parse(process.argv.slice(2));
  const entry = commands[command];
  if (!entry) {
    if (command !== "help" && command !== "--help" && command !== "-h") console.error(`unknown command: ${command}\n`);
    help();
    process.exit(command.endsWith("help") || command === "-h" ? 0 : 2);
  }
  try {
    process.exit((await entry.run(context)) ? 0 : 1);
  } catch (error) {
    console.error(`✖ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
