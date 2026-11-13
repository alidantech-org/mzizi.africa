/** Deterministic source audit for the six authorized Main schema inventories. */
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const contracts = join(root, "contracts/schemas/mzizi");
const expected: Record<string, string[]> = {
  official: ["entities", "individuals", "names", "identifiers", "contacts", "relationships"],
  governance: ["institutions", "offices", "holders", "mandates", "relationships", "authority_scopes"],
  politics: [
    "parties",
    "memberships",
    "coalitions",
    "alignments",
    "elections",
    "contests",
    "candidates",
    "electorates",
    "results",
    "manifestos",
    "manifesto_items",
    "referendum_options",
    "option_results",
  ],
  civic: ["services", "projects", "project_features", "procurements", "bids", "contracts", "deliveries"],
  finance: ["fiscal_periods", "budgets", "budget_versions", "appropriations", "funds", "flows", "debts"],
};
const problems: string[] = [];
for (const [schema, tables] of Object.entries(expected)) {
  const source = await Bun.file(join(contracts, `${schema}.ts`)).text();
  const helperTables = [...source.matchAll(/table\(\s*"([A-Za-z]+)"/g)].map((match) =>
    match[1]!.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase(),
  );
  const explicitTables = [...source.matchAll(/\.storage\("([a-z_]+)"\)/g)].map((match) => match[1]!);
  const found = [...helperTables, ...explicitTables].sort();
  const wanted = [...tables].sort();
  if (JSON.stringify(found) !== JSON.stringify(wanted)) {
    problems.push(`${schema} storage inventory mismatch: expected [${wanted}], found [${found}]`);
  }
}
const accountability = await Bun.file(join(contracts, "accountability.ts")).text();
if (/\.storage\(/.test(accountability)) problems.push("accountability must not declare persisted storage");
for (const view of [
  "BudgetExecution",
  "ProcurementPerformance",
  "ProjectPerformance",
  "ServiceCoverage",
  "InstitutionalPerformance",
  "PromiseProgress",
  "OversightSignals",
]) {
  if (!accountability.includes(`.schema("${view}"`)) problems.push(`accountability output missing: ${view}`);
  if (!new RegExp(`\\.schema\\("${view}"[\\s\\S]*?\\.role\\("view-model"\\)`).test(accountability))
    problems.push(`accountability output must be a view-model: ${view}`);
}
const civic = await Bun.file(join(contracts, "civic.ts")).text();
for (const forbidden of ["service_locations", 'storage("assets")', 'storage("networks")', 'storage("segments")']) {
  if (civic.includes(forbidden)) problems.push(`Civic duplicates Geography ownership: ${forbidden}`);
}
const finance = await Bun.file(join(contracts, "finance.ts")).text();
if (/storage\("units"\)/.test(finance)) problems.push("Finance must not own measurement/geographic units");
if (!finance.includes("AmountMinorUnits") || !finance.includes("currencyId"))
  problems.push("Finance must retain exact currency-minor-unit amounts and a currency FK");
const persistence = await Bun.file(join(root, "contracts/apps/database/persistence.ts")).text();
if (/^\s*(procurement|accountability):/m.test(persistence))
  problems.push("Procurement and non-persisted Accountability cannot be assigned storage namespaces");
const app = await Bun.file(join(root, "contracts/apps/database/index.ts")).text();
for (const schema of [...Object.keys(expected), "geography", "legal", "source", "filesystem"]) {
  if (!app.includes(`import { ${schema} }`)) problems.push(`database app does not explicitly import ${schema}`);
}
if (!app.includes('import { reference } from "../../schemas/mzizi/reference.ts"'))
  problems.push("database app does not import the persisted Reference group");
if (problems.length) {
  console.error(`Main domain contract audit failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("Main domain contracts OK (39 persisted tables; Accountability has no storage)");
