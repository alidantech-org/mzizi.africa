import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../../foundation/reference/index.ts";
import { recorded, optionalId, plainId, relationTo, searchable } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Entities, public finance, debt and procurement.
 *
 * Legal identity is neutral: registration numbers and tax identifiers are jurisdiction-scoped
 * identifier records with an issuing authority. Every monetary value carries an explicit currency
 * code and no default. Fiscal workflow stages, revenue categories, transfer types, procurement
 * methods and entity types are classification ids. Ledger entries reference their source record by
 * kind and id so spend can be traced from budget through commitment, payment and contract.
 */
export const entities = dryv.group({ name: "entities" }).description("Legal entities, identifiers and ownership.").tags("public", "entities")
  .facets({ storage: { namespace: "organization" } });
export const finance = dryv.group({ name: "finance" }).description("Fiscal years, budgets, transfers, revenue, expenditure and the ledger.").tags("public", "finance")
  .facets({ storage: { namespace: "finance" } });
export const debt = dryv.group({ name: "debt" }).description("Loans, disbursements and repayments.").tags("public", "debt")
  .facets({ storage: { namespace: "debt" } });
export const procurement = dryv.group({ name: "procurement" }).description("Tenders, bids, contracts, milestones and variations.").tags("public", "procurement")
  .facets({ storage: { namespace: "procurement" } });

export const entityProperties = entities.properties({
  EntityStatus: dryv.property.enum({ active: "active", dormant: "dormant", dissolved: "dissolved", unknown: "unknown" }),
  OwnershipPercentage: dryv.property.number.decimal({ precision: 7, scale: 4 }),
  IdentifierValue: dryv.property.string().length({ min: 1, max: 200 }),
  AddressText: dryv.property.string().length({ min: 1, max: 500 }),
});

export const financeProperties = finance.properties({
  BudgetKind: dryv.property.enum({ original: "original", supplementary: "supplementary", revised: "revised" }),
  FundRestriction: dryv.property.enum({ general: "general", earmarked: "earmarked" }),
  TransferStatus: dryv.property.enum({ planned: "planned", approved: "approved", disbursed: "disbursed", cancelled: "cancelled" }),
  LedgerReferenceKind: dryv.property.enum({
    transfer: "transfer",
    revenue: "revenue",
    expenditure: "expenditure",
    loanDisbursement: "loan_disbursement",
    loanRepayment: "loan_repayment",
    other: "other",
  }),
  AccountCode: dryv.property.string().length({ min: 1, max: 100 }),
  ProgramCode: dryv.property.string().length({ min: 1, max: 100 }),
});

export const debtProperties = debt.properties({
  LoanStatus: dryv.property.enum({ proposed: "proposed", active: "active", repaid: "repaid", defaulted: "defaulted", cancelled: "cancelled" }),
  TermMonths: dryv.property.number.integer({ range: { min: 0 } }),
});

export const procurementProperties = procurement.properties({
  TenderStatus: dryv.property.enum({ published: "published", open: "open", closed: "closed", evaluated: "evaluated", awarded: "awarded", cancelled: "cancelled" }),
  BidStatus: dryv.property.enum({
    submitted: "submitted",
    underEvaluation: "under_evaluation",
    qualified: "qualified",
    disqualified: "disqualified",
    withdrawn: "withdrawn",
    winning: "winning",
    rejected: "rejected",
  }),
  ContractStatus: dryv.property.enum({ pending: "pending", active: "active", completed: "completed", terminated: "terminated", suspended: "suspended", expired: "expired" }),
});

const amount = () => dryv.field(sharedProperties.Amount);
const currency = () => dryv.field(sharedProperties.CurrencyCode);
const id = () => dryv.field(sharedProperties.Id).optional();
const q = () => dryv.field(sharedProperties.Name).optional();

/* ---------------------------------- Entities ----------------------------------- */

const legalEntities = entities.schemas({
  LegalEntity: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      officialName: dryv.field(sharedProperties.Name).query(searchable),
      entityTypeId: plainId(),
      parentEntityId: optionalId(),
      status: dryv.field(entityProperties.EntityStatus).query({ filter: ["equal", "in"] }),
    },
    "entities",
    [{ name: "idx_legal_entity_code", fields: ["code"], unique: true }, { name: "idx_legal_entity_jurisdiction", fields: ["jurisdictionId"] }],
  ),
});

