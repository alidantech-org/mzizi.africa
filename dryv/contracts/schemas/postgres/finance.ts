/**
 * Schema: finance | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md section 30.9 (approved 2026-11-25).
 * Contract authors: money is whole minor units plus `currency_id`. `flows` is hash-partitioned by `country_id`.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { belongsTo, byCountry, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Contracts, Projects } from "./civic.ts";
import { Features } from "./geography.ts";
import { Institutions, Jurisdictions } from "./governance.ts";
import { Countries, Currencies } from "./reference.ts";

export const finance = dryv
  .group({ name: "finance" })
  .description(
    "Public money: fiscal periods, budgets and revisions, appropriations, funds, flows, debts and audit findings.",
  )
  .facets({ storage: { namespace: "finance", store: "main" } });

const money = (meaning: string) => ({
  amount: dryv
    .field(sharedProperties.AmountMinorUnits)
    .maybe()
    .description(`${meaning}, in whole minor units of \`currency_id\`.`),
  currencyId: belongsTo(() => Currencies).maybe(),
});

/*---------------- finance.periods ----------------*/
export const Periods = finance
  .schema("Periods", {
    countryId: belongsTo(() => Countries),
    kindTerm: term("fin.period.kind", "fiscal year, quarter, month."),
    ...periodFields,
    startsOn: dryv.field(sharedProperties.CalendarDate),
    endsOn: dryv.field(sharedProperties.CalendarDate),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("PeriodDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description("A fiscal period of a country (FY 2023/24).")
  .role("entity")
  .facets({ storage: dryv.storage("periods").unique("countryId", "kindTerm", "startsOn") });

/*---------------- finance.budgets ----------------*/
export const Budgets = finance
  .schema("Budgets", {
    governmentId: belongsTo(() => Institutions).description("The government whose budget it is (national or a county)."),
    countryId: belongsTo(() => Countries),
    periodId: belongsTo(() => Periods),
    kindTerm: term("fin.budget.kind", "recurrent, development, consolidated."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A government's budget for a fiscal period.")
  .role("entity")
  .facets({
    storage: dryv.storage("budgets").unique("governmentId", "periodId", "kindTerm").index("countryId", "periodId"),
  });

/*---------------- finance.revisions ----------------*/
export const Revisions = finance
  .schema("Revisions", {
    budgetId: belongsTo(() => Budgets, { onDelete: "cascade" }),
    revision: dryv
      .field(sharedProperties.PositiveInteger)
      .description("1 for the original budget, rising with supplementaries."),
    statusTerm: term("fin.revision.status", "proposed, approved, enacted."),
    releasedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("The original or a supplementary version of a budget.")
  .role("entity")
  .facets({ storage: dryv.storage("revisions").unique("budgetId", "revision") });

/*---------------- finance.appropriations ----------------*/
export const Appropriations = finance
  .schema("Appropriations", {
    revisionId: belongsTo(() => Revisions, { onDelete: "cascade" }),
    parentId: belongsTo(dryv.self).maybe().description("The broader vote or programme line."),
    recipientId: identity("The institution or body the money is voted to.").maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    featureId: belongsTo(() => Features).maybe(),
    classTerm: term("fin.classification", "The budget classification of the line (programme, economic item)."),
    ...money("Amount appropriated"),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("AppropriationIsNotItsOwnParent", rule.differs("id", "parentId"))
  .rule("AppropriationAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .description("A line of a budget revision: money voted to a recipient, programme, project or place.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("appropriations")
      .index("revisionId", "parentId")
      .index("recipientId")
      .index("projectId")
      .acyclic("AppropriationParentsHaveNoCycle", { field: "parentId" }),
  });

/*---------------- finance.funds ----------------*/
export const Funds = finance
  .schema("Funds", {
    identityKind: identityKindField("fund"),
    kindTerm: term("fin.fund.kind", "equalisation fund, constituency fund, donor fund."),
    managerId: identity("Who manages the fund.").maybe(),
    sourceTerm: term("fin.fund.source", "exchequer, donor, levy.").maybe(),
    countryId: belongsTo(() => Countries),
    scopeId: belongsTo(() => Jurisdictions).maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("FundKind", (v) => v.identityKind.eq("fund"))
  .description("A public fund (NG-CDF).")
  .role("entity")
  .facets({ storage: dryv.storage("funds").index("countryId", "kindTerm").references("FundIsIdentity", identityReference) });

/*---------------- finance.debts ----------------*/
export const Debts = finance
  .schema("Debts", {
    identityKind: identityKindField("debt"),
    borrowerId: identity("The borrowing government or body."),
    lenderId: identity("The lender."),
    countryId: belongsTo(() => Countries),
    kindTerm: term("fin.debt.kind", "bilateral loan, multilateral loan, bond, commercial loan."),
    contractedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    maturityOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...money("Principal"),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("DebtKind", (v) => v.identityKind.eq("debt"))
  .rule("DebtAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .description("A public debt (a loan or bond).")
  .role("entity")
  .facets({
    storage: dryv
      .storage("debts")
      .index("countryId")
      .index("borrowerId")
      .index("lenderId")
      .references("DebtIsIdentity", identityReference),
  });

/*---------------- finance.flows ----------------*/
export const Flows = finance
  .schema("Flows", {
    kindTerm: term("fin.flow.kind", "allocation, transfer, disbursement, payment, receipt."),
    periodId: belongsTo(() => Periods).maybe(),
    fundId: belongsTo(() => Funds).maybe(),
    appropriationId: belongsTo(() => Appropriations).maybe(),
    contractId: belongsTo(() => Contracts).maybe(),
    debtId: belongsTo(() => Debts).maybe(),
    counterpartyId: identity("Who paid or was paid.").maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    institutionId: belongsTo(() => Institutions).maybe(),
    featureId: belongsTo(() => Features).maybe(),
    classTerm: term("fin.classification", "Budget classification of the flow.").maybe(),
    occurredOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    ...money("Amount moved"),
    countryId: belongsTo(() => Countries).description("Partition key."),
  })
  .extends(baseSchemas.PartitionedEntity)
  .rule("FlowAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .description("A movement of public money: allocation, transfer, disbursement, payment or receipt.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("flows")
      .partitioning(byCountry("flows"))
      .primaryKey("id", "countryId")
      .index("countryId", "periodId")
      .index("countryId", "institutionId")
      .index("appropriationId")
      .index("contractId")
      .index("projectId"),
  });

/*---------------- finance.findings ----------------*/
export const Findings = finance
  .schema("Findings", {
    institutionId: belongsTo(() => Institutions).description("The audited institution."),
    periodId: belongsTo(() => Periods),
    kindTerm: term("fin.finding.kind", "unsupported expenditure, irregular procurement, pending bills."),
    ...money("Questioned amount"),
    statusTerm: term("fin.finding.status", "open, resolved or referred."),
    contractId: belongsTo(() => Contracts).maybe(),
    projectId: belongsTo(() => Projects).maybe(),
    flowId: dryv.field(sharedProperties.Id).maybe().description("The flow questioned, with `flow_country_id`."),
    flowCountryId: belongsTo(() => Countries).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("FindingAmountHasCurrency", (v) => v.amount.isNull().or(v.currencyId.isNotNull()))
  .rule("FindingFlowHasCountry", (v) => v.flowId.isNull().or(v.flowCountryId.isNotNull()))
  .description("An audit finding about an institution in a fiscal period.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("findings")
      .index("institutionId", "periodId")
      .index("contractId")
      .references("FindingOfFlow", {
        fields: ["flowId", "flowCountryId"],
        target: () => Flows,
        targetFields: ["id", "countryId"],
      }),
  });
