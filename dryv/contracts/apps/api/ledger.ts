/**
 * Ledger: the lists behind the finance, politics and data-coverage sections: budgets and their revisions, funds and the
 * money that moved through them, what is published and what is not (coverage), coalitions and manifestos. Every document
 * is a named, typed schema and says what is missing (`gaps`), so an empty section explains itself instead of staying blank.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { apiHttp } from "./_shared.ts";

export const ledger = dryv.group({ name: "ledger" }).description("Budgets, funds, coverage, coalitions and manifestos.");
const feature = ledger.feature("Ledger").failureDefaults(apiHttp);

const props = ledger.properties({
  Limit: dryv.property.number.integer({ range: { min: 1, max: 500 } }),
  Count: dryv.property.number.integer({ range: { min: 0, max: 100000000 } }),
});

const inputs = ledger.schemas({
  LedgerInput: dryv.schema({ limit: dryv.field(props.Limit).optional() }),
});

const shapes = ledger.schemas({
  Budget: dryv.schema({
    code: dryv.field(p.String),
    kind: dryv.field(p.String),
    entity: dryv.field(p.String).maybe(),
    fiscalFrom: dryv.field(p.String).maybe(),
    fiscalTo: dryv.field(p.String).maybe(),
    revisions: dryv.field(props.Count),
    latestReleasedOn: dryv.field(p.String).maybe(),
  }),
  Fund: dryv.schema({
    code: dryv.field(p.String),
    kind: dryv.field(p.String),
    source: dryv.field(p.String).maybe(),
    manager: dryv.field(p.String).maybe(),
    place: dryv.field(p.String).maybe(),
    featureId: dryv.field(p.Id).maybe(),
    /** The place's clean address, added by the API for every response that names a place. */
    path: dryv.field(p.String).maybe(),
    flows: dryv.field(props.Count),
  }),
  CoverageItem: dryv.schema({
    code: dryv.field(p.String),
    subject: dryv.field(p.String),
    level: dryv.field(p.String).maybe(),
    source: dryv.field(p.String).maybe(),
    note: dryv.field(p.String).maybe(),
    checkedOn: dryv.field(p.String).maybe(),
    expectedAt: dryv.field(p.String).maybe(),
  }),
  Coalition: dryv.schema({
    code: dryv.field(p.String),
    name: dryv.field(p.String),
    kind: dryv.field(p.String),
    formedOn: dryv.field(p.String).maybe(),
    dissolvedOn: dryv.field(p.String).maybe(),
  }),
  Manifesto: dryv.schema({
    code: dryv.field(p.String),
    party: dryv.field(p.String).maybe(),
    election: dryv.field(p.String).maybe(),
    publishedOn: dryv.field(p.String).maybe(),
  }),
});

const documents = ledger.schemas({
  BudgetList: dryv.schema({ budgets: dryv.field(shapes.Budget).array(), gaps: dryv.field(p.NonEmptyString500).array() }),
  FundList: dryv.schema({
    funds: dryv.field(shapes.Fund).array(),
    total: dryv.field(props.Count),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  CoverageList: dryv.schema({
    items: dryv.field(shapes.CoverageItem).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  CoalitionList: dryv.schema({
    coalitions: dryv.field(shapes.Coalition).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
  ManifestoList: dryv.schema({
    manifestos: dryv.field(shapes.Manifesto).array(),
    gaps: dryv.field(p.NonEmptyString500).array(),
  }),
});

export const ledgerOperations = feature.operations({
  ListBudgets: dryv
    .operation()
    .role("list")
    .description("Budgets by fiscal year with their revisions, newest first.")
    .input(inputs.LedgerInput)
    .output(documents.BudgetList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/budgets").input(input, dryv.queryObject()).output(output),
    })),

  ListFunds: dryv
    .operation()
    .role("list")
    .description("Funds with who manages them, where they apply and how many money flows are recorded.")
    .input(inputs.LedgerInput)
    .output(documents.FundList)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/funds").input(input, dryv.queryObject()).output(output),
    })),

  GetCoverage: dryv
    .operation()
    .role("list")
    .description("What the platform expects to be published and what has been checked: the honest map of what is missing.")
    .output(documents.CoverageList)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/coverage").output(output) })),

  ListCoalitions: dryv
    .operation()
    .role("list")
    .description("Coalitions of parties.")
    .output(documents.CoalitionList)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/coalitions").output(output) })),

  ListManifestos: dryv
    .operation()
    .role("list")
    .description("Party and candidate manifestos by election.")
    .output(documents.ManifestoList)
    .facets(({ output }) => ({ http: dryv.http("GET", "/v1/manifestos").output(output) })),
});
