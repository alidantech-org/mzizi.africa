/**
 * Dryv from the root: link the local checkout, check contracts, run the engine API and generate.
 *
 * Generation needs the Dryv engine API (port 8750, or `DRYV_API_PORT`). `dryv:generate` and `dryv:verify` start it when it is
 * not already running and stop it again afterwards; an API that was already running is left alone.
 * Background and traps: .docs/guidance/running-dryv.md.
 */
import { mkdirSync } from "node:fs";
import { group, has, type Step, step } from "../lib/exec.ts";
import { at, dryvHome, root } from "../lib/paths.ts";

/** Port of the local Dryv engine API: `DRYV_API_PORT`, default 8750. Use another port when 8750 is taken by a different Dryv service. */
export const dryvApiPort = (): string => process.env.DRYV_API_PORT ?? "8750";
export const dryvApiUrl = (): string => process.env.DRYV_API ?? `http://127.0.0.1:${dryvApiPort()}`;
const apiLog = ".local/dryv-api.log";
const apiCommand = (): string[] => [
  "uv",
  "run",
  "--project",
  "source/engine/python/api",
  "dryv-api",
  "serve",
  "--host",
  "127.0.0.1",
  "--port",
  dryvApiPort(),
  "--template-server",
  "source/engine/python/api/dryv.server.yaml",
  // Dryv's development mode: the engine is bound to 127.0.0.1 and accepts any key, so no Dryv Platform login is needed.
  "--insecure-no-auth",
];

/** Environment for every Dryv tool: the checkout to use and the API to talk to. */
const dryvEnv = (): Record<string, string> => ({
  DRYV_HOME: dryvHome(),
  DRYV_API: dryvApiUrl(),
  // The CLI insists on a key even in development mode; a placeholder is enough for the local engine. A real key
  // in the environment (for an engine that checks keys) is never replaced.
  DRYV_API_KEY: process.env.DRYV_API_KEY ?? "local-development",
});

const inDryv = (name: string, script: string): Step => step(name, at("dryv"), ["bun", "run", script], dryvEnv());

/** Link the local Dryv author and compiler into dryv/node_modules. */
export const linkSteps = (): Step[] => [inDryv("Link local Dryv checkout", "link")];

/** Typecheck, audit, doctor and compile the contracts, and check the exported access rules, API boundary and schema. */
export const checkSteps = (): Step[] => [inDryv("Contract checks", "check")];

/** Re-export the access rules and the JSON schema derived from the contracts. */
export const exportSteps = (): Step[] => [inDryv("Export access rules", "access:export"), inDryv("Export JSON schema", "schema:export")];

/** Regenerate the web dashboard's data catalog from the generated API list routes. */
export const catalogSteps = (): Step[] => [step("Web data catalog", at("source/apps/web"), ["bun", "run", "catalog"])];

/** The Dryv engine API in the foreground (Ctrl+C stops it). */
export const apiStep = (): Step => step(`Dryv engine API on :${dryvApiPort()}`, dryvHome(), apiCommand());

/** True when something answers on the Dryv API port (a 404 on `/` is the normal answer). */
export async function apiIsUp(): Promise<boolean> {
  try {
    await fetch(dryvApiUrl(), { signal: AbortSignal.timeout(1500) });
    return true;
  } catch {
    return false;
  }
}

/** Stop whatever listens on the Dryv API port. Uses the port, never a process-name match. */
export function stopApi(): boolean {
  if (!has("fuser")) {
    console.error("fuser is not installed; stop the Dryv API by its PID");
    return false;
  }
  Bun.spawnSync(["fuser", "-k", `${dryvApiPort()}/tcp`], { stdout: "ignore", stderr: "ignore" });
  console.log("Dryv engine API stopped");
  return true;
}

/**
 * Make sure the Dryv API is running. Returns a function that stops it if this call started it.
 * Throws when it does not come up within two minutes; the log is in `.local/dryv-api.log`.
 */
async function ensureApi(): Promise<() => void> {
  if (await apiIsUp()) {
    console.log(`Dryv engine API already running at ${dryvApiUrl()}`);
    return () => {};
  }
  mkdirSync(at(".local"), { recursive: true });
  console.log(`Starting the Dryv engine API (log: ${apiLog}) ...`);
  const child = Bun.spawn(apiCommand(), { cwd: dryvHome(), stdin: "ignore", stdout: Bun.file(at(apiLog)), stderr: Bun.file(at(apiLog)) });
  const stop = (): void => {
    child.kill("SIGTERM");
    stopApi();
  };
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await apiIsUp()) return stop;
    if (child.exitCode !== null) break;
    await Bun.sleep(1000);
  }
  stop();
  throw new Error(`the Dryv engine API did not start; see ${apiLog}`);
}

/**
 * Generate the NestJS API from the contracts, then adopt the shared list helper, verify the output is current,
 * re-export the access rules and regenerate the web data catalog. A new operation makes the generate step end "failed" at its typecheck stage
 * until the project-owned `*.service.impl.ts` gains the method; the follow-up steps still run so the report is complete.
 */
export async function generate(): Promise<boolean> {
  const stop = await ensureApi();
  try {
    const cli = ["bun", `${dryvHome()}/source/apps/cli/bin/dryv.ts`, "--api", dryvApiUrl(), "--yes", "--no-input"];
    const env = dryvEnv();
    const generated = await group("Dryv generate", [step("Generate", root, [...cli, "generate"], env)]);
    const followUp = await group("After generation", [
      inDryv("Adopt shared list helper", "adopt:list"),
      inDryv("Generated output is current", "generated:check"),
      inDryv("Export access rules", "access:export"),
      ...catalogSteps(),
    ]);
    return generated && followUp;
  } finally {
    stop();
  }
}

/** Trust the project packs; needed once per machine before the first generation. */
export async function trust(): Promise<boolean> {
  const stop = await ensureApi();
  try {
    const args = ["bun", `${dryvHome()}/source/apps/cli/bin/dryv.ts`, "--api", dryvApiUrl(), "--yes", "--no-input", "trust"];
    return await group("Dryv trust", [step("Trust project packs", root, args, dryvEnv())]);
  } finally {
    stop();
  }
}

/** Check that the tracked generated output matches what the contracts would generate now. */
export async function verify(): Promise<boolean> {
  const stop = await ensureApi();
  try {
    return await group("Dryv verify", [inDryv("Generated output is current", "generated:check")]);
  } finally {
    stop();
  }
}
