/**
 * Frontend gates (`bun run frontend`).
 *
 * Mzizi's web app reaches the API only through generated server actions, and its pages are server components.
 * Failing rules (hand-written code only; generated folders are skipped):
 * - a `"use client"` directive in a route's `page.tsx` or `layout.tsx` (interactive parts live in leaf components),
 * - a browser `fetch(` call,
 * - a route handler (`route.ts`) that invents an endpoint.
 * Reported, not failing, until the remaining copy is moved: country, currency and colour literals in hand-written code.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { root } from "../lib/paths.ts";

const web = join(root, "source/apps/web");
const handWritten = ["app", "components/site", "components/shell", "lib/site", "lib/server"];
const skip = new Set(["node_modules", ".next", "dryv"]);

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (/\.(ts|tsx)$/.test(name)) yield path;
  }
}

export function checkFrontend(): boolean {
  const failures: string[] = [];
  const literals = { kenya: 0, currency: 0, hex: 0, indicators: 0, clientViews: 0 };
  for (const folder of handWritten) {
    for (const file of walk(join(web, folder))) {
      const text = readFileSync(file, "utf8");
      const where = relative(root, file);
      const base = file.split("/").pop() ?? "";
      if ((base === "page.tsx" || base === "layout.tsx") && /^\s*["']use client["']/.test(text)) failures.push(`${where}: "use client" in a route file`);
      if (/\bfetch\(/.test(text)) failures.push(`${where}: browser fetch`);
      if (base === "route.ts" || base === "route.tsx") failures.push(`${where}: route handler`);
      literals.kenya += (text.match(/["'`][^"'`\n]*\bKenya\b/g) ?? []).length;
      literals.currency += (text.match(/["'`]KSh\b/g) ?? []).length;
      literals.hex += (text.match(/#[0-9a-fA-F]{6}\b/g) ?? []).length;
      literals.indicators += (text.match(/["'`](?:sta|civ)\.[a-z0-9][a-z0-9.-]*["'`]/g) ?? []).length;
      if (where.includes("/app/") && base === "view.tsx" && /^\s*["']use client["']/.test(text)) literals.clientViews += 1;
    }
  }
  for (const line of failures) console.error(`frontend: ${line}`);
  // Settled: no country, currency or colour literal may come back.
  if (literals.kenya > 0) failures.push(`${literals.kenya} country literal(s) in hand-written code`);
  if (literals.currency > 0) failures.push(`${literals.currency} currency literal(s) in hand-written code`);
  if (literals.hex > 0) failures.push(`${literals.hex} hex colour(s) in hand-written code`);
  for (const line of failures) if (line.includes("literal") || line.includes("hex")) console.error(`frontend: ${line}`);
  console.log(`frontend: report: indicator codes in code ${literals.indicators}, client view files under app ${literals.clientViews} (both to reach zero; see MUST-FIX.md)`);
  if (failures.length === 0) console.log("frontend: ok");
  return failures.length === 0;
}
