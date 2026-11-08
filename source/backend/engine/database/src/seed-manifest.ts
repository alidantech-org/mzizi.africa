/**
 * Seed registry tooling: folder metadata resolution, manifest validation and the manifest lock.
 *
 * Folder metadata (`_folder.yaml`) and the manifest are described in seed/README.md. This module only reads and
 * validates; it never uploads, applies or deletes anything. S3 object keys it computes are mappings, not claims.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";

import { seedRoot } from "./config.ts";

export const ACCESS_RANK = { public: 0, internal: 1, restricted: 2, private: 3 } as const;
export type Access = keyof typeof ACCESS_RANK;
export const ROLES = ["test_fixture", "seed_input", "pattern_definition", "site_structure", "import_mapping", "policy_definition", "research_registry", "generated_output"] as const;
export const ACQUISITION = ["static_curated", "pattern_generated", "externally_collected", "internally_derived"] as const;
export const PREPARATION = ["human_prepared", "ai_prepared", "human_and_ai_assisted", "programmatically_generated", "unknown"] as const;

/** Loaders the manifest may name. A manifest can never make the engine run an arbitrary script or SQL. */
export const LOADERS = new Set([
  "auth.baseline",
  "fixtures.entities",
  "database.governance-catalogue",
  "database.expected-sites",
  "database.domain-zones",
  "database.statistical-catalogue",
  "database.office-patterns",
  "database.media-expectations",
  "database.assessment-policy",
  "engine.import-mappings",
  "engine.site-structure",
  "engine.landmark-places",
  "engine.crawl-sections",
  "engine.domain-spellings",
  "engine.office-holders",
  "engine.probe-policy",
  "engine.tag-vocabulary",
  "engine.crawl-policy",
  "engine.wikimedia-config",
  "engine.party-rules",
  "engine.census-order",
  "test.catalogue-checks",
  "none.unconsumed",
]);

const INHERITED = ["role", "acquisition_class", "preparation", "access", "scope", "review"] as const;
const OVERRIDABLE = new Set(["role", "acquisition_class", "preparation", "access", "review"]);
const NOT_ARTIFACTS = new Set(["README.md", "_folder.yaml", "manifest.yaml", "manifest.lock.json", ".gitignore"]);
const IGNORED_DIRS = new Set(["generated", "local", "cache", "examples"]);
/** Test fixtures live under seed/fixtures: classified by folder metadata but not seeds (no manifest entry, never registered). */
const FIXTURES_DIR = "fixtures";
const MAX_BYTES = 2 * 1024 * 1024;
const SECRET = /(BEGIN [A-Z ]*PRIVATE KEY|AKIA[0-9A-Z]{16}|aws_secret_access_key|password\s*[:=]\s*\S+|client_secret\s*[:=]\s*\S+)/i;

export interface Descriptor {
  description?: string;
  role?: string;
  acquisition_class?: string;
  preparation?: string;
  access?: Access;
  authorization?: { by: string; date: string; reference: string };
  allow_weaker_children?: boolean;
  scope?: { kind: "global" | "system" | "jurisdiction"; code?: string };
  review?: { status: "reviewed" | "needs_review"; note: string };
  overrides?: Record<string, Record<string, unknown> & { reason?: string }>;
}

export interface Effective {
  role: string;
  acquisition_class: string;
  preparation: string;
  access: Access;
  access_defaulted: boolean;
  scope: Descriptor["scope"];
  review: Descriptor["review"] | null;
  resolved_from: Record<string, string>;
  file_override: string[] | null;
}

export const parseYaml = <T = unknown>(text: string): T => (Bun as unknown as { YAML: { parse(text: string): unknown } }).YAML.parse(text) as T;

export function readDescriptor(dir: string, root = seedRoot): Descriptor | null {
  const file = join(root, dir, "_folder.yaml");
  return existsSync(file) ? parseYaml<Descriptor>(readFileSync(file, "utf8")) : null;
}

/** Folder chain from the seed root down to the folder that contains `path` (posix, relative to the root). */
function folderChain(path: string): string[] {
  const parts = dirname(path).split("/").filter((part) => part && part !== ".");
  return ["", ...parts.map((_, i) => parts.slice(0, i + 1).join("/"))];
}