const entityDetails = entities.schemas({
  /** Registration numbers and tax identifiers: scheme and issuing authority are records, not columns. */
  EntityIdentifier: recorded(
    {
      entityId: relationTo(() => legalEntities.LegalEntity.field("id")),
      schemeId: plainId(),
      value: dryv.field(entityProperties.IdentifierValue).query({ filter: ["equal", "startsWith"], search: true }),
      issuingAuthorityId: optionalId(),
    },
    "identifiers",
    [{ name: "idx_entity_identifier_entity", fields: ["entityId"] }, { name: "idx_entity_identifier_value", fields: ["schemeId", "value"] }],
  ),

  EntityOwnership: recorded(
    {
      entityId: relationTo(() => legalEntities.LegalEntity.field("id")),
      ownerEntityId: optionalId(),
      ownerPersonId: optionalId(),
      percentage: dryv.field(entityProperties.OwnershipPercentage).optional().nullable(),
      position: dryv.field(sharedProperties.Label).optional().nullable(),
    },
    "ownerships",
    [{ name: "idx_entity_ownership_entity", fields: ["entityId"] }],
  ),
});

/* ----------------------------------- Finance ----------------------------------- */

const fiscalYears = finance.schemas({
  FiscalYear: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      startsOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
      endsOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
    },
    "years",
    [{ name: "idx_fiscal_year_code", fields: ["code"], unique: true }],
  ),

  BudgetaryUnit: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      levelId: plainId(),
      parentUnitId: optionalId(),
      institutionId: optionalId(),
      legalEntityId: optionalId(),
      geoUnitId: optionalId(),
      partyId: optionalId(),
    },
    "units",
    [{ name: "idx_budgetary_unit_code", fields: ["code"], unique: true }, { name: "idx_budgetary_unit_party", fields: ["partyId"] }],
  ),
});

const budgets = finance.schemas({
  Budget: recorded(
    {
      unitId: relationTo(() => fiscalYears.BudgetaryUnit.field("id")),
      fiscalYearId: plainId(),
      programCode: dryv.field(financeProperties.ProgramCode).optional().nullable().query({ filter: ["equal"] }),
      kind: dryv.field(financeProperties.BudgetKind).query({ filter: ["equal"] }),
      approvedAmount: amount().query({ filter: ["between"], sort: true }),
      currencyCode: currency(),
      legalBasisId: optionalId(),
    },
    "budgets",
    [{ name: "idx_budget_unit_year", fields: ["unitId", "fiscalYearId"] }],
  ),
});

const flows = finance.schemas({
  Transfer: recorded(
    {
      fromUnitId: relationTo(() => fiscalYears.BudgetaryUnit.field("id")),
      toUnitId: plainId(),
      fiscalYearId: plainId(),
      transferTypeId: plainId(),
      amount: amount().query({ filter: ["between"], sort: true }),
      currencyCode: currency(),
      restriction: dryv.field(financeProperties.FundRestriction).query({ filter: ["equal"] }),
      status: dryv.field(financeProperties.TransferStatus).query({ filter: ["equal", "in"] }),
      legalBasisId: optionalId(),
    },
    "transfers",
    [{ name: "idx_transfer_from", fields: ["fromUnitId", "fiscalYearId"] }, { name: "idx_transfer_to", fields: ["toUnitId"] }],
  ),

  RevenueRecord: recorded(
    {
      unitId: relationTo(() => fiscalYears.BudgetaryUnit.field("id")),
      fiscalYearId: plainId(),
      categoryId: plainId(),
      payerEntityId: optionalId(),
      amount: amount().query({ filter: ["between"], sort: true }),
      currencyCode: currency(),
      restriction: dryv.field(financeProperties.FundRestriction).query({ filter: ["equal"] }),
      receivedOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
    },
    "revenues",
    [{ name: "idx_revenue_unit_year", fields: ["unitId", "fiscalYearId"] }],
  ),

  Expenditure: recorded(
    {
      budgetId: relationTo(() => budgets.Budget.field("id")),
      unitId: plainId(),
      stageId: plainId(),
      stageOrder: dryv.field(sharedProperties.Count).query({ sort: true }),
      amount: amount().query({ filter: ["between"], sort: true }),
      currencyCode: currency(),
      approverPersonId: optionalId(),
      contractId: optionalId(),
    },
    "expenditures",
    [{ name: "idx_expenditure_budget", fields: ["budgetId", "stageOrder"] }],
  ),

  LedgerEntry: recorded(
    {
      unitId: relationTo(() => fiscalYears.BudgetaryUnit.field("id")),
      accountCode: dryv.field(financeProperties.AccountCode).query({ filter: ["equal", "startsWith"] }),
      debitAmount: amount().query({ filter: ["between"] }),
      creditAmount: amount().query({ filter: ["between"] }),
      currencyCode: currency(),
      referenceKind: dryv.field(financeProperties.LedgerReferenceKind).query({ filter: ["equal"] }),
      referenceId: optionalId(),
      postedOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
    },
    "entries",
    [{ name: "idx_ledger_unit", fields: ["unitId", "postedOn"] }, { name: "idx_ledger_reference", fields: ["referenceKind", "referenceId"] }],
  ),
});

