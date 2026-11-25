/**
 * `dev` and `start`: run the long-running services together from the root.
 *
 * Each service gets the root `.env` values plus its own fixed port, and its output is prefixed with its
 * name. Stopping the runner (Ctrl+C or SIGTERM) stops every service. Each service is supervised on its own: when
 * one exits (a crash, a watcher restart, a failed compile) it is started again after a short delay and the others keep
 * running. A service that fails again and again without staying up is left stopped, reported, and does not take the
 * rest of the stack down; the runner ends when Ctrl+C is pressed or every service has given up.
 */
import type { Subprocess } from "bun";
import { at, localEnv } from "../lib/paths.ts";
import { portOf, type Service, services } from "../lib/projects.ts";

export type Mode = "dev" | "start";

/** Whether the program a service needs is installed; a service without a requirement is always available. */
export function available(service: Service): boolean {
  return service.requires === undefined || Bun.which(service.requires) !== null;
}

/** Resolve service names; no names means every available service. Unknown or unavailable names throw. */
export function pick(names: readonly string[]): Service[] {
  if (names.length === 0) {
    for (const service of services.filter((item) => !available(item))) {
      console.log(`▷ ${service.name} skipped: ${service.requires} is not installed`);
    }
    return services.filter(available);
  }
  const unknown = names.filter((name) => !services.some((service) => service.name === name));
  if (unknown.length)
    throw new Error(`unknown service: ${unknown.join(", ")} (known: ${services.map((service) => service.name).join(", ")})`);
  const missing = services.filter((service) => names.includes(service.name) && !available(service));
  if (missing.length) throw new Error(`${missing.map((service) => `${service.name} needs ${service.requires}`).join(", ")}`);
  return services.filter((service) => names.includes(service.name));
}

/** The base URL a service reaches the API on, for `{api}` in a command. */
function apiUrl(base: Record<string, string | undefined>): string {
  const api = services.find((service) => service.name === "api");
  return `http://127.0.0.1:${api === undefined ? 8700 : portOf(api, base)}`;
}

/** The origins of the browser apps among the chosen services, as the API's CORS allow-list. */
function browserOrigins(chosen: readonly Service[], base: Record<string, string | undefined>): string {
  return chosen
    .filter((service) => service.callsApiFromBrowser)
    .flatMap((service) => [`http://127.0.0.1:${portOf(service, base)}`, `http://localhost:${portOf(service, base)}`])
    .join(",");
}

const PALETTE = ["\x1b[36m", "\x1b[35m", "\x1b[33m", "\x1b[34m", "\x1b[32m", "\x1b[96m"] as const;
const RESET = "\x1b[0m";

/** A stable colour per service, so each service's lines are easy to follow. Plain text when colour is off. */
export function tag(name: string, index: number): string {
  if (process.env.NO_COLOR) return `[${name}]`;
  return `${PALETTE[index % PALETTE.length]}\x1b[1m[${name}]${RESET}`;
}

/** Copy a stream to the terminal line by line with a `[name]` prefix. */
async function relay(stream: ReadableStream<Uint8Array>, name: string, write: (line: string) => void): Promise<void> {
  // Services log progress on stderr as well (uvicorn does), so a line is not an error just because of its stream.
  const decoder = new TextDecoder();
  let pending = "";
  for await (const chunk of stream) {
    const lines = (pending + decoder.decode(chunk, { stream: true })).split("\n");
    pending = lines.pop() ?? "";
    for (const line of lines) write(`${name} ${line}`);
  }
  if (pending) write(`${name} ${pending}`);
}

/** A service that stays up this long counts as healthy, so its failure count starts again. */
const HEALTHY_MS = 30_000;
/** Consecutive quick failures after which a service is left stopped. */
const MAX_QUICK_FAILURES = 5;
const restartDelay = (failures: number): number => Math.min(2_000 * 2 ** failures, 30_000);

/** Start the chosen services and wait until they stop. Resolves to the exit code for the runner. */
export async function serve(mode: Mode, names: readonly string[]): Promise<number> {
  const chosen = pick(names);
  const base = localEnv();
  const children = new Map<string, Subprocess<"ignore", "pipe", "pipe">>();
  let stopping = false;

  /** Run one service until the runner stops; restart it when it exits. Resolves true when it gave up. */
  const supervise = async (service: Service, index: number): Promise<boolean> => {
    const port = String(portOf(service, base));
    const command = service[mode].map((part) => part.replace("{port}", port).replace("{api}", apiUrl(base)));
    const label = tag(service.name, index);
    let failures = 0;
    while (!stopping) {
      console.log(`▶ ${service.name.padEnd(7)} http://127.0.0.1:${port}  (${service.dir}: ${command.join(" ")})`);
      const startedAt = Date.now();
      const child = Bun.spawn(command, {
        cwd: at(service.dir),
        env: {
          ...base,
          [service.portEnv]: port,
          FORCE_COLOR: "1",
          // The API accepts browser calls only from the browser apps running alongside it.
          ...(service.name === "api" && base.CORS_ORIGINS === undefined
            ? { CORS_ORIGINS: browserOrigins(chosen, base) }
            : {}),
        },
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
      });
      children.set(service.name, child);
      void relay(child.stdout, label, (line) => console.log(line));
      void relay(child.stderr, label, (line) => console.log(line));
      const code = await child.exited;
      if (stopping) return false;
      failures = Date.now() - startedAt >= HEALTHY_MS ? 1 : failures + 1;
      if (failures >= MAX_QUICK_FAILURES) {
        console.error(
          `✖ ${service.name} exited with code ${code} ${failures} times in a row; left stopped, the others keep running`,
        );
        return true;
      }
      const wait = restartDelay(failures - 1);
      console.error(`✖ ${service.name} exited with code ${code}; restarting in ${wait / 1000}s (the others keep running)`);
      await Bun.sleep(wait);
    }
    return false;
  };

  const stop = (): void => {
    if (stopping) return;
    stopping = true;
    for (const child of children.values()) child.kill("SIGTERM");
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  const gaveUp = await Promise.all(chosen.map((service, index) => supervise(service, index)));
  await Promise.all([...children.values()].map((child) => child.exited));
  return stopping || !gaveUp.every(Boolean) ? 0 : 1;
}
