/**
 * Schema: finance | Database: mzizi
 * Approved contract: fiscal periods, versioned budgets, appropriations, funds, flows and debt.
 * Monetary values are exact integer minor units paired with a Reference currency identity.
 * SQL generation remains gated on code-shape/CHECK enforcement and currency-scale policy.
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { Units } from "./geography.ts";
import { Entities } from "./official.ts";
import { Value, Country } from "./reference.ts";
import { Citations } from "./source.ts";
import { Projects, Contracts } from "./civic.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const finance = dryv
  .group({ name: "finance" })
  .description("Fiscal periods, budget releases and appropriations, funds, recorded flows and public debt.")
  .facets({ storage: { namespace: "finance" } });
/** Entity that records an amount in minor units of one currency. */
const MoneyEntity = finance
  .schema("MoneyEntity", {
    amountMinorUnits: dryv.field(sharedProperties.AmountMinorUnits),
    currencyId: belongsTo(() => Value),
  })
  .extends(baseSchemas.Entity)
  .abstract()
  .description("Base for records that carry an amount in minor units and its currency.");
/*---------------- finance.fiscal_periods ----------------*/
export const FiscalPeriods = finance
  .schema("FiscalPeriods", {
    countryId: belongsTo(() => Country).maybe(),
    startsOn: dryv.field(sharedProperties.CalendarDate),
    endsOn: dryv.field(sharedProperties.CalendarDate),
    periodKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One fiscal reporting period for a country, with explicit date bounds and source citation.")
  .role("entity")
  .facets({ storage: dryv.storage("fiscal_periods").index("startsOn", "endsOn").index("sourceCitationId") });

/*---------------- finance.budgets ----------------*/
export const Budgets = finance
  .schema("Budgets", {
    countryId: belongsTo(() => Country).maybe(),
    governmentEntityId: belongsTo(() => Entities).maybe(),
    fiscalPeriodId: belongsTo(() => FiscalPeriods),
    budgetKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One institutional/country budget identity for a fiscal period and budget classification.")
  .role("entity")
  .facets({ storage: dryv.storage("budgets").index("fiscalPeriodId").index("sourceCitationId") });

/*---------------- finance.budget_versions ----------------*/
export const BudgetVersions = finance
  .schema("BudgetVersions", {
    budgetId: belongsTo(() => Budgets),
    revision: dryv.field(sharedProperties.PositiveInteger),
    statusId: belongsTo(() => Value),
    releasedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One ordered release or revision of a budget, preserving original and supplementary versions separately.")
  .role("entity")
  .facets({ storage: dryv.storage("budget_versions").unique("budgetId", "revision").index("statusId").index("sourceCitationId") });

/*---------------- finance.appropriations ----------------*/
export const Appropriations = finance
  .schema("Appropriations", {
    budgetVersionId: belongsTo(() => BudgetVersions),
    parentAppropriationId: belongsTo(dryv.self).maybe(),
    recipientEntityId: belongsTo(() => Entities).maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    unitFeatureId: belongsTo(() => Units, { to: "featureId" }).maybe(),
    classificationId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One classified amount authorized in a budget version, optionally nested and assigned to a project or unit.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("appropriations")
      .index("budgetVersionId")
      .index("parentAppropriationId")
      .index("projectId")
      .index("unitFeatureId")
      .index("sourceCitationId"),
  });

/*---------------- finance.funds ----------------*/
export const Funds = finance
  .schema("Funds", {
    fundKindId: belongsTo(() => Value),
    managingEntityId: belongsTo(() => Entities).maybe(),
    countryId: belongsTo(() => Country).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One named public fund with a classification, manager and country.")
  .role("entity")
  .facets({ storage: dryv.storage("funds").index("managingEntityId").index("sourceCitationId") });

/*---------------- finance.flows ----------------*/
export const Flows = finance
  .schema("Flows", {
    flowKindId: belongsTo(() => Value),
    fiscalPeriodId: belongsTo(() => FiscalPeriods).maybe(),
    fundId: belongsTo(() => Funds).maybe(),
    appropriationId: belongsTo(() => Appropriations).maybe(),
    contractId: belongsTo(() => Contracts).maybe(),
    debtId: belongsTo(() => Debts).maybe(),
    counterpartyEntityId: belongsTo(() => Entities).maybe(),
    occurredOn: dryv.field(sharedProperties.CalendarDate),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(MoneyEntity)
  .description("One reported financial flow at its source transaction grain, not a rolled-up aggregate.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("flows")
      .index("occurredOn", "flowKindId")
      .index("fiscalPeriodId")
      .index("fundId")
      .index("appropriationId")
      .index("contractId")
      .index("debtId")
      .index("sourceCitationId"),
  });

/*---------------- finance.debts ----------------*/
export const Debts = finance
  .schema("Debts", {
    borrowerEntityId: belongsTo(() => Entities),
    lenderEntityId: belongsTo(() => Entities).maybe(),
    countryId: belongsTo(() => Country).maybe(),
    debtKindId: belongsTo(() => Value),
    contractedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    maturityOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(MoneyEntity)
  .description("One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts.")
  .role("entity")
  .facets({ storage: dryv.storage("debts").index("borrowerEntityId").index("maturityOn").index("sourceCitationId") });
