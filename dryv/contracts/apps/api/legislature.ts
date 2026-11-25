/**
 * Module `legislature`: bills and their stages, motions and how members voted.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Holders } from "#/schemas/postgres/governance.ts";
import { Bills, legislature, Sittings, Stages, Votes } from "#/schemas/postgres/legislature.ts";
import { Parties } from "#/schemas/postgres/politics.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const lawmaking = legislature.feature("Lawmaking").failureDefaults(apiHttp);
const bill = Bills.asRef();
const stage = Stages.asRef();

const vote = Votes.asRef();
const sitting = Sittings.asRef();
const holder = Holders.asRef();
const party = Parties.asRef();

const BillWindow = legislature
  .schema("BillWindow", { institutionId: dryv.field(p.Id), statusTerm: dryv.field(p.Id).optional() })
  .extends(PageWindow)
  .asRef();
const BillKey = legislature.schema("BillKey", { code: dryv.field(p.IdentityCode) }).asRef();
const MotionVotes = legislature
  .schema("MotionVotes", { countryId: dryv.field(p.Id), motionId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const q = lawmaking.queries({
  ScanBills: dryv.readQuery
    .from(bill)
    .input(BillWindow)
    .where((row, args) => [row.fields.institutionId.eq(args.institutionId), row.fields.statusTerm.eq(args.statusTerm)])
    .select((row) => ({
      billId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      statusTerm: row.fields.statusTerm,
      termId: row.fields.termId,
      instrumentId: row.fields.instrumentId,
      names: namesOf(row.follow(bill.fields.id, identityRef)),
    }))
    .orderBy((row) => [row.fields.code.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  FindBill: dryv.readQuery
    .from(bill)
    .input(BillKey)
    .where((row, args) => [row.fields.code.eq(args.code)])
    .select((row) => ({
      billId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      statusTerm: row.fields.statusTerm,
      institutionId: row.fields.institutionId,
      sponsorId: row.fields.sponsorId,
      instrumentId: row.fields.instrumentId,
      names: namesOf(row.follow(bill.fields.id, identityRef)),
      stages: row.reverse(stage.fields.billId, stage).select(
        (s) => ({
          kindTerm: s.fields.kindTerm,
          onDate: s.fields.onDate,
          outcomeTerm: s.fields.outcomeTerm,
          sequence: s.fields.sequence,
          sittingId: s.fields.sittingId,
          occurrenceId: s.follow(stage.fields.sittingId, sitting).fields.occurrenceId,
          motionId: s.fields.motionId,
        }),
        (s) => [s.fields.sequence.order("asc"), s.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
  ScanVotes: dryv.readQuery
    .from(vote)
    .input(MotionVotes)
    .where((row, args) => [row.fields.countryId.eq(args.countryId), row.fields.motionId.eq(args.motionId)])
    .select((row) => ({
      holderId: row.fields.holderId,
      individualId: row.follow(vote.fields.holderId, holder).fields.individualId,
      choice: row.fields.choice,
      partyId: row.fields.partyId,
      partyCode: row.follow(vote.fields.partyId, party).fields.code,
    }))
    .orderBy((row) => [row.fields.holderId.order("asc"), row.fields.id.order("asc"), row.fields.countryId.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 1000 })),
});

export const legislatureQueries = q;
const rows = legislature.schemas({
  BillEntry: dryv.schema.fromQuery(q.ScanBills),
  BillDetail: dryv.schema.fromQuery(q.FindBill),
  VoteEntry: dryv.schema.fromQuery(q.ScanVotes),
});
export const legislatureRows = rows;
const io = legislature.schemas({
  BillCollection: dryv.schema({ bills: dryv.field(rows.BillEntry).array() }),
  VoteCollection: dryv.schema({ votes: dryv.field(rows.VoteEntry).array() }),
});

export const legislatureOperations = lawmaking.operations({
  ListBills: dryv
    .operation()
    .role("list")
    .description("The bills of a house, optionally by status, newest first.")
    .input(BillWindow)
    .output(io.BillCollection)
    .queryFromInput(q.ScanBills, { envelope: { bills: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/legislature/bills").input(input, dryv.queryObject()).output(output),
    })),
  GetBill: dryv
    .operation()
    .role("detail")
    .description("One bill with its stages, each dated through its sitting's calendar occurrence.")
    .input(BillKey)
    .output(rows.BillDetail)
    .queryFromInput(q.FindBill, { missing: f.NotFound })
    .cache(CACHE.structure)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/legislature/bills/{code}").input(inputField("code"), dryv.path()).output(output),
    })),
  ListVotes: dryv
    .operation()
    .role("list")
    .description("How each member voted on a motion, with the party they voted as.")
    .input(MotionVotes)
    .output(io.VoteCollection)
    .queryFromInput(q.ScanVotes, { envelope: { votes: "rows" } })
    .cache(CACHE.figures)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/legislature/votes").input(input, dryv.queryObject()).output(output),
    })),
});