/** Descriptor-level validation (independent of any file): enumerations, access rules, public authorization. */
export function validateDescriptors(root = seedRoot): string[] {
  const errors: string[] = [];
  const walk = (dir: string): void => {
    const descriptor = readDescriptor(dir, root);
    const where = `${dir || "."}/_folder.yaml`;
    if (descriptor) {
      if (descriptor.access && !(descriptor.access in ACCESS_RANK)) errors.push(`${where}: unknown access ${descriptor.access}`);
      if (descriptor.role && !ROLES.includes(descriptor.role as never)) errors.push(`${where}: unknown role ${descriptor.role}`);
      if (descriptor.acquisition_class && !ACQUISITION.includes(descriptor.acquisition_class as never)) errors.push(`${where}: unknown acquisition_class ${descriptor.acquisition_class}`);
      if (descriptor.preparation && !PREPARATION.includes(descriptor.preparation as never)) errors.push(`${where}: unknown preparation ${descriptor.preparation}`);
      if (descriptor.access === "public" && !(descriptor.authorization?.by && descriptor.authorization.date && descriptor.authorization.reference)) {
        errors.push(`${where}: public access needs an authorization block (by, date, reference)`);
      }
      if (descriptor.scope?.kind === "jurisdiction" && !descriptor.scope.code) errors.push(`${where}: jurisdiction scope needs a code`);
      for (const [name, override] of Object.entries(descriptor.overrides ?? {})) {
        if (!override.reason) errors.push(`${where}: override for ${name} needs a reason`);
        if (!existsSync(join(root, dir, name))) errors.push(`${where}: override names a file that does not exist: ${name}`);
        for (const key of Object.keys(override)) if (key !== "reason" && !OVERRIDABLE.has(key)) errors.push(`${where}: override of ${key} is not allowed`);
        if (override.access === "public") errors.push(`${where}: a per-file override cannot make a file public; use a small authorized folder`);
      }
    }
    for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
      if (entry.isDirectory() && !(dir === "" && IGNORED_DIRS.has(entry.name))) walk(dir ? `${dir}/${entry.name}` : entry.name);
    }
  };
  walk("");
  return errors;
}

/** Effective metadata of one artifact: nearest explicit folder value per field, then an explicit file override. */
export function resolveEffective(path: string, root = seedRoot): { effective?: Effective; errors: string[] } {
  const errors: string[] = [];
  const chain = folderChain(path);
  const resolved_from: Record<string, string> = {};
  const values: Record<string, unknown> = {};
  let accessFloor: { rank: number; dir: string; weaker_ok: boolean } | null = null;
  for (const dir of chain) {
    const descriptor = readDescriptor(dir, root);
    if (!descriptor) continue;
    for (const field of INHERITED) {
      if (descriptor[field] === undefined) continue;
      if (field === "access") {
        const rank = ACCESS_RANK[descriptor.access as Access];
        if (accessFloor && rank < accessFloor.rank && !accessFloor.weaker_ok) errors.push(`${path}: ${dir || "."} weakens access set by ${accessFloor.dir || "."}, which does not allow weaker children`);
        accessFloor = { rank, dir, weaker_ok: descriptor.allow_weaker_children === true };
      }
      values[field] = descriptor[field];
      resolved_from[field] = `${dir ? dir + "/" : ""}_folder.yaml`;
    }
  }
  const containing = chain[chain.length - 1] as string;
  const override = readDescriptor(containing, root)?.overrides?.[path.split("/").pop() as string];
  let file_override: string[] | null = null;
  if (override) {
    file_override = Object.keys(override).filter((key) => key !== "reason");
    for (const key of file_override) {
      if (key === "access" && ACCESS_RANK[override.access as Access] < (accessFloor?.rank ?? 0)) errors.push(`${path}: file override weakens access`);
      values[key] = override[key];
      resolved_from[key] = `${containing ? containing + "/" : ""}_folder.yaml#overrides/${path.split("/").pop()}`;
    }
  }
  for (const field of ["role", "acquisition_class", "preparation", "scope"]) if (values[field] === undefined) errors.push(`${path}: no ${field} resolved from any folder; classify it before registration`);
  const scope = values.scope as Descriptor["scope"];
  const top = path.split("/")[0];
  if (scope) {
    const expected = scope.kind === "global" ? "global" : scope.kind === "system" ? "system" : scope.code;
    if (top !== expected && !(top === FIXTURES_DIR && scope.kind === "system")) errors.push(`${path}: scope ${scope.kind}${scope.code ? ":" + scope.code : ""} does not match its top-level folder ${top}`);
  }
  if (errors.length) return { errors };
  const access = ((values.access as Access | undefined) ?? "internal") as Access;
  return {
    errors,
    effective: {
      role: values.role as string, acquisition_class: values.acquisition_class as string, preparation: values.preparation as string,
      access, access_defaulted: values.access === undefined, scope, review: (values.review as Descriptor["review"]) ?? null, resolved_from, file_override,
    },
  };
}

