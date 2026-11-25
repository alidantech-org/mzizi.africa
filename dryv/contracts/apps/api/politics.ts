/**
 * Module `politics`: parties and coalitions, and commitments with their fulfilments.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Languages } from "#/schemas/postgres/reference.ts";
import { Alignments, Coalitions, Commitments, Fulfilments, Parties, politics } from "#/schemas/postgres/politics.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const parties = politics.feature("Parties").failureDefaults(apiHttp);
const promises = politics.feature("Promises").failureDefaults(apiHttp);
const party = Parties.asRef();
const coalition = Coalitions.asRef();
const alignment = Alignments.asRef();
const commitment = Commitments.asRef();
const fulfilment = Fulfilments.asRef();
const language = Languages.asRef();

const CountryParties = politics
  .schema("CountryParties", { countryId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const PartyKey = politics.schema("PartyKey", { code: dryv.field(p.IdentityCode) }).asRef();
const MakerCommitments = politics
  .schema("MakerCommitments", { makerId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const q = {
  ...parties.queries({
    ScanParties: dryv.readQuery
      .from(party)
      .input(CountryParties)
      .where((row, args) => [row.fields.countryId.eq(args.countryId)])
      .select((row) => ({
        partyId: row.fields.id,
        code: row.fields.code,
        kindTerm: row.fields.kindTerm,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        names: namesOf(row.follow(party.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindParty: dryv.readQuery
      .from(party)
      .input(PartyKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        partyId: row.fields.id,
        code: row.fields.code,
        kindTerm: row.fields.kindTerm,
        countryId: row.fields.countryId,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        names: namesOf(row.follow(party.fields.id, identityRef)),
        coalitions: row.reverse(alignment.fields.partyId, alignment).select(
          (a) => ({
            coalitionId: a.fields.coalitionId,
            code: a.follow(alignment.fields.coalitionId, coalition).fields.code,
            kindTerm: a.fields.kindTerm,
            fromYear: a.fields.fromYear,
            toYear: a.fields.toYear,
          }),
          (a) => [a.fields.fromYear.order("desc"), a.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
  }),
  ...promises.queries({
    ScanCommitments: dryv.readQuery
      .from(commitment)
      .input(MakerCommitments)
      .where((row, args) => [row.fields.makerId.eq(args.makerId)])
      .select((row) => ({
        commitmentId: row.fields.id,
        code: row.fields.code,
        kind: row.fields.kind,
        statement: row.fields.statement,
        languageCode: row.follow(commitment.fields.languageId, language).fields.code,
        topicTerm: row.fields.topicTerm,
        placeId: row.fields.placeId,
        quantity: row.fields.quantity,
        madeOn: row.fields.madeOn,
        dueOn: row.fields.dueOn,
        statusTerm: row.fields.statusTerm,
        statusAsOf: row.fields.statusAsOf,
        fulfilments: row.reverse(fulfilment.fields.commitmentId, fulfilment).select(
          (fl) => ({
            kindTerm: fl.fields.kindTerm,
            statusTerm: fl.fields.statusTerm,
            projectId: fl.fields.projectId,
            contractId: fl.fields.contractId,
            appropriationId: fl.fields.appropriationId,
            billId: fl.fields.billId,
            instrumentId: fl.fields.instrumentId,
            recordedOn: fl.fields.recordedOn,
          }),
          (fl) => [fl.fields.recordedOn.order("desc"), fl.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.madeOn.order("desc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
};
export const politicsQueries = q;
const rows = politics.schemas({
  PartyEntry: dryv.schema.fromQuery(q.ScanParties),
  PartyDetail: dryv.schema.fromQuery(q.FindParty),
  CommitmentEntry: dryv.schema.fromQuery(q.ScanCommitments),
});
export const politicsRows = rows;
const io = politics.schemas({
  PartyCollection: dryv.schema({ parties: dryv.field(rows.PartyEntry).array() }),
  CommitmentCollection: dryv.schema({ commitments: dryv.field(rows.CommitmentEntry).array() }),
});

export const politicsOperations = {
  ...parties.operations({
    ListParties: dryv
      .operation()
      .role("list")
      .description("A country's political parties.")
      .input(CountryParties)
      .output(io.PartyCollection)
      .queryFromInput(q.ScanParties, { envelope: { parties: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/politics/parties").input(input, dryv.queryObject()).output(output),
      })),
    GetParty: dryv
      .operation()
      .role("detail")
      .description("One party with the coalitions it has belonged to.")
      .input(PartyKey)
      .output(rows.PartyDetail)
      .queryFromInput(q.FindParty, { missing: f.NotFound })
      .cache(CACHE.structure)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/politics/parties/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
  }),
  ...promises.operations({
    ListCommitments: dryv
      .operation()
      .role("list")
      .description("The commitments a person, party or office made, in their original words, with fulfilments.")
      .input(MakerCommitments)
      .output(io.CommitmentCollection)
      .queryFromInput(q.ScanCommitments, { envelope: { commitments: "rows" } })
      .cache(CACHE.structure)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/politics/commitments").input(input, dryv.queryObject()).output(output),
      })),
  }),
};
