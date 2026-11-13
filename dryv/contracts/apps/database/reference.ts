import * as d from "@dryvcode/author";
import { databaseHttp } from "#/apps/database/failures.ts";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { reference, Scheme, Value } from "#/schemas/mzizi/reference.ts";

const catalogue = reference.feature("Catalogue").failureDefaults(databaseHttp);
const scheme = Scheme.asRef();
const value = Value.asRef();

const { ScanSchemes, ScanMembers } = catalogue.queries({
  ScanSchemes: d.readQuery
    .from(scheme)
    .params({
      prefix: { value: p.IdentityCode, optional: true },
      limit: { value: p.Integer, optional: true },
      offset: { value: p.Integer, optional: true },
    })
    .where((row, args) => [row.fields.code.compare("prefix", args.prefix)])
    .select(({ fields }) => ({ id: fields.id, code: fields.code, owner_snapshot: fields.ownerSnapshot, title: fields.title }))
    .orderBy(({ fields }) => [fields.code.order("asc"), fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 200 })),
  ScanMembers: d.readQuery
    .from(value)
    .params({ schemeId: p.Id, limit: { value: p.Integer, optional: true }, offset: { value: p.Integer, optional: true } })
    .where((row, args) => [row.fields.schemeId.eq(args.schemeId)])
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

const rows = catalogue.schemas({ SchemeEntry: d.schema.fromQuery(ScanSchemes), MemberEntry: d.schema.fromQuery(ScanMembers) });
const io = catalogue.schemas({
  SchemeWindow: d.schema({
    code: d.field(p.IdentityCode).optional(),
    limit: d.field(p.Integer).optional().default(50),
    offset: d.field(p.Integer).optional().default(0),
  }),
  MemberWindow: d.schema({
    scheme_id: d.field(p.Id),
    limit: d.field(p.Integer).optional().default(50),
    offset: d.field(p.Integer).optional().default(0),
  }),
  SchemeCollection: d.schema({ schemes: d.field(rows.SchemeEntry).array() }),
  MemberCollection: d.schema({ values: d.field(rows.MemberEntry).array() }),
  MemberKey: d.schema({ scheme: d.field(p.IdentityCode), code: d.field(p.IdentityCode) }),
  ResolvedMember: d.schema({ value: d.field(rows.MemberEntry) }),
});

export const referenceOperations = catalogue.operations({
  BrowseSchemes: d
    .operation()
    .role("list")
    .description("Page through classification schemes in code order.")
    .input(io.SchemeWindow)
    .output(io.SchemeCollection)
    .query(ScanSchemes, ({ inputField }) => ({
      parameters: { prefix: inputField("code"), limit: inputField("limit"), offset: inputField("offset") },
      envelope: { schemes: "rows" },
    }))
    .facets(({ input, output }) => ({ http: d.http("GET", "/v1/reference/schemes").input(input, d.queryObject()).output(output) })),
  BrowseSchemeMembers: d
    .operation()
    .role("list")
    .description("Page through members of one scheme, including superseded members.")
    .input(io.MemberWindow)
    .output(io.MemberCollection)
    .query(ScanMembers, ({ inputField }) => ({
      parameters: { schemeId: inputField("scheme_id"), limit: inputField("limit"), offset: inputField("offset") },
      envelope: { values: "rows" },
    }))
    .facets(({ input, output }) => ({ http: d.http("GET", "/v1/reference/values").input(input, d.queryObject()).output(output) })),
  ResolveMemberCode: d
    .operation()
    .role("detail")
    .description("Resolve one classification member from its scheme and member codes.")
    .input(io.MemberKey)
    .output(io.ResolvedMember)
    .failures(f.NotFound)
    .facets(({ input, output }) => ({ http: d.http("POST", "/v1/reference/values/lookup").input(input, d.body()).output(output) })),
});