// ----------------------------------------------------------------------- manifest
export interface Entry {
  id: string;
  path?: string;
  glob?: string;
  media_type: string;
  loader: string;
  target: string;
  database_target_state: "mzizi_new" | "legacy_dev_only" | "pending_rewrite_schema" | "test_only";
  key_columns?: string[];
  depends_on: string[];
  consumers: string[];
  relocated_from?: string | null | Record<string, string>;
  notes?: string;
  sync_policy: string;
}
export interface Manifest {
  schema_version: 1;
  release: string;
  bucket: string;
  region: string;
  entries: Entry[];
}

export const loadManifest = (root = seedRoot): Manifest => parseYaml<Manifest>(readFileSync(join(root, "manifest.yaml"), "utf8"));

function listFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)]));
}

/** All adoptable artifacts under the seed root, posix-relative and sorted. */
export function artifactFiles(root = seedRoot): string[] {
  return allFiles(root).filter((path) => path.split("/")[0] !== FIXTURES_DIR);
}

/** Every file under seed/fixtures (test-only; classified but not part of the manifest). */
export function fixtureFiles(root = seedRoot): string[] {
  return allFiles(root).filter((path) => path.split("/")[0] === FIXTURES_DIR);
}

function allFiles(root: string): string[] {
  return listFiles(root)
    .map((file) => relative(root, file).split(sep).join("/"))
    .filter((path) => !IGNORED_DIRS.has(path.split("/")[0] as string) && !NOT_ARTIFACTS.has(path.split("/").pop() as string))
    .sort();
}

export function expandEntry(entry: Entry, root = seedRoot): string[] {
  if (entry.path) return [entry.path];
  const base = (entry.glob as string).replace(/\*.*$/, "");
  const pattern = new RegExp("^" + (entry.glob as string).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "$");
  return artifactFiles(root).filter((file) => file.startsWith(base) && pattern.test(file));
}

const sha256 = (path: string): string => createHash("sha256").update(readFileSync(path)).digest("hex");

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') quoted = false; else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((value) => value !== ""));
}
export { parseCsv };

export function validateManifest(root = seedRoot, repoRoot = resolve(root, "..")): { errors: string[]; warnings: string[]; manifest?: Manifest } {
  const errors = validateDescriptors(root);
  const warnings: string[] = [];
  let manifest: Manifest;
  try {
    manifest = loadManifest(root);
  } catch (error) {
    return { errors: [...errors, `manifest.yaml: ${(error as Error).message}`], warnings };
  }
  if (manifest.schema_version !== 1) errors.push("manifest.yaml: schema_version must be 1");
  if (manifest.bucket !== "mzizi") errors.push("manifest.yaml: bucket must be mzizi (no new buckets)");
  if (manifest.region !== "us-east-1") errors.push("manifest.yaml: region must be us-east-1");
  const ids = new Set<string>();
  const covered = new Map<string, string>();
  for (const entry of manifest.entries) {
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(entry.id)) errors.push(`${entry.id}: invalid id`);
    if (ids.has(entry.id)) errors.push(`${entry.id}: duplicate id`);
    ids.add(entry.id);
    if (!!entry.path === !!entry.glob) errors.push(`${entry.id}: needs exactly one of path or glob`);
    if (!LOADERS.has(entry.loader)) errors.push(`${entry.id}: loader ${entry.loader} is not allowlisted`);
    for (const target of [entry.path, entry.glob]) if (target && (target.startsWith("/") || target.split("/").includes(".."))) errors.push(`${entry.id}: path escapes the seed root`);
    const files = errors.length && (entry.path?.includes("..") || entry.glob?.includes("..")) ? [] : expandEntry(entry, root);
    if (!files.length) errors.push(`${entry.id}: matches no files`);
    for (const file of files) {
      const abs = join(root, file);
      if (!existsSync(abs)) { errors.push(`${entry.id}: ${file} does not exist`); continue; }
      if (covered.has(file)) errors.push(`${file}: covered by both ${covered.get(file)} and ${entry.id}`);
      covered.set(file, entry.id);
      if (statSync(abs).size > MAX_BYTES) errors.push(`${file}: larger than ${MAX_BYTES} bytes; large inputs belong in generated/ with a regeneration recipe`);
      if (SECRET.test(readFileSync(abs, "utf8"))) errors.push(`${file}: looks like it contains a secret`);
      const { errors: metaErrors, effective } = resolveEffective(file, root);
      errors.push(...metaErrors);
      if (effective?.review?.status === "needs_review") warnings.push(`${file}: classification needs review (${effective.review.note})`);
      if (effective?.access_defaulted) warnings.push(`${file}: no access policy found; defaulted to internal`);
      if (entry.key_columns?.length && extname(file) === ".csv") {
        const [header, ...rows] = parseCsv(readFileSync(abs, "utf8"));
        const idx = entry.key_columns.map((column) => (header as string[]).indexOf(column));
        if (idx.includes(-1)) errors.push(`${file}: key column missing from header`);
        else {
          const seen = new Set<string>();
          for (const row of rows) { const key = idx.map((i) => row[i]).join("\u0001"); if (seen.has(key)) errors.push(`${file}: duplicate natural key ${key.replace("\u0001", "/")}`); seen.add(key); }
        }
      }
      if (entry.key_columns?.[0] === "key" && extname(file) === ".json") {
        const rows = (JSON.parse(readFileSync(abs, "utf8")) as { rows?: { key: string }[] }).rows ?? [];
        const keys = rows.map((row) => row.key);
        if (new Set(keys).size !== keys.length) errors.push(`${file}: duplicate row keys`);
      }
    }
    for (const consumer of entry.consumers ?? []) {
      const abs = join(repoRoot, consumer);
      if (!existsSync(abs)) { errors.push(`${entry.id}: consumer ${consumer} does not exist`); continue; }
      const text = readFileSync(abs, "utf8");
      // The consumer must mention the file name (single file) or the bundle folder name (glob).
      const marker = entry.path ? (entry.path.split("/").pop() as string) : ((entry.glob as string).replace(/\/?\*.*$/, "").split("/").pop() as string);
      if (!text.includes(marker)) errors.push(`${entry.id}: consumer ${consumer} does not reference ${marker}`);
    }
  }
  for (const entry of manifest.entries) for (const dep of entry.depends_on ?? []) if (!ids.has(dep)) errors.push(`${entry.id}: depends on unknown entry ${dep}`);
  // cycle check
  const state = new Map<string, number>();
  const byId = new Map(manifest.entries.map((e) => [e.id, e]));
  const visit = (id: string, trail: string[]): void => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) { errors.push(`dependency cycle: ${[...trail, id].join(" -> ")}`); return; }
    state.set(id, 1);
    for (const dep of byId.get(id)?.depends_on ?? []) if (byId.has(dep)) visit(dep, [...trail, id]);
    state.set(id, 2);
  };
  for (const id of ids) visit(id, []);
  for (const file of artifactFiles(root)) if (!covered.has(file)) errors.push(`${file}: not covered by any manifest entry`);
  for (const file of fixtureFiles(root)) {
    if (covered.has(file)) errors.push(`${file}: test fixtures must not be manifest entries`);
    errors.push(...resolveEffective(file, root).errors);
    if (SECRET.test(readFileSync(join(root, file), "utf8"))) errors.push(`${file}: looks like it contains a secret`);
  }
  return { errors, warnings, manifest };
}

