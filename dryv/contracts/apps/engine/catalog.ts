/** Read-only catalog for preparing seed drafts from the generated database contracts. */
import { field, group, http, operation, property, query, schema } from "@dryvcode/author";
import { engineShared } from "./engine.ts";

const { engineHttp, ServiceKey, Blurb } = engineShared;
const catalog = group({ name: "catalog" }).description("Generated seed contract catalog.");
const seed = catalog.feature("SeedCatalog").description("Seedable tables, fields and links.").failureDefaults(engineHttp);
const { TableName, CatalogDigest, IsRequired } = catalog.properties({
  IsRequired: property.boolean(),
  TableName: property.string().length({ min: 1, max: 200 }),
  CatalogDigest: property.string().length({ min: 64, max: 64 }),
});
const { SeedColumn } = seed.schemas({
  SeedColumn: schema({
    name: field(Blurb),
    kind: field(Blurb),
    required: field(IsRequired),
    target_table: field(TableName).nullable().optional(),
    target_column: field(Blurb).nullable().optional(),
  }),
});
const { SeedTable } = seed.schemas({
  SeedTable: schema({
    name: field(TableName),
    natural_key: field(Blurb).array(),
    columns: field(SeedColumn).array(),
  }),
});
const { SeedCatalog, SeedCatalogQuery } = seed.schemas({
  SeedCatalogQuery: schema({ table: field(TableName).optional() }),
  SeedCatalog: schema({ sha256: field(CatalogDigest), tables: field(SeedTable).array() }),
});

const GetSeedCatalog = seed.operation(
  "GetSeedCatalog",
  operation()
    .role("list")
    .description("Read the generated seed contract catalog, optionally filtered by table.")
    .input(SeedCatalogQuery)
    .output(SeedCatalog)
    .authenticated()
    .requires(ServiceKey)
    .facets(({ inputField, output }) => ({
      http: http("GET", "/v1/catalog/seed-tables").input(inputField("table"), query("table")).output(output),
    })),
);

export const catalogApi = { catalog, GetSeedCatalog };
