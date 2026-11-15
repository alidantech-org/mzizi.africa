/**
 * Geography: public reads over administrative and historical units.
 *
 * A unit's code, names and country sit in different tables; the queries join them so a client gets one
 * readable unit with all its names.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Features, geography, Names, Units } from "#/schemas/postgres/geography.ts";
import { apiHttp, MAX_PAGE, PageWindow } from "./_shared.ts";

const places = geography.feature("Places").failureDefaults(apiHttp);
const unit = Units.asRef();
const feature = Features.asRef();
const name = Names.asRef();

const UnitWindow = geography
  .schema("UnitWindow", {
    countryId: dryv.field(p.Id).optional(),
    codePrefix: dryv.field(p.IdentityCode).optional(),
  })
  .extends(PageWindow)
  .asRef();

const UnitKey = geography.schema("UnitKey", { featureId: dryv.field(p.Id) }).asRef();

const { ScanUnits, FindUnit } = places.queries({
  ScanUnits: dryv.readQuery
    .from(unit)
    .input(UnitWindow)
    .where((row, args) => [
      row.fields.countryId.eq(args.countryId),
      row.follow(unit.fields.featureId, feature).fields.code.compare("prefix", args.codePrefix),
    ])
    .select((row) => {
      const identity = row.follow(unit.fields.featureId, feature);
      return {
        featureId: row.fields.featureId,
        code: identity.fields.code,
        countryId: row.fields.countryId,
        validFrom: row.fields.validFrom,
        validUntil: row.fields.validUntil,
        names: identity.reverse(name.fields.featureId, name).select(
          (n) => ({ name: n.fields.name, languageTag: n.fields.languageTag }),
          (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
        ),
      };
    })
    .orderBy((row) => [
      row.follow(unit.fields.featureId, feature).fields.code.order("asc"),
      row.fields.featureId.order("asc"),
    ])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),

  FindUnit: dryv.readQuery
    .from(unit)
    .input(UnitKey)
    .where((row, args) => [row.fields.featureId.eq(args.featureId)])
    .select((row) => {
      const identity = row.follow(unit.fields.featureId, feature);
      return {
        featureId: row.fields.featureId,
        code: identity.fields.code,
        countryId: row.fields.countryId,
        validFrom: row.fields.validFrom,
        validUntil: row.fields.validUntil,
        names: identity.reverse(name.fields.featureId, name).select(
          (n) => ({ name: n.fields.name, languageTag: n.fields.languageTag }),
          (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
        ),
      };
    })
    .orderBy(({ fields }) => [fields.featureId.order("asc")])
    .zeroOrOne(),
});

const rows = places.schemas({
  UnitEntry: dryv.schema.fromQuery(ScanUnits),
  UnitDetail: dryv.schema.fromQuery(FindUnit),
});
const io = places.schemas({
  UnitCollection: dryv.schema({ units: dryv.field(rows.UnitEntry).array() }),
});

export const geographyOperations = places.operations({
  BrowseUnits: dryv
    .operation()
    .role("list")
    .description("Browse administrative units with their names, optionally for one country or by code prefix.")
    .input(UnitWindow)
    .output(io.UnitCollection)
    .queryFromInput(ScanUnits, { envelope: { units: "rows" } })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/geography/units").input(input, dryv.queryObject()).output(output),
    })),

  GetUnit: dryv
    .operation()
    .role("detail")
    .description("One administrative unit with its names.")
    .input(UnitKey)
    .output(rows.UnitDetail)
    .queryFromInput(FindUnit, { missing: f.NotFound })
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/geography/units/{featureId}").input(inputField("featureId"), dryv.path()).output(output),
    })),
});
