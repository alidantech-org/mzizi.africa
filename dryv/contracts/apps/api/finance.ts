/**
 * Module `finance`: a government's budgets by fiscal period, their appropriations, and audit findings.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { Appropriations, Budgets, finance, Findings, Periods, Revisions } from "#/schemas/postgres/finance.ts";
import { Currencies } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, MAX_PAGE, PageWindow } from "./_shared.ts";

const budgetsFeature = finance.feature("Budgets").failureDefaults(apiHttp);
const budget = Budgets.asRef();
const period = Periods.asRef();
const revision = Revisions.asRef();
const appropriation = Appropriations.asRef();
const finding = Findings.asRef();
const currency = Currencies.asRef();

const GovernmentBudgets = finance
  .schema("GovernmentBudgets", { governmentId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const RevisionLines = finance
  .schema("RevisionLines", { revisionId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const InstitutionFindings = finance
  .schema("InstitutionFindings", { institutionId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const q = budgetsFeature.queries({
  ScanBudgets: dryv.readQuery
    .from(budget)
    .input(GovernmentBudgets)
    .where((row, args) => [row.fields.governmentId.eq(args.governmentId)])
    .select((row) => ({
      budgetId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      periodId: row.fields.periodId,
      periodCode: row.follow(budget.fields.periodId, period).fields.code,
      startsOn: row.follow(budget.fields.periodId, period).fields.startsOn,
      endsOn: row.follow(budget.fields.periodId, period).fields.endsOn,
      revisions: row.reverse(revision.fields.budgetId, revision).select(
        (r) => ({
          revisionId: r.fields.id,
          revision: r.fields.revision,
          statusTerm: r.fields.statusTerm,
          releasedOn: r.fields.releasedOn,
        }),
        (r) => [r.fields.revision.order("asc"), r.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.code.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  ScanAppropriations: dryv.readQuery
    .from(appropriation)
    .input(RevisionLines)
    .where((row, args) => [row.fields.revisionId.eq(args.revisionId)])
    .select((row) => ({
      appropriationId: row.fields.id,
      code: row.fields.code,
      parentId: row.fields.parentId,
      recipientId: row.fields.recipientId,
      projectId: row.fields.projectId,
      featureId: row.fields.featureId,
      classTerm: row.fields.classTerm,
      amount: row.fields.amount,
      currencyCode: row.follow(appropriation.fields.currencyId, currency).fields.isoCode,
    }))
    .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 2000 })),
  ScanFindings: dryv.readQuery
    .from(finding)
    .input(InstitutionFindings)
    .where((row, args) => [row.fields.institutionId.eq(args.institutionId)])
    .select((row) => ({
      findingId: row.fields.id,
      code: row.fields.code,
      periodId: row.fields.periodId,
      kindTerm: row.fields.kindTerm,
      statusTerm: row.fields.statusTerm,
      amount: row.fields.amount,
      currencyCode: row.follow(finding.fields.currencyId, currency).fields.isoCode,
      contractId: row.fields.contractId,
      projectId: row.fields.projectId,
    }))
    .orderBy((row) => [row.fields.periodId.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const financeQueries = q;
const rows = finance.schemas({
  BudgetEntry: dryv.schema.fromQuery(q.ScanBudgets),
  AppropriationEntry: dryv.schema.fromQuery(q.ScanAppropriations),
  FindingEntry: dryv.schema.fromQuery(q.ScanFindings),
});
export const financeRows = rows;
const io = finance.schemas({
  BudgetCollection: dryv.schema({ budgets: dryv.field(rows.BudgetEntry).array() }),
  AppropriationCollection: dryv.schema({ appropriations: dryv.field(rows.AppropriationEntry).array() }),
  FindingCollection: dryv.schema({ findings: dryv.field(rows.FindingEntry).array() }),
});

export const financeOperations = budgetsFeature.operations({
  ListBudgets: dryv
    .operation()
    .role("list")
    .description("A government's budgets by fiscal period, each with its revisions.")
    .input(GovernmentBudgets)
    .output(io.BudgetCollection)
    .queryFromInput(q.ScanBudgets, { envelope: { budgets: "rows" } })
    .cache(CACHE.figures)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/finance/budgets").input(input, dryv.queryObject()).output(output),
    })),
  ListAppropriations: dryv
    .operation()
    .role("list")
    .description("The lines of one budget revision, in code order (the tree is given by parent ids).")
    .input(RevisionLines)
    .output(io.AppropriationCollection)
    .queryFromInput(q.ScanAppropriations, { envelope: { appropriations: "rows" } })
    .cache(CACHE.figures)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/finance/appropriations").input(input, dryv.queryObject()).output(output),
    })),
  ListFindings: dryv
    .operation()
    .role("list")
    .description("Audit findings about an institution.")
    .input(InstitutionFindings)
    .output(io.FindingCollection)
    .queryFromInput(q.ScanFindings, { envelope: { findings: "rows" } })
    .cache(CACHE.figures)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/finance/findings").input(input, dryv.queryObject()).output(output),
    })),
});
