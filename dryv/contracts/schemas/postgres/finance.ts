/**
 * Schema: finance | Database: mzizi
 * Approved contract: fiscal periods, versioned budgets, appropriations, funds, flows and debt.
 * Monetary values are exact integer minor units paired with a Reference currency identity.
 * SQL generation remains gated on code-shape/CHECK enforcement and currency-scale policy.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Contracts, Projects } from "./civic.ts";
import { Features } from "./geography.ts";
import { Institutions } from "./governance.ts";
import { Entities, Individuals } from "./official.ts";
import { Country, Value } from "./reference.ts";
import { Citations } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const finance = dryv
  .group({ name: "finance" })
  .description("Fiscal periods, budget releases and appropriations, funds, recorded flows and public debt.")
  .facets({ storage: { namespace: "finance", store: "main" } });
/** Entity that records an amount in minor units of one currency. */
const MoneyEntity = finance
  .schema("MoneyEntity", {
    amountMinorUnits: dryv.field(sharedProperties.AmountMinorUnits),
    currencyId: belongsTo(() => Value),
  })
  .extends(baseSchemas.CodedEntity)
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
  .facets({
    storage: dryv.storage("budget_versions").unique("budgetId", "revision").index("statusId").index("sourceCitationId"),
  });

/*---------------- finance.appropriations ----------------*/
export const Appropriations = finance
  .schema("Appropriations", {
    budgetVersionId: belongsTo(() => BudgetVersions),
    parentAppropriationId: belongsTo(dryv.self).maybe(),
    recipientEntityId: belongsTo(() => Entities).maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    unitFeatureId: belongsTo(() => Features).maybe(),
    classificationId: belongsTo(() => Value),
    // Same two fields as MoneyEntity; this schema is coded, and a schema inherits from one base only.
    amountMinorUnits: dryv.field(sharedProperties.AmountMinorUnits),
    currencyId: belongsTo(() => Value),
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
    /** Scheme fin.fund.source: exchequer, devolved transfer, donor or grant, loan, own revenue. Who the money comes from. */
    fundingSourceId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.fin.fund.source"),
    countryId: belongsTo(() => Country).maybe(),
    /** The area the fund serves, for example the constituency of a constituency development fund. */
    scopeUnitFeatureId: belongsTo(() => Features).maybe(),
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
    /** The counterparty when it is a person (a payee who is not an organisation). At most one counterparty is set. */
    counterpartyIndividualId: belongsTo(() => Individuals).maybe(),
    /** The project this money was allocated to or spent on. */
    projectId: belongsTo(() => Projects).maybe(),
    /** The body that allocated or spent it, for example a constituency fund committee. */
    institutionId: belongsTo(() => Institutions).maybe(),
    /** The area it was spent for. */
    scopeUnitFeatureId: belongsTo(() => Features).maybe(),
    /** Scheme fin.expenditure.class: salaries, running costs, committee, bursary, emergency, capacity building, project. */
    expenditureClassId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.fin.expenditure.class"),
    occurredOn: dryv.field(sharedProperties.CalendarDate),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(MoneyEntity)
  .rule("AtMostOneCounterparty", rule.atMostOne("counterpartyEntityId", "counterpartyIndividualId"))
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
      .index("counterpartyEntityId")
      .index("counterpartyIndividualId")
      .index("debtId")
      .index("projectId")
      .index("institutionId")
      .index("scopeUnitFeatureId")
      .index("expenditureClassId")
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
  .description(
    "One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("debts").index("borrowerEntityId").index("maturityOn").index("sourceCitationId") });