/* ------------------------------------- Debt ------------------------------------ */

const loans = debt.schemas({
  Loan: recorded(
    {
      borrowerUnitId: plainId(),
      lenderEntityId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      principalAmount: amount().query({ filter: ["between"], sort: true }),
      currencyCode: currency(),
      interestRate: dryv.field(sharedProperties.Rate).optional().nullable(),
      termMonths: dryv.field(debtProperties.TermMonths).optional().nullable(),
      status: dryv.field(debtProperties.LoanStatus).query({ filter: ["equal", "in"] }),
      legalBasisId: optionalId(),
    },
    "loans",
    [{ name: "idx_loan_code", fields: ["code"], unique: true }, { name: "idx_loan_borrower", fields: ["borrowerUnitId"] }],
  ),
});

const loanFlows = debt.schemas({
  LoanDisbursement: recorded(
    {
      loanId: relationTo(() => loans.Loan.field("id")),
      ledgerEntryId: optionalId(),
      amount: amount().query({ filter: ["between"] }),
      currencyCode: currency(),
      disbursedOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
    },
    "disbursements",
    [{ name: "idx_loan_disbursement_loan", fields: ["loanId"] }],
  ),

  LoanRepayment: recorded(
    {
      loanId: relationTo(() => loans.Loan.field("id")),
      ledgerEntryId: optionalId(),
      principalPaid: amount(),
      interestPaid: amount(),
      feesPaid: amount().optional().nullable(),
      currencyCode: currency(),
      paidOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
    },
    "repayments",
    [{ name: "idx_loan_repayment_loan", fields: ["loanId"] }],
  ),
});

/* ---------------------------------- Procurement -------------------------------- */

const tenders = procurement.schemas({
  Tender: recorded(
    {
      issuingUnitId: plainId(),
      code: dryv.field(sharedProperties.LongCode).query(searchable),
      /** A later release of the same tender is a new version; the newest release by publication date is current. */
      versionNumber: dryv.field(sharedProperties.Version),
      title: dryv.field(sharedProperties.Name).query(searchable),
      kindId: plainId(),
      methodId: plainId(),
      estimatedValue: amount().optional().nullable().query({ filter: ["between"] }),
      currencyCode: currency(),
      publishedOn: dryv.field(sharedProperties.Date).optional().nullable().query({ filter: ["between"], sort: true }),
      closesOn: dryv.field(sharedProperties.Date).optional().nullable(),
      status: dryv.field(procurementProperties.TenderStatus).query({ filter: ["equal", "in"] }),
      procuringOfficeId: optionalId(),
      budgetId: optionalId(),
      legalBasisId: optionalId(),
    },
    "tenders",
    [{ name: "idx_tender_code", fields: ["code"] }, { name: "uq_tender_code_version", fields: ["code", "versionNumber"], unique: true }, { name: "idx_tender_issuer", fields: ["issuingUnitId", "status"] }],
  ),
});

