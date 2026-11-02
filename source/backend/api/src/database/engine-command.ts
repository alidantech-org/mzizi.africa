import { execFile } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import { ServiceUnavailableException } from "@nestjs/common";

const run = promisify(execFile);

/**
 * Runs a database engine command (`bun src/cli.ts <command> ...`) under the promotion role's connection
 * (DATABASE_PROMOTE_URL). Promotion, review application and assessment decisions are owned by the
 * database engine; the API only asks it, and never with the read-only or reviewer roles. The engine's
 * last output line is JSON. A rule the engine refuses on (not permitted, not current) comes back as a message.
 */
export async function engineCommand(args: string[]): Promise<Record<string, unknown>> {
  const url = process.env.DATABASE_PROMOTE_URL;
  if (!url) throw new ServiceUnavailableException("engine commands are not configured");
  const directory = process.env.ENGINE_DATABASE_DIR ?? join(process.cwd(), "..", "engine", "database");
  try {
    const { stdout } = await run("bun", ["src/cli.ts", ...args], { cwd: directory, env: { ...process.env, DATABASE_URL: url }, timeout: 120_000 });
    return JSON.parse(stdout.trim().split("\n").pop() ?? "{}") as Record<string, unknown>;
  } catch (error) {
    const stderr = String((error as { stderr?: string }).stderr ?? "");
    const refusal = /Error: (.+)/.exec(stderr)?.[1];
    throw new ServiceUnavailableException(refusal ? `the database engine refused: ${refusal}` : "the database engine could not run the command");
  }
}
