import * as dryv from "@dryvcode/author";
import { databaseHttp } from "#/apps/database/failures.ts";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { reference, Scheme, Value } from "#/schemas/mzizi/reference.ts";

const catalogue = reference.feature("Catalogue").failureDefaults(databaseHttp);
const scheme = Scheme.asRef();
const value = Value.asRef();

const ReferencePage = reference
  .schema("ReferencePage", {
    limit: dryv.field(p.Integer).optional().default(50),
    offset: dryv.field(p.Integer).optional().default(0),
  })
  .abstract()
  .asRef();

const SchemeWindow = reference
  .schema("SchemeWindow", {
    code: dryv.field(p.IdentityCode).optional(),
  })
  .extends(ReferencePage)
  .asRef();

const MemberWindow = reference
  .schema("MemberWindow", {
    scheme_id: dryv.field(p.Id),
  })
  .extends(ReferencePage)
  .asRef();

const { ScanSchemes, ScanMembers } = catalogue.queries({
  ScanSchemes: dryv.readQuery
    .from(scheme)
    .input(SchemeWindow)
    .where((row, args) => [row.fields.code.compare("prefix", args.code)])
    .select(({ fields }) => ({ id: fields.id, code: fields.code, owner_snapshot: fields.ownerSnapshot, title: fields.title }))
    .orderBy(({ fields }) => [fields.code.order("asc"), fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 200 })),
  ScanMembers: dryv.readQuery
    .from(value)
    .input(MemberWindow)
    .where((row, args) => [row.fields.schemeId.eq(args.scheme_id)])
    .select(({ fields }) => ({
      id: fields.id,
      code: fields.code,
      label: fields.label,
      scheme_id: fields.schemeId,
      supersedes_id: fields.supersedesId,
    }))
    .orderBy(({ fields }) => [fields.code.order("asc"), fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 200 })),
});

const rows = catalogue.schemas({ SchemeEntry: dryv.schema.fromQuery(ScanSchemes), MemberEntry: dryv.schema.fromQuery(ScanMembers) });
const io = catalogue.schemas({
  SchemeCollection: dryv.schema({ schemes: dryv.field(rows.SchemeEntry).array() }),
  MemberCollection: dryv.schema({ values: dryv.field(rows.MemberEntry).array() }),
  MemberKey: dryv.schema({ scheme: dryv.field(p.IdentityCode), code: dryv.field(p.IdentityCode) }),
  ResolvedMember: dryv.schema({ value: dryv.field(rows.MemberEntry) }),
});

export const referenceOperations = catalogue.operations({
  BrowseSchemes: dryv
    .operation()
    .role("list")
    .description("Page through classification schemes in code order.")
    .input(SchemeWindow)
    .output(io.SchemeCollection)
    .queryFromInput(ScanSchemes, { envelope: { schemes: "rows" } })
    .facets(({ input, output }) => ({ http: dryv.http("GET", "/v1/reference/schemes").input(input, dryv.queryObject()).output(output) })),
  BrowseSchemeMembers: dryv
    .operation()
    .role("list")
    .description("Page through members of one scheme, including superseded members.")
    .input(MemberWindow)
    .output(io.MemberCollection)
    .queryFromInput(ScanMembers, { envelope: { values: "rows" } })
    .facets(({ input, output }) => ({ http: dryv.http("GET", "/v1/reference/values").input(input, dryv.queryObject()).output(output) })),
  ResolveMemberCode: dryv
    .operation()
    .role("detail")
    .description("Resolve one classification member from its scheme and member codes.")
    .input(io.MemberKey)
    .output(io.ResolvedMember)
    .failures(f.NotFound)
    .facets(({ input, output }) => ({ http: dryv.http("POST", "/v1/reference/values/lookup").input(input, dryv.body()).output(output) })),
});
