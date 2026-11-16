/**
 * Geography: public reads over features (countries, administrative and historical units, rivers, roads and more).
 *
 * A feature's code, type and names sit in different tables; the queries join them so a client gets one readable
 * feature with all its names.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Features, geography, Names } from "#/schemas/postgres/geography.ts";
import { apiHttp, MAX_PAGE, PageWindow } from "./_shared.ts";

const places = geography.feature("Places").failureDefaults(apiHttp);
const feature = Features.asRef();
const name = Names.asRef();

const FeatureWindow = geography
  .schema("FeatureWindow", {
    featureTypeId: dryv.field(p.Id).optional(),
    codePrefix: dryv.field(p.IdentityCode).optional(),
  })
  .extends(PageWindow)
  .asRef();

const FeatureKey = geography.schema("FeatureKey", { featureId: dryv.field(p.Id) }).asRef();

const { ScanFeatures, FindFeature } = places.queries({
  ScanFeatures: dryv.readQuery
    .from(feature)
    .input(FeatureWindow)
    .where((row, args) => [
      row.fields.featureTypeId.eq(args.featureTypeId),
      row.fields.code.compare("prefix", args.codePrefix),
    ])
    .select((row) => ({
      featureId: row.fields.id,
      code: row.fields.code,
      featureTypeId: row.fields.featureTypeId,
      validFrom: row.fields.validFrom,
      validUntil: row.fields.validUntil,
      names: row.reverse(name.fields.featureId, name).select(
        (n) => ({ name: n.fields.name, languageTag: n.fields.languageTag }),
        (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),

  FindFeature: dryv.readQuery
    .from(feature)
    .input(FeatureKey)
    .where((row, args) => [row.fields.id.eq(args.featureId)])
    .select((row) => ({
      featureId: row.fields.id,
      code: row.fields.code,
      featureTypeId: row.fields.featureTypeId,
      validFrom: row.fields.validFrom,
      validUntil: row.fields.validUntil,
      names: row.reverse(name.fields.featureId, name).select(
        (n) => ({ name: n.fields.name, languageTag: n.fields.languageTag }),
        (n) => [n.fields.name.order("asc"), n.fields.id.order("asc")],
      ),
    }))
    .orderBy(({ fields }) => [fields.id.order("asc")])
    .zeroOrOne(),
});

const rows = places.schemas({
  FeatureEntry: dryv.schema.fromQuery(ScanFeatures),
  FeatureDetail: dryv.schema.fromQuery(FindFeature),
});
const io = places.schemas({
  FeatureCollection: dryv.schema({ features: dryv.field(rows.FeatureEntry).array() }),
});

export const geographyOperations = places.operations({
  BrowseFeatures: dryv
    .operation()
    .role("list")
    .description("Browse geographic features with their names, optionally of one type or by code prefix.")
    .input(FeatureWindow)
    .output(io.FeatureCollection)
    .queryFromInput(ScanFeatures, { envelope: { features: "rows" } })
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/geography/features").input(input, dryv.queryObject()).output(output),
    })),

  GetFeature: dryv
    .operation()
    .role("detail")
    .description("One geographic feature with its names.")
    .input(FeatureKey)
    .output(rows.FeatureDetail)
    .queryFromInput(FindFeature, { missing: f.NotFound })
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/geography/features/{featureId}").input(inputField("featureId"), dryv.path()).output(output),
    })),
});
