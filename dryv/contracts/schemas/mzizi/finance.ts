/**
 * Schema: finance | Database: mzizi
 * Approved contract: fiscal periods, versioned budgets, appropriations, funds, flows and debt.
 * Monetary values are exact integer minor units paired with a Reference currency identity.
 * SQL generation remains gated on code-shape/CHECK enforcement and currency-scale policy.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { geographySchemas } from "./geography.ts";
import { officialSchemas } from "./official.ts";
import { referenceLegalSchemas, referenceSchemas } from "./reference.ts";
import { sourceSchemas } from "./source.ts";
import { civicSchemas } from "./civic.ts";

export const finance = dryv
  .group({ name: "finance" })
  .description("Fiscal periods, budget releases and appropriations, funds, recorded flows and public debt.")
  .facets({ storage: { namespace: "finance" } });
// biome-ignore lint/suspicious/noExplicitAny: enables typed links among Finance records.
export const financeSchemas: Record<string, any> = {};
const id = () => dryv.field(sharedProperties.Id);
const ref = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const optRef = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().optional().nullable().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const tableName = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
const grains: Record<string, string> = {
  FiscalPeriods: "One fiscal reporting period for a country, with explicit date bounds and source citation.",
  Budgets: "One institutional/country budget identity for a fiscal period and budget classification.",
  BudgetVersions: "One ordered release or revision of a budget, preserving original and supplementary versions separately.",
  Appropriations: "One classified amount authorized in a budget version, optionally nested and assigned to a project or unit.",
  Funds: "One named public fund with a classification, manager, country and optional legal basis.",
  Flows: "One reported financial flow at its source transaction grain, not a rolled-up aggregate.",
  Debts: "One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts.",
};
const table = (name: string, fields: Record<string, any>, indexes: any[] = []) => {
  const x = finance.schemas({
    [name]: dryv
      .schema({ id: id(), ...fields })
      .description(grains[name]!)
      .role("entity")
      .facets({
        storage: dryv
          .storage(tableName(name))
          .primaryKey("id")
          .indexes(...indexes, { name: `idx_${tableName(name)}_citation`, fields: ["source_citation_id"] }),
      }),
  });
  financeSchemas[name] = x[name];
};
const money = {
  amount_minor_units: dryv.field(sharedProperties.AmountMinorUnits),
  currency_id: ref(() => referenceSchemas.Value.field("id")),
};
/*---------------- finance.fiscal_periods ----------------*/
table(
  "FiscalPeriods",
  {
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    starts_on: dryv.field(sharedProperties.CalendarDate),
    ends_on: dryv.field(sharedProperties.CalendarDate),
    period_kind_id: ref(() => referenceSchemas.Value.field("id")),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_fiscal_periods_code", fields: ["code"], unique: true },
    { name: "idx_fiscal_periods_dates", fields: ["starts_on", "ends_on"] },
  ],
);
/*---------------- End finance.fiscal_periods ----------------*/
/*---------------- finance.budgets ----------------*/
table(
  "Budgets",
  {
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    government_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    fiscal_period_id: ref(() => financeSchemas.FiscalPeriods.field("id")),
    budget_kind_id: ref(() => referenceSchemas.Value.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_budgets_code", fields: ["code"], unique: true },
    { name: "idx_budgets_period", fields: ["fiscal_period_id"] },
  ],
);
/*---------------- End finance.budgets ----------------*/
/*---------------- finance.budget_versions ----------------*/
table(
  "BudgetVersions",
  {
    budget_id: ref(() => financeSchemas.Budgets.field("id")),
    version: dryv.field(sharedProperties.PositiveInteger),
    status_id: ref(() => referenceSchemas.Value.field("id")),
    released_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_budget_versions_budget_version", fields: ["budget_id", "version"], unique: true },
    { name: "idx_budget_versions_status", fields: ["status_id"] },
  ],
);
/*---------------- End finance.budget_versions ----------------*/
/*---------------- finance.appropriations ----------------*/
table(
  "Appropriations",
  {
    budget_version_id: ref(() => financeSchemas.BudgetVersions.field("id")),
    parent_appropriation_id: optRef(() => financeSchemas.Appropriations.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    recipient_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    project_id: optRef(() => civicSchemas.Projects.field("id")),
    unit_feature_id: optRef(() => geographySchemas.Units.field("feature_id")),
    classification_id: ref(() => referenceSchemas.Value.field("id")),
    ...money,
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "idx_appropriations_version", fields: ["budget_version_id"] },
    { name: "uq_appropriations_code", fields: ["code"], unique: true },
    { name: "idx_appropriations_parent", fields: ["parent_appropriation_id"] },
    { name: "idx_appropriations_project", fields: ["project_id"] },
    { name: "idx_appropriations_scope", fields: ["unit_feature_id"] },
  ],
);
/*---------------- End finance.appropriations ----------------*/
/*---------------- finance.funds ----------------*/
table(
  "Funds",
  {
    code: dryv.field(sharedProperties.IdentityCode),
    fund_kind_id: ref(() => referenceSchemas.Value.field("id")),
    managing_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    legal_basis_link_id: optRef(() => referenceLegalSchemas.LegalBasisLinks.field("id")),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_funds_code", fields: ["code"], unique: true },
    { name: "idx_funds_manager", fields: ["managing_entity_id"] },
  ],
);
/*---------------- End finance.funds ----------------*/
/*---------------- finance.flows ----------------*/
table(
  "Flows",
  {
    flow_kind_id: ref(() => referenceSchemas.Value.field("id")),
    fiscal_period_id: optRef(() => financeSchemas.FiscalPeriods.field("id")),
    fund_id: optRef(() => financeSchemas.Funds.field("id")),
    appropriation_id: optRef(() => financeSchemas.Appropriations.field("id")),
    contract_id: optRef(() => civicSchemas.Contracts.field("id")),
    debt_id: optRef(() => financeSchemas.Debts.field("id")),
    counterparty_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    ...money,
    occurred_on: dryv.field(sharedProperties.CalendarDate),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "idx_flows_date_kind", fields: ["occurred_on", "flow_kind_id"] },
    { name: "idx_flows_fiscal_period", fields: ["fiscal_period_id"] },
    { name: "idx_flows_fund", fields: ["fund_id"] },
    { name: "idx_flows_appropriation", fields: ["appropriation_id"] },
    { name: "idx_flows_contract", fields: ["contract_id"] },
    { name: "idx_flows_debt", fields: ["debt_id"] },
  ],
);
/*---------------- End finance.flows ----------------*/
/*---------------- finance.debts ----------------*/
table(
  "Debts",
  {
    borrower_entity_id: ref(() => officialSchemas.Entities.field("id")),
    lender_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    debt_kind_id: ref(() => referenceSchemas.Value.field("id")),
    ...money,
    contracted_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    maturity_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
    legal_basis_link_id: optRef(() => referenceLegalSchemas.LegalBasisLinks.field("id")),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "idx_debts_borrower", fields: ["borrower_entity_id"] },
    { name: "idx_debts_maturity", fields: ["maturity_on"] },
  ],
);
/*---------------- End finance.debts ----------------*/
