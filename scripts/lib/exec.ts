/**
 * Process execution for the runner: a `Step` is one command in one directory; steps run in bounded
 * parallel groups and every group prints which steps passed and which failed.
 */
import { label, root } from "./paths.ts";

/** One command to run. `cwd` is absolute; `env` is merged over the current environment. */
export type Step = {
  readonly name: string;
  readonly cwd: string;
  readonly args: readonly string[];
  readonly env?: Record<string, string>;
};

/** Outcome of a step: `code` is the exit status, or 127 when the program could not be started. */
export type Result = { readonly name: string; readonly code: number };

/** Build a step from a repository-relative directory. */
export const step = (name: string, cwd: string, args: readonly string[], env?: Record<string, string>): Step => ({
  name: `${name} (${label(cwd)})`,
  cwd,
  args,
  ...(env ? { env } : {}),
});

/** Names of the failed results, in input order. */
export const failures = (results: readonly Result[]): string[] =>
  results.filter((result) => result.code !== 0).map((result) => result.name);

/** Run `task` over `items` with at most `concurrency` running at once. */
export async function runBounded<T>(items: readonly T[], concurrency: number, task: (item: T) => Promise<void>): Promise<void> {
  let cursor = 0;
  const worker = async (): Promise<void> => {
    while (cursor < items.length) {
      const item = items[cursor++];
      if (item !== undefined) await task(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(Math.max(1, concurrency), items.length) }, worker));
}

/** Run one step with inherited output. A missing program is reported as a failure, never thrown. */
export async function run(item: Step): Promise<Result> {
  console.log(`\n▶ ${item.name}\n  $ ${item.args.join(" ")}`);
  try {
    const child = Bun.spawn([...item.args], {
      cwd: item.cwd,
      env: { ...process.env, ...item.env },
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });
    return { name: item.name, code: await child.exited };
  } catch (error) {
    console.error(`  ${error instanceof Error ? error.message : String(error)}`);
    return { name: item.name, code: 127 };
  }
}

/** Run a titled group of steps and print a summary. Returns true when every step passed. */
export async function group(title: string, steps: readonly Step[], concurrency = 1): Promise<boolean> {
  if (steps.length === 0) {
    console.log(`\n━━ ${title}: nothing to do ━━`);
    return true;
  }
  console.log(`\n━━ ${title} (${steps.length} step${steps.length === 1 ? "" : "s"}) ━━`);
  const results: Result[] = [];
  await runBounded(steps, concurrency, async (item) => {
    results.push(await run(item));
  });
  const failed = failures(results);
  for (const name of failed) console.error(`✖ ${name}`);
  console.log(
    failed.length ? `━━ ${title}: ${failed.length}/${steps.length} failed ━━` : `━━ ${title}: ${steps.length}/${steps.length} passed ━━`,
  );
  return failed.length === 0;
}

/** Run groups one after another; all groups run even when an earlier one fails, so one pass shows every problem. */
export async function stages(entries: readonly (readonly [string, readonly Step[], number?])[]): Promise<boolean> {
  let ok = true;
  for (const [title, steps, concurrency] of entries) ok = (await group(title, steps, concurrency)) && ok;
  return ok;
}

/** True when `program` is on PATH. */
export const has = (program: string): boolean => Bun.which(program) !== null;

/** A step that runs in the repository root. */
export const rootStep = (name: string, args: readonly string[], env?: Record<string, string>): Step => step(name, root, args, env);
