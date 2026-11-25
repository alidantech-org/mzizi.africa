/**
 * Module `identity`: one named thing by code or readable address, its names and public identifiers, and name search.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Addresses, Identifiers, Identities, identity, identityText, Names } from "#/schemas/postgres/identity.ts";
import { Languages } from "#/schemas/postgres/reference.ts";
import { apiHttp, CACHE, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const things = identity.feature("Things").failureDefaults(apiHttp);
const identities = Identities.asRef();
const names = Names.asRef();
const identifiers = Identifiers.asRef();
const addresses = Addresses.asRef();
const languages = Languages.asRef();

const IdentityKey = identity.schema("IdentityKey", { code: dryv.field(p.IdentityCode) }).asRef();
const AddressKey = identity
  .schema("AddressKey", { countryId: dryv.field(p.Id).optional(), segment: dryv.field(identityText.AddressSegment) })
  .extends(PageWindow)
  .asRef();
const NameSearch = identity
  .schema("NameSearch", { text: dryv.field(identityText.NameText) })
  .extends(PageWindow)
  .asRef();

const q = things.queries({
  FindIdentity: dryv.readQuery
    .from(identities)
    .input(IdentityKey)
    .where((row, args) => [row.fields.code.eq(args.code)])
    .select((row) => ({
      identityId: row.fields.id,
      kind: row.fields.kind,
      code: row.fields.code,
      names: namesOf(row),
      identifiers: row.reverse(identifiers.fields.identityId, identifiers).select(
        (i) => ({ schemeTerm: i.fields.schemeTerm, namespace: i.fields.namespace, value: i.fields.value }),
        (i) => [i.fields.schemeTerm.order("asc"), i.fields.id.order("asc"), i.fields.identityKind.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
  ScanAddresses: dryv.readQuery
    .from(addresses)
    .input(AddressKey)
    .where((row, args) => [row.fields.countryId.eq(args.countryId), row.fields.segment.eq(args.segment)])
    .select((row) => ({
      addressId: row.fields.id,
      identityId: row.fields.identityId,
      kind: row.follow(addresses.fields.identityId, identities).fields.kind,
      code: row.follow(addresses.fields.identityId, identities).fields.code,
      parentId: row.fields.parentId,
      canonicalId: row.fields.canonicalId,
      sectionTerm: row.fields.sectionTerm,
      toYear: row.fields.toYear,
    }))
    .orderBy((row) => [row.fields.toYear.order("desc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  SearchNames: dryv.readQuery
    .from(names)
    .input(NameSearch)
    .where((row, args) => [row.fields.text.compare("prefix", args.text)])
    .select((row) => ({
      identityId: row.fields.identityId,
      kind: row.fields.identityKind,
      code: row.follow(names.fields.identityId, identities).fields.code,
      text: row.fields.text,
      languageCode: row.follow(names.fields.languageId, languages).fields.code,
      isDefault: row.fields.isDefault,
    }))
    .orderBy((row) => [row.fields.text.order("asc"), row.fields.id.order("asc"), row.fields.identityKind.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const identityQueries = q;

const rows = things.schemas({
  IdentityDetail: dryv.schema.fromQuery(q.FindIdentity),
  AddressMatch: dryv.schema.fromQuery(q.ScanAddresses),
  NameMatch: dryv.schema.fromQuery(q.SearchNames),
});
export const identityRows = rows;
const io = things.schemas({
  AddressMatches: dryv.schema({ addresses: dryv.field(rows.AddressMatch).array() }),
  NameMatches: dryv.schema({ matches: dryv.field(rows.NameMatch).array() }),
});

export const identityOperations = things.operations({
  GetIdentity: dryv
    .operation()
    .role("detail")
    .description("One named thing by code, with all its names and public identifiers.")
    .input(IdentityKey)
    .output(rows.IdentityDetail)
    .queryFromInput(q.FindIdentity, { missing: f.NotFound })
    .cache(CACHE.structure)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/identity/things/{code}").input(inputField("code"), dryv.path()).output(output),
    })),
  ResolveAddress: dryv
    .operation()
    .role("search")
    .description("The named things a readable address segment opens in a country, current addresses first.")
    .input(AddressKey)
    .output(io.AddressMatches)
    .queryFromInput(q.ScanAddresses, { envelope: { addresses: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/identity/addresses").input(input, dryv.queryObject()).output(output),
    })),
  SearchNames: dryv
    .operation()
    .role("search")
    .description("Named things whose names start with the text, in any language.")
    .input(NameSearch)
    .output(io.NameMatches)
    .queryFromInput(q.SearchNames, { envelope: { matches: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/identity/search").input(input, dryv.queryObject()).output(output),
    })),
});
