/** In-memory synthetic relational dry-run. It writes no database and uses no external facts. */
import { strict as assert } from "node:assert";

const identities = new Set(["org:roads", "org:health", "org:treasury", "org:builder", "org:party-a", "person:candidate"]);
const units = new Set(["unit:national", "unit:county-a"]);
const institutions = [{ id: "institution:roads", entity: "org:roads" }];
const offices = [{ id: "office:director", institution: "institution:roads", unit: "unit:national" }];
const holders = [{ office: "office:director", individual: "person:candidate", from: "2020-01-01", until: "2022-01-01" }];
const parties = [{ id: "party:a", entity: "org:party-a" }];
const memberships = [{ party: "party:a", person: "person:candidate", from: "2018-01-01", until: "2023-01-01" }];
const election = { id: "election:x", country: "country:xx", date: "2021-08-01" };
const contests = [{ id: "contest:director", election: election.id, office: "office:director", unit: "unit:county-a" }];
const candidates = [{ id: "candidate:x", contest: "contest:director", person: "person:candidate", partyAtElection: "party:a" }];
const electorates = [{ contest: "contest:director", unit: "unit:county-a", registered: 1000, cast: 700, valid: 680, rejected: 20 }];
const results = [{ candidate: "candidate:x", unit: "unit:county-a", votes: 680 }];
const project = { id: "project:road-a", institution: "institution:roads", unit: "unit:county-a", status: "in_progress" };
const featureLinks = [{ project: project.id, feature: "feature:road-a", role: "rehabilitated" }];
const service = {
  provider: "org:health",
  institution: "institution:roads",
  place: "place:clinic-a",
  unit: "unit:county-a",
  from: "2020-01-01",
  until: null,
};
const procurement = { id: "tender:road-a", buyer: "org:roads", project: project.id };
const bid = { tender: procurement.id, bidder: "org:builder", amountMinor: 120_000, currency: "currency:xx", outcome: "awarded" };
const contract = { id: "contract:road-a", tender: procurement.id, contractor: bid.bidder, amountMinor: 100_000, currency: bid.currency };
const delivery = { contract: contract.id, milestone: "section-opened", unit: project.unit, citation: "cite:delivery" };
const budget = { id: "budget:fy-x", period: "period:fy-x" };
const versions = [
  { budget: budget.id, version: 1, status: "original", appropriationMinor: 100_000 },
  { budget: budget.id, version: 2, status: "supplementary", appropriationMinor: 150_000 },
];
const appropriation = { version: 1, project: project.id, amountMinor: 100_000, currency: contract.currency };
const fund = { id: "fund:roads", manager: "org:treasury" };
const flow = {
  fund: fund.id,
  appropriation: appropriation.version,
  contract: contract.id,
  debt: null,
  counterparty: contract.contractor,
  amountMinor: 25_000,
  currency: contract.currency,
  kind: "payment",
};
const debt = { id: "debt:x", borrower: "org:treasury", lender: "org:development-bank", principalMinor: 500_000 };
const debtFlows = [
  { debt: debt.id, kind: "disbursement", amountMinor: 300_000 },
  { debt: debt.id, kind: "repayment", amountMinor: 50_000 },
];

// Referential checks model the typed Main FK paths in the contract graph.
assert.ok(identities.has(institutions[0]!.entity));
assert.equal(offices[0]!.institution, institutions[0]!.id);
assert.equal(holders[0]!.office, offices[0]!.id);
assert.ok(units.has(offices[0]!.unit));
assert.equal(parties[0]!.entity, "org:party-a");
assert.equal(memberships[0]!.party, candidates[0]!.partyAtElection);
assert.equal(contests[0]!.office, offices[0]!.id);
assert.ok(units.has(contests[0]!.unit));
assert.equal(results[0]!.candidate, candidates[0]!.id);
assert.equal(electorates[0]!.unit, results[0]!.unit);
assert.equal(service.place, "place:clinic-a");
assert.ok(units.has(service.unit));
assert.equal(featureLinks[0]!.project, project.id);
assert.equal(procurement.project, project.id);
assert.equal(bid.tender, procurement.id);
assert.equal(contract.tender, procurement.id);
assert.equal(delivery.contract, contract.id);
assert.equal(appropriation.project, project.id);
assert.equal(flow.contract, contract.id);
assert.equal(flow.fund, fund.id);

// Test A: one roads feature joins its project, buyer, tender, contract and a cited milestone.
assert.deepEqual(
  featureLinks.filter((row) => row.project === project.id).map((row) => row.feature),
  ["feature:road-a"],
);
assert.equal(delivery.citation, "cite:delivery");
// Test B: contest, party-at-election, geographic electorate and vote result remain distinct.
assert.equal(candidates.filter((row) => row.contest === contests[0]!.id && row.partyAtElection === "party:a").length, 1);
assert.deepEqual(
  electorates.filter((row) => row.unit === "unit:county-a").map((row) => row.registered),
  [1000],
);
assert.deepEqual(
  results.filter((row) => row.unit === "unit:county-a").map((row) => row.votes),
  [680],
);
assert.equal(
  memberships.find((row) => row.person === "person:candidate" && row.from <= election.date && election.date < row.until)!.party,
  "party:a",
);
// Test C: service availability resolves to a physical Geography place and a coverage unit.
assert.equal(service.provider, "org:health");
assert.equal(service.unit, project.unit);
// Test D: original and supplementary budgets are not added; payments differ from authorization/award.
assert.deepEqual(
  versions.map((row) => row.appropriationMinor),
  [100_000, 150_000],
);
assert.equal(contract.amountMinor, 100_000);
assert.equal(flow.amountMinor, 25_000);
assert.equal((flow.amountMinor / contract.amountMinor) * 100, 25);
assert.deepEqual(
  debtFlows.map((row) => row.kind),
  ["disbursement", "repayment"],
);
assert.equal(
  debtFlows.reduce((sum, row) => sum + row.amountMinor, 0),
  350_000,
);
// Test E: a variance is emitted as a signal with source context, never as a misconduct conclusion.
const signal = {
  kind: "payment_below_contract",
  paymentMinor: flow.amountMinor,
  contractMinor: contract.amountMinor,
  status: "review_signal",
  citation: "cite:payment",
};
assert.equal(signal.status, "review_signal");
assert.equal(signal.citation, "cite:payment");
assert.ok(!("misconduct" in signal));

console.log("Synthetic Main dry-run OK: institutional, election, service, project, finance and accountability joins");