// ---------------------------------------------------------------------- lock
const ACCESS_PREFIX: Record<Access, string> = { public: "public", internal: "internal", restricted: "restricted", private: "private" };

export function buildLock(manifest: Manifest, root = seedRoot): unknown {
  const manifestText = readFileSync(join(root, "manifest.yaml"), "utf8");
  return {
    release: manifest.release,
    manifest_sha256: createHash("sha256").update(manifestText).digest("hex"),
    generated_by: "bun src/seed.ts lock (source/backend/engine/database); programmatic, no model involved",
    bucket: manifest.bucket,
    region: manifest.region,
    note: "upload_status is always not_uploaded here: no artifact has been uploaded or verified in S3 by this lock. Object keys are mappings only.",
    entries: manifest.entries.map((entry) => ({
      id: entry.id, loader: entry.loader, target: entry.target, database_target_state: entry.database_target_state, depends_on: entry.depends_on, sync_policy: entry.sync_policy,
      files: expandEntry(entry, root).map((file) => {
        const effective = resolveEffective(file, root).effective as Effective;
        const digest = sha256(join(root, file));
        const globBase = entry.glob ? (entry.glob as string).replace(/[^/]*\*.*$/, "") : "";
        const base = entry.path ? (file.split("/").pop() as string).replace(/\.[^.]+$/, "") : file.slice(globBase.length).replace(/\.[^./]+$/, "");
        const ext = extname(file).slice(1);
        return {
          path: file, sha256: digest, bytes: statSync(join(root, file)).size, media_type: entry.media_type,
          relocated_from: typeof entry.relocated_from === "string" ? entry.relocated_from : (entry.relocated_from as Record<string, string> | undefined)?.[file] ?? null,
          effective, bucket: manifest.bucket,
          object_key: `${ACCESS_PREFIX[effective.access]}/seeds/${entry.id.replaceAll(".", "/")}/${manifest.release}/${base}.${digest.slice(0, 16)}.${ext}`,
          upload_status: "not_uploaded",
        };
      }),
    })),
  };
}
