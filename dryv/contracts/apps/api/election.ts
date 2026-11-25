/**
 * Module `election`: elections, the contests for a place, and the prepared tallies to show.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Candidates, Contests, election, Elections, Tallies } from "#/schemas/postgres/election.ts";
import { Individuals } from "#/schemas/postgres/official.ts";
import { Parties } from "#/schemas/postgres/politics.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const contestsFeature = election.feature("Contests").failureDefaults(apiHttp);
const electionRef = Elections.asRef();
const contest = Contests.asRef();
const candidate = Candidates.asRef();
const tally = Tallies.asRef();
const individual = Individuals.asRef();
const party = Parties.asRef();

const CountryElections = election
  .schema("CountryElections", { countryId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const ElectionKey = election.schema("ElectionKey", { code: dryv.field(p.IdentityCode) }).asRef();
const PlaceTallies = election
  .schema("PlaceTallies", {
    countryId: dryv.field(p.Id),
    featureId: dryv.field(p.Id),
    contestId: dryv.field(p.Id).optional(),
  })
  .extends(PageWindow)
  .asRef();

const q = contestsFeature.queries({
  ScanElections: dryv.readQuery
    .from(electionRef)
    .input(CountryElections)
    .where((row, args) => [row.fields.countryId.eq(args.countryId)])
    .select((row) => ({
      electionId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      statusTerm: row.fields.statusTerm,
      heldOn: row.fields.heldOn,
      fromYear: row.fields.fromYear,
      eventId: row.fields.eventId,
      names: namesOf(row.follow(electionRef.fields.id, identityRef)),
    }))
    .orderBy((row) => [row.fields.fromYear.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  FindElection: dryv.readQuery
    .from(electionRef)
    .input(ElectionKey)
    .where((row, args) => [row.fields.code.eq(args.code)])
    .select((row) => ({
      electionId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      statusTerm: row.fields.statusTerm,
      heldOn: row.fields.heldOn,
      fromYear: row.fields.fromYear,
      names: namesOf(row.follow(electionRef.fields.id, identityRef)),
      contests: row.reverse(contest.fields.electionId, contest).select(
        (c) => ({
          contestId: c.fields.id,
          code: c.fields.code,
          kindTerm: c.fields.kindTerm,
          officeId: c.fields.officeId,
          featureId: c.fields.featureId,
          candidates: c.reverse(candidate.fields.contestId, candidate).select(
            (k) => ({
              candidateId: k.fields.id,
              individualId: k.fields.individualId,
              partyId: k.fields.partyId,
              partyCode: k.follow(candidate.fields.partyId, party).fields.code,
              ballotOrder: k.fields.ballotOrder,
              names: namesOf(k.follow(candidate.fields.individualId, individual).follow(individual.fields.id, identityRef)),
            }),
            (k) => [k.fields.ballotOrder.order("asc"), k.fields.id.order("asc")],
          ),
        }),
        (c) => [c.fields.code.order("asc"), c.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
  ScanTallies: dryv.readQuery
    .from(tally)
    .input(PlaceTallies)
    .where((row, args) => [
      row.fields.countryId.eq(args.countryId),
      row.fields.featureId.eq(args.featureId),
      row.fields.contestId.eq(args.contestId),
    ])
    .select((row) => ({
      contestId: row.fields.contestId,
      candidateId: row.fields.candidateId,
      choiceId: row.fields.choiceId,
      votes: row.fields.votes,
      share: row.fields.share,
      status: row.fields.status,
      basis: row.fields.basis,
      refreshedAt: row.fields.refreshedAt,
    }))
    .orderBy((row) => [
      row.fields.contestId.order("asc"),
      row.fields.votes.order("desc"),
      row.fields.id.order("asc"),
      row.fields.countryId.order("asc"),
    ])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 1000 })),
});
export const electionQueries = q;
const rows = election.schemas({
  ElectionEntry: dryv.schema.fromQuery(q.ScanElections),
  ElectionDetail: dryv.schema.fromQuery(q.FindElection),
  TallyEntry: dryv.schema.fromQuery(q.ScanTallies),
});
export const electionRows = rows;
const io = election.schemas({
  ElectionCollection: dryv.schema({ elections: dryv.field(rows.ElectionEntry).array() }),
  TallyCollection: dryv.schema({ tallies: dryv.field(rows.TallyEntry).array() }),
});

export const electionOperations = contestsFeature.operations({
  ListElections: dryv
    .operation()
    .role("list")
    .description("A country's elections, newest first.")
    .input(CountryElections)
    .output(io.ElectionCollection)
    .queryFromInput(q.ScanElections, { envelope: { elections: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/election/elections").input(input, dryv.queryObject()).output(output),
    })),
  GetElection: dryv
    .operation()
    .role("detail")
    .description("One election with its contests and candidates.")
    .input(ElectionKey)
    .output(rows.ElectionDetail)
    .queryFromInput(q.FindElection, { missing: f.NotFound })
    .cache(CACHE.structure)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/election/elections/{code}").input(inputField("code"), dryv.path()).output(output),
    })),
  ListTallies: dryv
    .operation()
    .role("list")
    .description("The results to show for a place, per contest and option, chosen by the country's priorities.")
    .input(PlaceTallies)
    .output(io.TallyCollection)
    .queryFromInput(q.ScanTallies, { envelope: { tallies: "rows" } })
    .cache(CACHE.figures)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/election/tallies").input(input, dryv.queryObject()).output(output),
    })),
});
