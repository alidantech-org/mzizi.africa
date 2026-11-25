/**
 * Module `legal`: instruments, their provision tree and official wordings, and what a provision does to a thing.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Editions, Effects, Instruments, legal, Provisions, Wordings } from "#/schemas/postgres/legal.ts";
import { Languages } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const law = legal.feature("Law").failureDefaults(apiHttp);
const instrument = Instruments.asRef();
const edition = Editions.asRef();
const provision = Provisions.asRef();
const wording = Wordings.asRef();
const effect = Effects.asRef();
const language = Languages.asRef();

const InstrumentWindow = legal
  .schema("InstrumentWindow", { kindTerm: dryv.field(p.Id).optional() })
  .extends(PageWindow)
  .asRef();
const InstrumentKey = legal.schema("InstrumentKey", { code: dryv.field(p.IdentityCode) }).asRef();
const ProvisionScope = legal
  .schema("ProvisionScope", { instrumentId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const IdentityEffects = legal
  .schema("IdentityEffects", { identityId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const q = law.queries({
  ScanInstruments: dryv.readQuery
    .from(instrument)
    .input(InstrumentWindow)
    .where((row, args) => [row.fields.kindTerm.eq(args.kindTerm)])
    .select((row) => ({
      instrumentId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      statusTerm: row.fields.statusTerm,
      enactedOn: row.fields.enactedOn,
      fromYear: row.fields.fromYear,
      names: namesOf(row.follow(instrument.fields.id, identityRef)),
    }))
    .orderBy((row) => [row.fields.fromYear.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  FindInstrument: dryv.readQuery
    .from(instrument)
    .input(InstrumentKey)
    .where((row, args) => [row.fields.code.eq(args.code)])
    .select((row) => ({
      instrumentId: row.fields.id,
      code: row.fields.code,
      kindTerm: row.fields.kindTerm,
      statusTerm: row.fields.statusTerm,
      issuerId: row.fields.issuerId,
      enactedOn: row.fields.enactedOn,
      publishedOn: row.fields.publishedOn,
      names: namesOf(row.follow(instrument.fields.id, identityRef)),
      editions: row.reverse(edition.fields.instrumentId, edition).select(
        (e) => ({
          editionId: e.fields.id,
          designation: e.fields.designation,
          commencedOn: e.fields.commencedOn,
          consolidatedOn: e.fields.consolidatedOn,
        }),
        (e) => [e.fields.consolidatedOn.order("desc"), e.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
  ScanProvisions: dryv.readQuery
    .from(provision)
    .input(ProvisionScope)
    .where((row, args) => [row.fields.instrumentId.eq(args.instrumentId)])
    .select((row) => ({
      provisionId: row.fields.id,
      code: row.fields.code,
      parentId: row.fields.parentId,
      kind: row.fields.kind,
      designation: row.fields.designation,
      position: row.fields.position,
      wordings: row.reverse(wording.fields.provisionId, wording).select(
        (w) => ({
          editionId: w.fields.editionId,
          languageCode: w.follow(wording.fields.languageId, language).fields.code,
          heading: w.fields.heading,
          text: w.fields.text,
        }),
        (w) => [w.fields.editionId.order("asc"), w.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.parentId.order("asc"), row.fields.position.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 2000 })),
  ScanEffects: dryv.readQuery
    .from(effect)
    .input(IdentityEffects)
    .where((row, args) => [row.fields.identityId.eq(args.identityId)])
    .select((row) => ({
      effectId: row.fields.id,
      kindTerm: row.fields.kindTerm,
      reviewStatus: row.fields.reviewStatus,
      wordingId: row.fields.wordingId,
      provisionId: row.follow(effect.fields.wordingId, wording).fields.provisionId,
      designation: row.follow(effect.fields.wordingId, wording).follow(wording.fields.provisionId, provision).fields
        .designation,
      instrumentId: row.follow(effect.fields.wordingId, wording).follow(wording.fields.provisionId, provision).fields
        .instrumentId,
      effectiveOn: row.fields.effectiveOn,
    }))
    .orderBy((row) => [row.fields.effectiveOn.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const legalQueries = q;
const rows = legal.schemas({
  InstrumentEntry: dryv.schema.fromQuery(q.ScanInstruments),
  InstrumentDetail: dryv.schema.fromQuery(q.FindInstrument),
  ProvisionEntry: dryv.schema.fromQuery(q.ScanProvisions),
  EffectEntry: dryv.schema.fromQuery(q.ScanEffects),
});
export const legalRows = rows;
const io = legal.schemas({
  InstrumentCollection: dryv.schema({ instruments: dryv.field(rows.InstrumentEntry).array() }),
  ProvisionCollection: dryv.schema({ provisions: dryv.field(rows.ProvisionEntry).array() }),
  EffectCollection: dryv.schema({ effects: dryv.field(rows.EffectEntry).array() }),
});

export const legalOperations = law.operations({
  ListInstruments: dryv
    .operation()
    .role("list")
    .description("Legal instruments, newest first, optionally of one kind.")
    .input(InstrumentWindow)
    .output(io.InstrumentCollection)
    .queryFromInput(q.ScanInstruments, { envelope: { instruments: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/legal/instruments").input(input, dryv.queryObject()).output(output),
    })),
  GetInstrument: dryv
    .operation()
    .role("detail")
    .description("One instrument with its editions.")
    .input(InstrumentKey)
    .output(rows.InstrumentDetail)
    .queryFromInput(q.FindInstrument, { missing: f.NotFound })
    .cache(CACHE.structure)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/legal/instruments/{code}").input(inputField("code"), dryv.path()).output(output),
    })),
  ListProvisions: dryv
    .operation()
    .role("list")
    .description("The provision tree of an instrument with every official wording.")
    .input(ProvisionScope)
    .output(io.ProvisionCollection)
    .queryFromInput(q.ScanProvisions, { envelope: { provisions: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/legal/provisions").input(input, dryv.queryObject()).output(output),
    })),
  ListEffects: dryv
    .operation()
    .role("list")
    .description("What law does to a named thing: the provisions that establish, govern or limit it.")
    .input(IdentityEffects)
    .output(io.EffectCollection)
    .queryFromInput(q.ScanEffects, { envelope: { effects: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/legal/effects").input(input, dryv.queryObject()).output(output),
    })),
});
