/**
 * Reference: the classification vocabularies behind every other record (kinds, statuses, currencies).
 * Public reads, so clients can label what they show.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { reference, Scheme, Value } from "#/schemas/postgres/reference.ts";
import { apiHttp, MAX_PAGE, PageWindow } from "./_shared.ts";

const catalogue = reference.feature("Catalogue").failureDefaults(apiHttp);
const scheme = Scheme.asRef();
const value = Value.asRef();

const SchemeWindow = reference
  .schema("SchemeWindow", { code: dryv.field(p.IdentityCode).optional() })
  .extends(PageWindow)
  .asRef();

const MemberWindow = reference
  .schema("MemberWindow", { schemeId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const MemberKey = reference.schema("MemberKey", { code: dryv.field(p.IdentityCode) }).asRef();

const { ScanSchemes, ScanMembers, FindMember } = catalogue.queries({
  ScanSchemes: dryv.readQuery
    .from(scheme)
    .input(SchemeWindow)
    .where((row, args) => [row.fields.code.compare("prefix", args.code)])
    .select(({ fields }) => ({ id: fields.id, code: fields.code, title: fields.title }))
    .orderBy(({ fields }) => [fields.code.order("asc"), fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),

  ScanMembers: dryv.readQuery
    .from(value)
    .input(MemberWindow)
    .where((row, args) => [row.fields.schemeId.eq(args.schemeId)])
    .select(({ fields }) => ({ id: fields.id, code: fields.code, label: fields.label, supersedesId: fields.supersedesId }))
    .orderBy(({ fields }) => [fields.code.order("asc"), fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),

  FindMember: dryv.readQuery
    .from(value)
    .input(MemberKey)
    .where((row, args) => [row.fields.code.eq(args.code)])
    .select((row) => ({
      id: row.fields.id,
      code: row.fields.code,
      label: row.fields.label,
      scheme: row.follow(value.fields.schemeId, scheme).fields.code,
    }))
    .zeroOrOne(),
});

const rows = catalogue.schemas({
  SchemeEntry: dryv.schema.fromQuery(ScanSchemes),
  MemberEntry: dryv.schema.fromQuery(ScanMembers),
  FoundMember: dryv.schema.fromQuery(FindMember),
});
const io = catalogue.schemas({
  SchemeCollection: dryv.schema({ schemes: dryv.field(rows.SchemeEntry).array() }),
  MemberCollection: dryv.schema({ values: dryv.field(rows.MemberEntry).array() }),
});

export const referenceOperations = catalogue.operations({
  BrowseSchemes: dryv
    .operation()
    .role("list")
    .description("Page through classification schemes in code order.")
    .input(SchemeWindow)
    .output(io.SchemeCollection)
    .queryFromInput(ScanSchemes, { envelope: { schemes: "rows" } })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/reference/schemes").input(input, dryv.queryObject()).output(output),
    })),

  BrowseSchemeMembers: dryv
    .operation()
    .role("list")
    .description("Page through the members of one scheme, including superseded members.")
    .input(MemberWindow)
    .output(io.MemberCollection)
    .queryFromInput(ScanMembers, { envelope: { values: "rows" } })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/reference/values").input(input, dryv.queryObject()).output(output),
    })),

  LookupMember: dryv
    .operation()
    .role("detail")
    .description("Find one classification member from its code (codes are unique across every scheme).")
    .input(MemberKey)
    .output(rows.FoundMember)
    .queryFromInput(FindMember, { missing: f.NotFound })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/reference/lookup").input(input, dryv.queryObject()).output(output),
    })),
});
