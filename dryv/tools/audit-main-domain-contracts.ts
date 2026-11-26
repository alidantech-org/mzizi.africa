/**
 * Deterministic source audit of the approved PostgreSQL inventory (FOUNDATION_REDESIGN sections 2–34, approved
 * 2026-11-25). Fails when a schema file's tables differ from the approved list, when a removed schema reappears, when a
 * domain table carries a provenance column (section 23) or a subject link outside `source` (section 16), or when the
 * pgsql app does not list a schema.
 */
import { Glob } from "bun";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const contracts = join(root, "contracts/schemas/postgres");
const approved: Record<string, string[]> = {
  auth: [
    "accounts",
    "allowances",
    "codes",
    "delegations",
    "grants",
    "invitations",
    "logins",
    "memberships",
    "permissions",
    "privileges",
    "roles",
    "scopes",
  ],
  civic: [
    "attachments",
    "bids",
    "contracts",
    "deliveries",
    "facilities",
    "items",
    "procurements",
    "projects",
    "roles",
    "scores",
    "services",
    "sites",
    "variations",
  ],
  community: [
    "actors",
    "attachments",
    "blocks",
    "cases",
    "checks",
    "consents",
    "devices",
    "dispatches",
    "notifications",
    "places",
    "posts",
    "preferences",
    "proofs",
    "reactions",
    "replies",
    "subscriptions",
    "tokens",
    "views",
  ],
  economy: ["baskets", "codes", "compositions", "crosswalks", "goods", "names", "prices", "weights"],
  election: [
    "attachments",
    "candidates",
    "choices",
    "contests",
    "elections",
    "forms",
    "results",
    "stations",
    "tallies",
    "turnouts",
  ],
  event: [
    "calendars",
    "changes",
    "events",
    "items",
    "occurrences",
    "participants",
    "rules",
    "schedules",
    "seasons",
    "subjects",
    "venues",
  ],
  filesystem: ["files", "folders", "formats", "versions"],
  finance: ["appropriations", "budgets", "debts", "findings", "flows", "funds", "periods", "revisions"],
  geography: ["areas", "assets", "changes", "features", "geometries", "outlines", "pieces", "relationships"],
  governance: [
    "appointments",
    "assignments",
    "functions",
    "holders",
    "institutions",
    "jurisdictions",
    "obligations",
    "offices",
    "positions",
    "powers",
    "procedures",
    "relationships",
    "reports",
    "terms",
  ],
  history: ["eras", "links", "occurrences", "roles"],
  identity: ["addresses", "classifications", "identifiers", "identities", "names", "tags"],
  legal: ["editions", "effects", "instruments", "provisions", "references", "relationships", "translations", "wordings"],
  legislature: [
    "agenda",
    "attachments",
    "bills",
    "hansards",
    "motions",
    "sittings",
    "speeches",
    "stages",
    "summaries",
    "votes",
  ],
  media: ["articles", "assets", "captions", "subjects", "texts", "uses"],
  official: ["branding", "contacts", "entities", "individuals", "parts", "premises", "relationships"],
  politics: [
    "alignments",
    "attachments",
    "coalitions",
    "commitments",
    "contributions",
    "fulfilments",
    "manifestos",
    "memberships",
    "parties",
  ],
  product: ["apps", "keys", "lang", "messages", "releases", "sites"],
  reference: ["countries", "currencies", "hierarchies", "languages", "levels", "locales", "timezones", "units"],
  source: [
    "artifacts",
    "attributions",
    "captures",
    "citations",
    "contenders",
    "coverage",
    "derivations",
    "discoveries",
    "disputes",
    "domains",
    "editions",
    "evidence",
    "paths",
    "products",
    "publishers",
    "sources",
    "verifications",
  ],
  statistics: [
    "breakdowns",
    "collections",
    "components",
    "dimensions",
    "figures",
    "indicators",
    "metrics",
    "observations",
    "priorities",
  ],
  template: ["items", "lines", "patterns", "templates", "texts"],
  vocabulary: ["labels", "mappings", "schemes", "scopes", "terms"],
};
const removed = ["accountability"];
const problems: string[] = [];
for (const [schema, tables] of Object.entries(approved)) {
  const file = Bun.file(join(contracts, `${schema}.ts`));
  if (!(await file.exists())) {
    problems.push(`${schema}: contract file is missing`);
    continue;
  }
  const source = await file.text();
  const found = [...source.matchAll(/\.storage\("([a-z_]+)"\)/g)].map((match) => match[1] as string).sort();
  const wanted = [...tables].sort();
  if (JSON.stringify(found) !== JSON.stringify(wanted))
    problems.push(`${schema} storage inventory mismatch: expected [${wanted}], found [${found}]`);
  if (schema !== "source") {
    for (const forbidden of ["sourceCitationId", "citationId", "verifiedCitationId", "observedAt"])
      if (new RegExp(`\\b${forbidden}:`).test(source))
        problems.push(`${schema}: provenance column ${forbidden} (section 23)`);
    if (source.includes("subjectFields")) problems.push(`${schema}: subject link outside source (section 16)`);
  }
}
for await (const file of new Glob("*.ts").scan(contracts)) {
  const name = file.replace(/\.ts$/, "");
  if (name.startsWith("_")) continue;
  if (!(name in approved)) problems.push(`${name}.ts is not an approved schema`);
}
for (const schema of removed)
  if (await Bun.file(join(contracts, `${schema}.ts`)).exists()) problems.push(`${schema} was removed by the owner`);
const app = await Bun.file(join(root, "contracts/apps/pgsql/index.ts")).text();
for (const schema of Object.keys(approved))
  if (!app.includes(`import { ${schema} } from "#/schemas/postgres/${schema}.ts"`))
    problems.push(`pgsql app does not import ${schema}`);
if (problems.length) {
  console.error(`Main domain contract audit failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
const total = Object.values(approved).reduce((sum, tables) => sum + tables.length, 0);
console.log(`Main domain contracts OK (${Object.keys(approved).length} schemas, ${total} tables)`);
