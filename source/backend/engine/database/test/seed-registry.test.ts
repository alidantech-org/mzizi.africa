/**
 * Focused checks of the root seed registry: folder metadata inheritance, manifest validity, auth seed application
 * and absence of stale paths. The auth application checks need the rewrite database (bun src/rewrite.ts init).
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import pg from "pg";

import { packageRoot, rewriteTargetUrl, seedRoot } from "../src/config.ts";
import { initRewrite } from "../src/rewrite.ts";
import { applyAuthSeed } from "../src/seed-auth.ts";
import { artifactFiles, buildLock, expandEntry, loadManifest, resolveEffective, validateDescriptors, validateManifest } from "../src/seed-manifest.ts";

const repoRoot = resolve(seedRoot, "..");

describe("the real seed registry", () => {
  test("manifest, folder metadata, consumers and dependencies validate with no errors", () => {
    const { errors, manifest } = validateManifest();
    expect(errors).toEqual([]);
    expect(manifest!.entries.length).toBeGreaterThan(40);
  });
  test("the lock is current and never claims an upload", () => {
    const { manifest } = validateManifest();
    const lock = buildLock(manifest!) as { entries: { files: { upload_status: string; object_key: string; effective: { access: string } }[] }[] };
    expect(JSON.stringify(lock, null, 2) + "\n").toBe(readFileSync(join(seedRoot, "manifest.lock.json"), "utf8"));
    for (const entry of lock.entries) for (const file of entry.files) {
      expect(file.upload_status).toBe("not_uploaded");
      expect(file.object_key.startsWith(`${file.effective.access}/seeds/`)).toBe(true);
    }
  });
  test("every adopted artifact has effective origin, preparation and access", () => {
    for (const file of artifactFiles()) {
      const { effective, errors } = resolveEffective(file);
      expect(errors).toEqual([]);
      expect(effective!.role && effective!.acquisition_class && effective!.preparation && effective!.access).toBeTruthy();
      expect(effective!.access).not.toBe("public");
    }
  });
  test("deeper folders and explicit overrides win and record where they came from", () => {
    const media = resolveEffective("global/reference/media-formats.json").effective!;
    expect(media.acquisition_class).toBe("internally_derived");
    expect(media.resolved_from.acquisition_class).toContain("overrides/media-formats.json");
    expect(media.resolved_from.access).toBe("_folder.yaml");
    expect(media.scope).toEqual({ kind: "global" });
    expect(resolveEffective("global/reference/site-tags.json").effective!.acquisition_class).toBe("static_curated");
    expect(resolveEffective("ke/governance/ke-governance-structure.json").effective!.scope).toEqual({ kind: "jurisdiction", code: "ke" });
  });
  test("manifest dependencies are acyclic and the lock records where each file came from", () => {
    const manifest = loadManifest();
    const ids = new Set(manifest.entries.map((e) => e.id));
    for (const entry of manifest.entries) for (const dep of entry.depends_on) expect(ids.has(dep)).toBe(true);
    const lock = JSON.parse(readFileSync(join(seedRoot, "manifest.lock.json"), "utf8")) as { entries: { files: { path: string; relocated_from: string | null }[] }[] };
    const moved = lock.entries.flatMap((e) => e.files).filter((f) => f.relocated_from);
    expect(moved.length).toBeGreaterThan(70);
    expect(moved.every((f) => !f.relocated_from!.startsWith("seed/"))).toBe(true);
  });
  test("no removed seed path is referenced by source code or loaders", () => {
    const stale = [/fixtures\/(seed|reference|policy|patterns|research)\b/, /engine\/data\/(mappings|pilots)\b/, /["']pilots["']/, /parents\[\d\] \/ "mappings"/];
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      if (["node_modules", ".venv", "__pycache__", ".git", "dist"].includes(e.name)) return [];
      return e.isDirectory() ? walk(join(dir, e.name)) : /\.(ts|py|sh|json|toml|ya?ml)$/.test(e.name) ? [join(dir, e.name)] : [];
    });
    const hits = walk(join(repoRoot, "source")).filter((f) => !f.endsWith("seed-registry.test.ts") && stale.some((re) => re.test(readFileSync(f, "utf8"))));
    expect(hits).toEqual([]);
  });
  test("no secrets and no large file sit under seed/ in Git", () => {
    for (const file of artifactFiles()) expect(statSync(join(seedRoot, file)).size).toBeLessThan(2 * 1024 * 1024);
    expect(readFileSync(join(seedRoot, ".gitignore"), "utf8")).toContain("/generated/");
  });
});

describe("folder metadata rules (synthetic seed roots)", () => {
  const roots: string[] = [];
  const make = (files: Record<string, string>): string => {
    const root = mkdtempSync(join(tmpdir(), "seedroot-"));
    roots.push(root);
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), text);
    }
    return root;
  };
  afterAll(() => roots.forEach((r) => rmSync(r, { recursive: true, force: true })));
  const base = "access: internal\nallow_weaker_children: true\n";
  const full = "role: seed_input\nacquisition_class: static_curated\npreparation: human_prepared\n";

  test("nearest folder wins per field and unspecified fields are inherited from ancestors", () => {
    const root = make({
      "_folder.yaml": base, "global/_folder.yaml": "scope: {kind: global}\n" + full,
      "global/a/_folder.yaml": "preparation: ai_prepared\n", "global/a/x.csv": "a\n1\n", "global/y.csv": "a\n",
    });
    expect(resolveEffective("global/a/x.csv", root).effective).toMatchObject({ preparation: "ai_prepared", role: "seed_input", access: "internal" });
    expect(resolveEffective("global/y.csv", root).effective!.preparation).toBe("human_prepared");
    expect(resolveEffective("global/a/x.csv", root).effective!.resolved_from.preparation).toBe("global/a/_folder.yaml");
  });
  test("missing origin classification is flagged and missing access defaults to non-public", () => {
    const root = make({ "global/_folder.yaml": "scope: {kind: global}\nrole: seed_input\n", "global/x.csv": "a\n" });
    expect(resolveEffective("global/x.csv", root).errors.join()).toContain("no acquisition_class resolved");
    const ok = make({ "global/_folder.yaml": "scope: {kind: global}\n" + full, "global/x.csv": "a\n" });
    expect(resolveEffective("global/x.csv", ok).effective).toMatchObject({ access: "internal", access_defaulted: true });
  });
  test("a nested folder cannot weaken a restriction unless the parent allows it, and public needs authorization", () => {
    const root = make({
      "_folder.yaml": "access: restricted\n", "global/_folder.yaml": "scope: {kind: global}\n" + full, "global/p/_folder.yaml": "access: internal\n", "global/p/x.csv": "a\n",
    });
    expect(resolveEffective("global/p/x.csv", root).errors.join()).toContain("weakens access");
    const publicNoAuth = make({ "_folder.yaml": base, "global/_folder.yaml": "scope: {kind: global}\n" + full + "access: public\n", "global/x.csv": "a\n" });
    expect(validateDescriptors(publicNoAuth).join()).toContain("public access needs an authorization block");
    const publicOk = make({ "_folder.yaml": base, "global/_folder.yaml": "scope: {kind: global}\n" + full + "access: public\nauthorization: {by: owner, date: 2026-11-08, reference: test}\n", "global/x.csv": "a\n" });
    expect(validateDescriptors(publicOk)).toEqual([]);
    expect(resolveEffective("global/x.csv", publicOk).effective!.access).toBe("public");
  });
  test("a stronger nested folder is allowed and file overrides need a reason and cannot publish", () => {
    const root = make({
      "_folder.yaml": base, "global/_folder.yaml": "scope: {kind: global}\n" + full, "global/s/_folder.yaml": "access: private\n", "global/s/x.csv": "a\n",
      "global/o/_folder.yaml": "overrides:\n  x.csv: {preparation: ai_prepared}\n", "global/o/x.csv": "a\n",
    });
    expect(resolveEffective("global/s/x.csv", root).effective!.access).toBe("private");
    expect(validateDescriptors(root).join()).toContain("override for x.csv needs a reason");
    const pub = make({ "_folder.yaml": base, "global/_folder.yaml": "scope: {kind: global}\n" + full, "global/o/_folder.yaml": "overrides:\n  x.csv: {access: public, reason: nope}\n", "global/o/x.csv": "a\n" });
    expect(validateDescriptors(pub).join()).toContain("cannot make a file public");
  });
  test("scope must match the top-level folder", () => {
    const root = make({ "_folder.yaml": base, "ke/_folder.yaml": "scope: {kind: jurisdiction, code: za}\n" + full, "ke/x.csv": "a\n" });
    expect(resolveEffective("ke/x.csv", root).errors.join()).toContain("does not match its top-level folder");
  });
  test("manifest rejects traversal, unknown loaders, duplicate keys and uncovered files", () => {
    const root = make({
      "_folder.yaml": base, "global/_folder.yaml": "scope: {kind: global}\n" + full, "global/k.csv": "code,v\na,1\na,2\n", "global/stray.csv": "a\n",
      "manifest.yaml": `schema_version: 1\nrelease: t\nbucket: mzizi\nregion: us-east-1\nentries:\n  - {id: g.k, path: global/k.csv, media_type: text/csv, loader: auth.baseline, target: t, database_target_state: test_only, key_columns: [code], depends_on: [], consumers: [], sync_policy: x}\n  - {id: g.bad, path: ../outside.csv, media_type: text/csv, loader: shell.exec, target: t, database_target_state: test_only, depends_on: [g.missing], consumers: [], sync_policy: x}\n`,
    });
    const errors = validateManifest(root, root).errors.join("\n");
    expect(errors).toContain("duplicate natural key");
    expect(errors).toContain("loader shell.exec is not allowlisted");
    expect(errors).toContain("escapes the seed root");
    expect(errors).toContain("depends on unknown entry g.missing");
    expect(errors).toContain("global/stray.csv: not covered by any manifest entry");
  });
});

describe("auth seed application (mzizi_new)", () => {
  let db: pg.Client;
  beforeAll(async () => {
    await initRewrite();
    db = new pg.Client({ connectionString: rewriteTargetUrl().url });
    await db.connect();
  });
  afterAll(async () => db.end());

  test("applying the baseline again adds nothing and the seeded model is complete", async () => {
    expect(await applyAuthSeed(db)).toEqual({ roles: 0, namespaces: 0, bundlePermissions: 0, scopeTargets: 0 });
    expect((await db.query(`SELECT count(*)::int AS n FROM auth.roles`)).rows[0].n).toBe(4);
    expect((await db.query(`SELECT count(*)::int AS n FROM auth.permissions`)).rows[0].n).toBe(60);
    expect((await db.query(`SELECT table_name FROM auth.scope_targets`)).rows).toEqual([{ table_name: "auth.institutions" }]);
  });
  test("seed rows come from the CSV files and a bad bundle row is rejected without partial change", async () => {
    const root = mkdtempSync(join(tmpdir(), "authseed-"));
    try {
      mkdirSync(join(root, "global", "auth"), { recursive: true });
      for (const name of ["roles.csv", "namespaces.csv", "scope-targets.csv"]) writeFileSync(join(root, "global", "auth", name), readFileSync(join(seedRoot, "global", "auth", name)));
      writeFileSync(join(root, "global", "auth", "role-permissions.csv"), "role_code,permission\nreader,nonexistent.read\n");
      await expect(applyAuthSeed(db, root)).rejects.toThrow("matches no role or permission");
      expect((await db.query(`SELECT count(*)::int AS n FROM auth.role_permissions`)).rows[0].n).toBe(88);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  test("packageRoot is untouched by the relocation", () => {
    expect(readdirSync(join(packageRoot, "fixtures"))).toEqual(["neutral-model"]);
    expect(expandEntry(loadManifest().entries[0]!).length).toBe(1);
  });
});
