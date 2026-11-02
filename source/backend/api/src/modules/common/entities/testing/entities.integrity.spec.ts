import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { DataType, newDb } from "pg-mem";
import type { DataSource, EntityMetadata } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { GeoBoundaryVersionEntity } from "#/modules/geography/entities/geo-boundary-version.entity.ts";
import { GeoRelationshipEntity } from "#/modules/geography/entities/geo-relationship.entity.ts";
import { GeoUnitChangeEntity } from "#/modules/geography/entities/geo-unit-change.entity.ts";
import { GeoUnitNameVersionEntity } from "#/modules/geography/entities/geo-unit-name-version.entity.ts";
import { GeoUnitEntity } from "#/modules/geography/entities/geo-unit.entity.ts";
import { ClassificationRecordEntity } from "#/modules/reference/entities/classification-record.entity.ts";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";

/**
 * Managed by Dryv: every generated entity synchronizes into a Postgres schema (pg-mem) and maps
 * exactly the tables, columns, keys and constraints its contract declares.
 */
const entities = [
  GeoBoundaryVersionEntity,
  GeoRelationshipEntity,
  GeoUnitEntity,
  GeoUnitChangeEntity,
  GeoUnitNameVersionEntity,
  ClassificationRecordEntity,
  JurisdictionEntity,
];

let dataSource: DataSource;

beforeAll(async () => {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  db.public.registerFunction({
    name: "current_database",
    implementation: () => "dryv",
  });
  db.public.registerFunction({
    name: "version",
    implementation: () => "PostgreSQL 16",
  });
  db.public.registerFunction({
    name: "gen_random_uuid",
    returns: DataType.uuid,
    implementation: randomUUID,
    impure: true,
  });
  db.registerExtension("uuid-ossp", (schema) =>
    schema.registerFunction({
      name: "uuid_generate_v4",
      returns: DataType.uuid,
      implementation: randomUUID,
      impure: true,
    }),
  );
  const namespaces = new Set<string>([]);
  for (const namespace of namespaces) db.createSchema(namespace);
  dataSource = await db.adapters.createTypeormDataSource({
    type: "postgres",
    entities,
  });
  await dataSource.initialize();
  await dataSource.synchronize();
});

afterAll(async () => {
  if (dataSource?.isInitialized) await dataSource.destroy();
});

/** [column, nullable, primary] for every stored column. */
function columns(metadata: EntityMetadata): Array<[string, boolean, boolean]> {
  return metadata.columns
    .map(
      (item) =>
        [item.databaseName, item.isNullable, item.isPrimary] as [
          string,
          boolean,
          boolean,
        ],
    )
    .sort(([left], [right]) => left.localeCompare(right));
}

describe("entity schema matches the contract", () => {
  it("synchronizes every entity into Postgres", () => {
    expect(dataSource.isInitialized).toBe(true);
    expect(dataSource.entityMetadatas).toHaveLength(entities.length);
  });

  describe("GeoBoundaryVersion", () => {
    const metadata = () => dataSource.getMetadata(GeoBoundaryVersionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("geo_boundary_versions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["geometry", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["label_point", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["reference_year", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["verification_state", false, false],
            ["version", false, false],
            ["version_number", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map(
          (key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`,
        )
        .sort();
      expect(keys).toEqual(["unit_id->geo_units"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unit_id,is_current",
          "unique:unit_id,version_number",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geo_boundary_versions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoRelationship", () => {
    const metadata = () => dataSource.getMetadata(GeoRelationshipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("geo_relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["child_id", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["parent_id", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["verification_state", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map(
          (key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`,
        )
        .sort();
      expect(keys).toEqual(["parent_id->geo_units"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["parent_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geo_relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoUnit", () => {
    const metadata = () => dataSource.getMetadata(GeoUnitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("geo_units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_active", false, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["kind", false, false],
            ["level_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["parent_id", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["verification_state", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map(
          (key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`,
        )
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
          "level_id->classification_records",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "parent_id",
          "jurisdiction_id,level_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geo_units" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoUnitChange", () => {
    const metadata = () => dataSource.getMetadata(GeoUnitChangeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("geo_unit_changes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_unit_id", false, false],
            ["source_url", true, false],
            ["target_unit_id", false, false],
            ["tool_or_model", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["verification_state", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map(
          (key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`,
        )
        .sort();
      expect(keys).toEqual(["source_unit_id->geo_units"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["source_unit_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geo_unit_changes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoUnitNameVersion", () => {
    const metadata = () => dataSource.getMetadata(GeoUnitNameVersionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("geo_unit_name_versions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["language", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["verification_state", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map(
          (key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`,
        )
        .sort();
      expect(keys).toEqual(["unit_id->geo_units"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unit_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geo_unit_name_versions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ClassificationRecord", () => {
    const metadata = () => dataSource.getMetadata(ClassificationRecordEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("classification_records");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["label", false, false],
            ["legal_basis", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["order", true, false],
            ["retrieved_at", true, false],
            ["scheme", false, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["verification_state", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map(
          (key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`,
        )
        .sort();
      expect(keys).toEqual(["jurisdiction_id->jurisdictions"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining(["unique:jurisdiction_id,scheme,code"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "classification_records" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Jurisdiction", () => {
    const metadata = () => dataSource.getMetadata(JurisdictionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("jurisdictions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["verification_state", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "jurisdictions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });
});