const bidsAndContracts = procurement.schemas({
  Bid: recorded(
    {
      tenderId: relationTo(() => tenders.Tender.field("id")),
      bidderEntityId: plainId(),
      amount: amount().query({ filter: ["between"], sort: true }),
      currencyCode: currency(),
      submittedOn: dryv.field(sharedProperties.Date).query({ filter: ["between"] }),
      status: dryv.field(procurementProperties.BidStatus).query({ filter: ["equal", "in"] }),
      isCompliant: dryv.field(sharedProperties.Flag).optional().nullable(),
      evaluationNote: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "bids",
    [{ name: "idx_bid_tender", fields: ["tenderId"] }],
  ),

  ProcurementContract: recorded(
    {
      tenderId: relationTo(() => tenders.Tender.field("id")),
      awardedEntityId: plainId(),
      contractingUnitId: plainId(),
      contractingOfficeId: optionalId(),
      code: dryv.field(sharedProperties.LongCode).query(searchable),
      value: amount().query({ filter: ["between"], sort: true }),
      currencyCode: currency(),
      awardedOn: dryv.field(sharedProperties.Date).optional().nullable(),
      status: dryv.field(procurementProperties.ContractStatus).query({ filter: ["equal", "in"] }),
    },
    "contracts",
    [{ name: "idx_contract_code", fields: ["code"], unique: true }, { name: "idx_contract_tender", fields: ["tenderId"] }],
  ),
});

const contractDetails = procurement.schemas({
  ContractMilestone: recorded(
    {
      contractId: relationTo(() => bidsAndContracts.ProcurementContract.field("id")),
      title: dryv.field(sharedProperties.Name),
      dueOn: dryv.field(sharedProperties.Date).optional().nullable(),
      completedOn: dryv.field(sharedProperties.Date).optional().nullable(),
      amount: amount().optional().nullable(),
      currencyCode: currency().optional().nullable(),
    },
    "milestones",
    [{ name: "idx_milestone_contract", fields: ["contractId"] }],
  ),

  ContractVariation: recorded(
    {
      contractId: relationTo(() => bidsAndContracts.ProcurementContract.field("id")),
      amountChange: amount(),
      currencyCode: currency(),
      reason: dryv.field(sharedProperties.Description),
      approvedOn: dryv.field(sharedProperties.Date).optional().nullable(),
    },
    "variations",
    [{ name: "idx_variation_contract", fields: ["contractId"] }],
  ),
});

/* ------------------------------------ Reads ------------------------------------ */

function register(group: any, feature: string, description: string, specs: Parameters<typeof readSurface>[1][]) {
  const surfaces = specs.map((spec) => readSurface(group, spec));
  return group.feature(feature).description(description).tags("public").operations(Object.assign({}, ...surfaces.map((surface) => surface.operations)));
}

export const entitiesReadOperations = register(entities, "EntitiesRead", "Public read access to legal entities, identifiers and ownership.", [
  { singular: "LegalEntity", plural: "LegalEntities", itemKey: "entity", listKey: "entities", path: "/entities/legal-entities", idParam: "entityId", entity: legalEntities.LegalEntity, description: "legal entities", filters: { jurisdictionId: id(), status: dryv.field(entityProperties.EntityStatus).optional(), q: q() } },
  { singular: "EntityIdentifier", plural: "EntityIdentifiers", itemKey: "identifier", listKey: "identifiers", path: "/entities/identifiers", idParam: "identifierId", entity: entityDetails.EntityIdentifier, description: "entity identifiers", filters: { entityId: id(), schemeId: id() } },
  { singular: "EntityOwnership", plural: "EntityOwnerships", itemKey: "ownership", listKey: "ownerships", path: "/entities/ownerships", idParam: "ownershipId", entity: entityDetails.EntityOwnership, description: "entity ownerships", filters: { entityId: id(), ownerPersonId: id(), ownerEntityId: id() } },
]);

export const financeReadOperations = register(finance, "FinanceRead", "Public read access to fiscal years, budgets, transfers, revenue, expenditure and the ledger.", [
  { singular: "FiscalYear", plural: "FiscalYears", itemKey: "fiscalYear", listKey: "fiscalYears", path: "/finance/fiscal-years", idParam: "fiscalYearId", entity: fiscalYears.FiscalYear, description: "fiscal years", filters: { jurisdictionId: id() } },
  { singular: "BudgetaryUnit", plural: "BudgetaryUnits", itemKey: "unit", listKey: "units", path: "/finance/units", idParam: "unitId", entity: fiscalYears.BudgetaryUnit, description: "budgetary units", filters: { jurisdictionId: id(), parentUnitId: id(), q: q() } },
  { singular: "Budget", plural: "Budgets", itemKey: "budget", listKey: "budgets", path: "/finance/budgets", idParam: "budgetId", entity: budgets.Budget, description: "budgets", filters: { unitId: id(), fiscalYearId: id() } },
  { singular: "Transfer", plural: "Transfers", itemKey: "transfer", listKey: "transfers", path: "/finance/transfers", idParam: "transferId", entity: flows.Transfer, description: "transfers", filters: { fromUnitId: id(), toUnitId: id(), fiscalYearId: id() } },
  { singular: "RevenueRecord", plural: "RevenueRecords", itemKey: "revenue", listKey: "revenues", path: "/finance/revenue", idParam: "revenueId", entity: flows.RevenueRecord, description: "revenue records", filters: { unitId: id(), fiscalYearId: id(), categoryId: id() } },
  { singular: "Expenditure", plural: "Expenditures", itemKey: "expenditure", listKey: "expenditures", path: "/finance/expenditures", idParam: "expenditureId", entity: flows.Expenditure, description: "expenditures", filters: { budgetId: id(), unitId: id(), stageId: id() } },
  { singular: "LedgerEntry", plural: "LedgerEntries", itemKey: "entry", listKey: "entries", path: "/finance/ledger-entries", idParam: "entryId", entity: flows.LedgerEntry, description: "ledger entries", filters: { unitId: id(), referenceId: id() } },
]);

export const debtReadOperations = register(debt, "DebtRead", "Public read access to loans, disbursements and repayments.", [
  { singular: "Loan", plural: "Loans", itemKey: "loan", listKey: "loans", path: "/debt/loans", idParam: "loanId", entity: loans.Loan, description: "loans", filters: { borrowerUnitId: id(), lenderEntityId: id(), status: dryv.field(debtProperties.LoanStatus).optional() } },
  { singular: "LoanDisbursement", plural: "LoanDisbursements", itemKey: "disbursement", listKey: "disbursements", path: "/debt/disbursements", idParam: "disbursementId", entity: loanFlows.LoanDisbursement, description: "loan disbursements", filters: { loanId: id() } },
  { singular: "LoanRepayment", plural: "LoanRepayments", itemKey: "repayment", listKey: "repayments", path: "/debt/repayments", idParam: "repaymentId", entity: loanFlows.LoanRepayment, description: "loan repayments", filters: { loanId: id() } },
]);

export const procurementReadOperations = register(procurement, "ProcurementRead", "Public read access to tenders, bids, contracts, milestones and variations.", [
  { singular: "Tender", plural: "Tenders", itemKey: "tender", listKey: "tenders", path: "/procurement/tenders", idParam: "tenderId", entity: tenders.Tender, description: "tenders", filters: { issuingUnitId: id(), status: dryv.field(procurementProperties.TenderStatus).optional(), q: q() } },
  { singular: "Bid", plural: "Bids", itemKey: "bid", listKey: "bids", path: "/procurement/bids", idParam: "bidId", entity: bidsAndContracts.Bid, description: "bids", filters: { tenderId: id(), bidderEntityId: id() } },
  { singular: "ProcurementContract", plural: "ProcurementContracts", itemKey: "contract", listKey: "contracts", path: "/procurement/contracts", idParam: "contractId", entity: bidsAndContracts.ProcurementContract, description: "contracts", filters: { tenderId: id(), awardedEntityId: id(), contractingUnitId: id() } },
  { singular: "ContractMilestone", plural: "ContractMilestones", itemKey: "milestone", listKey: "milestones", path: "/procurement/milestones", idParam: "milestoneId", entity: contractDetails.ContractMilestone, description: "contract milestones", filters: { contractId: id() } },
  { singular: "ContractVariation", plural: "ContractVariations", itemKey: "variation", listKey: "variations", path: "/procurement/variations", idParam: "variationId", entity: contractDetails.ContractVariation, description: "contract variations", filters: { contractId: id() } },
]);
