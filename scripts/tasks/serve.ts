/**
 * `dev` and `start`: run the long-running services together from the root.
 *
 * Each service gets the root `.env` values plus its own fixed port, and its output is prefixed with its
 * name. Stopping the runner (Ctrl+C or SIGTERM) stops every service; if one service exits, the others are
 * stopped too so a half-running stack is never left behind.
 */
import type { Subprocess } from "bun";
import { at, localEnv } from "../lib/paths.ts";
import { portOf, type Service, services } from "../lib/projects.ts";

export type Mode = "dev" | "start";

/** Resolve service names; no names means every service. Unknown names throw. */
export function pick(names: readonly string[]): Service[] {
  if (names.length === 0) return [...services];
  const unknown = names.filter((name) => !services.some((service) => service.name === name));
  if (unknown.length)
    throw new Error(`unknown service: ${unknown.join(", ")} (known: ${services.map((service) => service.name).join(", ")})`);
  return services.filter((service) => names.includes(service.name));
}

/** Copy a stream to the terminal line by line with a `[name]` prefix. */
async function relay(stream: ReadableStream<Uint8Array>, name: string, write: (line: string) => void): Promise<void> {
  const decoder = new TextDecoder();
  let pending = "";
  for await (const chunk of stream) {
    const lines = (pending + decoder.decode(chunk, { stream: true })).split("\n");
    pending = lines.pop() ?? "";
    for (const line of lines) write(`[${name}] ${line}`);
  }
  if (pending) write(`[${name}] ${pending}`);
}

/** Start the chosen services and wait until they stop. Resolves to the exit code for the runner. */
export async function serve(mode: Mode, names: readonly string[]): Promise<number> {
  const chosen = pick(names);
  const base = localEnv();
  const children = new Map<string, Subprocess<"ignore", "pipe", "pipe">>();
  for (const service of chosen) {
    const port = String(portOf(service, base));
    const command = service[mode].map((part) => part.replace("{port}", port));
    console.log(`▶ ${service.name.padEnd(7)} http://127.0.0.1:${port}  (${service.dir}: ${command.join(" ")})`);
    const child = Bun.spawn(command, {
      cwd: at(service.dir),
      env: { ...base, [service.portEnv]: port, FORCE_COLOR: "1" },
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });
    children.set(service.name, child);
    void relay(child.stdout, service.name, (line) => console.log(line));
    void relay(child.stderr, service.name, (line) => console.error(line));
  }

  let stopping = false;
  const stop = (): void => {
    if (stopping) return;
    stopping = true;
    for (const child of children.values()) child.kill("SIGTERM");
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  // The first service to exit decides the result; a requested stop is a clean exit.
  const first = await Promise.race([...children].map(async ([name, child]) => ({ name, code: await child.exited })));
  const requested = stopping;
  if (!requested) console.error(`✖ ${first.name} exited with code ${first.code}; stopping the other services`);
  stop();
  await Promise.all([...children.values()].map((child) => child.exited));
  return requested ? 0 : first.code || 1;
}
