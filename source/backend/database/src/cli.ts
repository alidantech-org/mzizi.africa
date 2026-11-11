/** Database administration CLI; reset is intentionally not exposed by the first increment. */
import { getStatus, migrate, resetLocalDatabase } from "./migrations";
import { bootstrapAdmin, seedAuth, seedReference } from "./seeds";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { provisionLocalRoles } from "./roles";
import { verifyLocalOwnership } from "./verify";
import { checkDryvSchemaCatalog, planDryvSchemaCoverage, writeDryvSchemaCatalog } from "./dryv-schema";
const repository = resolve(import.meta.dir, "../../../..");
const command = process.argv[2];
const url = process.env.MZIZI_DATABASE_URL ?? "postgres://postgres@localhost:5432/mzizi_new";
async function serviceCall(path: string, body: unknown): Promise<unknown> {
  const base = process.env.DATABASE_SERVICE_URL;
  const token = process.env.DATABASE_SERVICE_TOKEN;
  if (!base || !token) throw new Error("DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN are required for release operations");
  const response = await fetch(new URL(`/internal/v1/pipelines/${path}`, base), {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Database service returned ${response.status}: ${await response.text()}`);
  return response.json();
}
async function proposePipelineSeeds(createdBy: string): Promise<unknown[]> {
  if (!/^[0-9a-f-]{36}$/i.test(createdBy)) throw new Error("pipeline release proposer must be an account UUID");
  const seedRoot = resolve(repository, "seed");
  const registry = parseYaml(await readFile(resolve(seedRoot, "manifest.yaml"), "utf8")) as { entries?: Array<{ loader?: string; path?: string }> };
  const entries = registry.entries?.filter((entry) => entry.loader === "database.pipeline-release") ?? [];
  if (!entries.length) throw new Error("seed/manifest.yaml has no database.pipeline-release entries");
  const proposals: unknown[] = [];
  for (const entry of entries) {
    if (!entry.path || entry.path.split("/").includes("..") || entry.path.startsWith("/")) throw new Error("pipeline seed entry has an invalid path");
    const path = resolve(seedRoot, entry.path);
    if (!path.startsWith(`${seedRoot}/`)) throw new Error("pipeline seed entry escapes seed root");
    const manifest = JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
    proposals.push(await serviceCall("releases", { manifest, createdBy }));
  }
  return proposals;
}
try {
  if (command === "generate") await writeDryvSchemaCatalog();
  else if (command === "schema-check") await checkDryvSchemaCatalog();
  else if (command === "plan") await planDryvSchemaCoverage();
  else if (command === "status") console.log(JSON.stringify(await getStatus(url), null, 2));
  else if (command === "migrate") console.log(JSON.stringify({ applied: await migrate(url) }, null, 2));
  else if (command === "provision-local-roles") {
    await provisionLocalRoles(url);
    console.log(JSON.stringify({ database: "mzizi_new", roles: ["database_runtime", "api_reader"], privilegedCredentialsUsedOnlyBy: "database CLI" }, null, 2));
  }
  else if (command === "verify") {
    await verifyLocalOwnership(url);
    console.log(JSON.stringify({ database: "mzizi_new", api: "read-only", databaseRuntime: "non-administrative", migrations: "CLI-only" }, null, 2));
  }
  else if (command === "seed") {
    const selection = process.argv[3] ?? "all";
    const seeded: Record<string, unknown> = {};
    if (selection === "all" || selection === "auth") seeded.auth = await seedAuth(url);
    if (selection === "all" || selection === "reference") seeded.reference = await seedReference(url);
    if (selection === "pipelines") seeded.pipelines = await proposePipelineSeeds(process.argv[4] ?? "");
    if (!(selection === "all" || selection === "auth" || selection === "reference" || selection === "pipelines")) throw new Error("Usage: db seed [auth|reference|all|pipelines <actor-uuid>]");
    console.log(JSON.stringify(seeded, null, 2));
  }
  else if (command === "reset") {
    if (process.argv[3] !== "--confirm" || process.argv[4] !== "mzizi_new") throw new Error("Usage: db reset --confirm mzizi_new");
    const applied = await resetLocalDatabase(url);
    const auth = await seedAuth(url);
    const reference = await seedReference(url);
    console.log(JSON.stringify({ database: "mzizi_new", applied, seeded: { auth, reference } }, null, 2));
  } else if (command === "bootstrap-admin") {
    const issuer = process.argv[3] ?? process.env.AUTH_BOOTSTRAP_ISSUER;
    const subject = process.argv[4] ?? process.env.AUTH_BOOTSTRAP_SUBJECT;
    const displayName = process.argv[5] ?? process.env.AUTH_BOOTSTRAP_NAME;
    if (!issuer || !subject || !displayName) throw new Error("Usage: db bootstrap-admin <issuer> <subject> <name> (or set AUTH_BOOTSTRAP_ISSUER, AUTH_BOOTSTRAP_SUBJECT, AUTH_BOOTSTRAP_NAME)");
    console.log(JSON.stringify({ accountId: await bootstrapAdmin(url, issuer, subject, displayName) }, null, 2));
  }
  else if (command === "release-propose") {
    const [, , , manifestPath, createdBy] = process.argv;
    if (!manifestPath || !createdBy) throw new Error("Usage: db:ts release-propose <seed-manifest.json> <actor-uuid>");
    const manifest = JSON.parse(await readFile(resolve(repository, manifestPath), "utf8"));
    console.log(JSON.stringify(await serviceCall("releases", { manifest, createdBy }), null, 2));
  } else if (command === "release-activate") {
    const [, , , releaseId, expectedHash] = process.argv;
    if (!releaseId || !expectedHash) throw new Error("Usage: db:ts release-activate <release-uuid> <expected-sha256>");
    console.log(JSON.stringify(await serviceCall(`releases/${releaseId}/activate`, { expectedHash }), null, 2));
  } else { console.error("Usage: bun src/cli.ts <generate|plan|schema-check|status|migrate|verify|provision-local-roles|seed [auth|reference|all|pipelines <actor-uuid>]|reset --confirm mzizi_new|bootstrap-admin|release-propose|release-activate>"); process.exitCode = 2; }
} catch (error) { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }
