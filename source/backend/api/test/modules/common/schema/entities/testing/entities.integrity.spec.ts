import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { DataType, newDb } from "pg-mem";
import type { DataSource, EntityMetadata } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AccountsEntity } from "#/modules/auth/schema/entities/accounts.entity.ts";
import { DelegationRolesEntity } from "#/modules/auth/schema/entities/delegation-roles.entity.ts";
import { DelegationsEntity } from "#/modules/auth/schema/entities/delegations.entity.ts";
import { InvitationsEntity } from "#/modules/auth/schema/entities/invitations.entity.ts";
import { LoginIdentitiesEntity } from "#/modules/auth/schema/entities/login-identities.entity.ts";
import { MembershipsEntity } from "#/modules/auth/schema/entities/memberships.entity.ts";
import { PermissionsEntity } from "#/modules/auth/schema/entities/permissions.entity.ts";
import { RoleAssignmentsEntity } from "#/modules/auth/schema/entities/role-assignments.entity.ts";
import { RolePermissionsEntity } from "#/modules/auth/schema/entities/role-permissions.entity.ts";
import { RolesEntity } from "#/modules/auth/schema/entities/roles.entity.ts";
import { ScopesEntity } from "#/modules/auth/schema/entities/scopes.entity.ts";
import { FileExtensionsEntity } from "#/modules/filesystem/schema/entities/file-extensions.entity.ts";
import { FileRelationsEntity } from "#/modules/filesystem/schema/entities/file-relations.entity.ts";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { FilesEntity } from "#/modules/filesystem/schema/entities/files.entity.ts";
import { FoldersEntity } from "#/modules/filesystem/schema/entities/folders.entity.ts";
import { TaggingsEntity } from "#/modules/filesystem/schema/entities/taggings.entity.ts";
import { TagsEntity } from "#/modules/filesystem/schema/entities/tags.entity.ts";
import { ChangesEntity } from "#/modules/geography/schema/entities/changes.entity.ts";
import { DatasetsEntity } from "#/modules/geography/schema/entities/datasets.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { GeometriesEntity } from "#/modules/geography/schema/entities/geometries.entity.ts";
import { GeographyIdentifiersEntity } from "#/modules/geography/schema/entities/identifiers.entity.ts";
import { GeographyNamesEntity } from "#/modules/geography/schema/entities/names.entity.ts";
import { PlacesEntity } from "#/modules/geography/schema/entities/places.entity.ts";
import { GeographyRelationshipsEntity } from "#/modules/geography/schema/entities/relationships.entity.ts";
import { UnitsEntity } from "#/modules/geography/schema/entities/units.entity.ts";
import { AuthorityScopesEntity } from "#/modules/governance/schema/entities/authority-scopes.entity.ts";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { MandatesEntity } from "#/modules/governance/schema/entities/mandates.entity.ts";
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { GovernanceRelationshipsEntity } from "#/modules/governance/schema/entities/relationships.entity.ts";
import { ContactsEntity } from "#/modules/official/schema/entities/contacts.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { OfficialIdentifiersEntity } from "#/modules/official/schema/entities/identifiers.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { OfficialNamesEntity } from "#/modules/official/schema/entities/names.entity.ts";
import { OfficialRelationshipsEntity } from "#/modules/official/schema/entities/relationships.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { PatternEntity } from "#/modules/reference/schema/entities/pattern.entity.ts";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { TopicEntity } from "#/modules/reference/schema/entities/topic.entity.ts";
import { UnitEntity } from "#/modules/reference/schema/entities/unit.entity.ts";
import { ValueRelationEntity } from "#/modules/reference/schema/entities/value-relation.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ApisEntity } from "#/modules/source/schema/entities/apis.entity.ts";
import { AttributionsEntity } from "#/modules/source/schema/entities/attributions.entity.ts";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DocumentsEntity } from "#/modules/source/schema/entities/documents.entity.ts";
import { EvidenceEntity } from "#/modules/source/schema/entities/evidence.entity.ts";
import { ManifestBindingsEntity } from "#/modules/source/schema/entities/manifest-bindings.entity.ts";
import { ManifestReleasesEntity } from "#/modules/source/schema/entities/manifest-releases.entity.ts";
import { ManifestsEntity } from "#/modules/source/schema/entities/manifests.entity.ts";
import { PublicationReceiptsEntity } from "#/modules/source/schema/entities/publication-receipts.entity.ts";
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import { VerificationsEntity } from "#/modules/source/schema/entities/verifications.entity.ts";
import { WebsitesEntity } from "#/modules/source/schema/entities/websites.entity.ts";

/**
 * Managed by Dryv: every generated entity synchronizes into a Postgres schema (pg-mem) and maps
 * exactly the tables, columns, keys and constraints its contract declares.
 */
const entities = [
  AccountsEntity,
  DelegationRolesEntity,
  DelegationsEntity,
  InvitationsEntity,
  LoginIdentitiesEntity,
  MembershipsEntity,
  PermissionsEntity,
  RoleAssignmentsEntity,
  RolePermissionsEntity,
  RolesEntity,
  ScopesEntity,
  FileExtensionsEntity,
  FileRelationsEntity,
  FileVersionsEntity,
  FilesEntity,
  FoldersEntity,
  TaggingsEntity,
  TagsEntity,
  ChangesEntity,
  DatasetsEntity,
  FeaturesEntity,
  GeometriesEntity,
  GeographyIdentifiersEntity,
  GeographyNamesEntity,
  PlacesEntity,
  GeographyRelationshipsEntity,
  UnitsEntity,
  AuthorityScopesEntity,
  HoldersEntity,
  InstitutionsEntity,
  MandatesEntity,
  OfficesEntity,
  GovernanceRelationshipsEntity,
  ContactsEntity,
  EntitiesEntity,
  OfficialIdentifiersEntity,
  IndividualsEntity,
  OfficialNamesEntity,
  OfficialRelationshipsEntity,
  CountryEntity,
  PatternEntity,
  SchemeEntity,
  TopicEntity,
  UnitEntity,
  ValueEntity,
  ValueRelationEntity,
  ApisEntity,
  AttributionsEntity,
  CapturesEntity,
  CitationsEntity,
  DocumentsEntity,
  EvidenceEntity,
  ManifestBindingsEntity,
  ManifestReleasesEntity,
  ManifestsEntity,
  PublicationReceiptsEntity,
  PublishersEntity,
  SourcesEntity,
  VerificationsEntity,
  WebsitesEntity,
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
  const namespaces = new Set<string>([
    "auth",
    "auth",
    "auth",
    "auth",
    "auth",
    "auth",
    "auth",
    "auth",
    "auth",
    "auth",
    "auth",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "geography",
    "geography",
    "geography",
    "geography",
    "geography",
    "geography",
    "geography",
    "geography",
    "geography",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "official",
    "official",
    "official",
    "official",
    "official",
    "official",
    "reference",
    "reference",
    "reference",
    "reference",
    "reference",
    "reference",
    "reference",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
  ]);
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
      (item) => [item.databaseName, item.isNullable, item.isPrimary] as [string, boolean, boolean],
    )
    .sort(([left], [right]) => left.localeCompare(right));
}

describe("entity schema matches the contract", () => {
  it("synchronizes every entity into Postgres", () => {
    expect(dataSource.isInitialized).toBe(true);
    expect(dataSource.entityMetadatas).toHaveLength(entities.length);
  });

  describe("Accounts", () => {
    const metadata = () => dataSource.getMetadata(AccountsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("accounts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_kind", false, false],
            ["created_at", false, false],
            ["disabled_at", true, false],
            ["display_name", false, false],
            ["id", false, true],
            ["last_authenticated_at", true, false],
            ["person_ref_id", false, false],
            ["status", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."accounts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("DelegationRoles", () => {
    const metadata = () => dataSource.getMetadata(DelegationRolesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("delegation_roles");
      expect(columns(metadata())).toEqual(
        (
          [
            ["delegation_id", false, true],
            ["role_id", false, true],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["delegation_id->auth.delegations", "role_id->auth.roles"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["role_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."delegation_roles" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Delegations", () => {
    const metadata = () => dataSource.getMetadata(DelegationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("delegations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["delegate_account_id", false, false],
            ["delegator_account_id", false, false],
            ["expires_at", true, false],
            ["id", false, true],
            ["revoked_at", true, false],
            ["revoked_by", true, false],
            ["scope_id", false, false],
            ["starts_at", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "delegate_account_id->auth.accounts",
          "delegator_account_id->auth.accounts",
          "revoked_by->auth.accounts",
          "scope_id->auth.scopes",
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
          "delegator_account_id",
          "delegate_account_id",
          "revoked_by",
          "scope_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."delegations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Invitations", () => {
    const metadata = () => dataSource.getMetadata(InvitationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("invitations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["accepted_account_id", true, false],
            ["accepted_at", true, false],
            ["created_at", false, false],
            ["expires_at", true, false],
            ["id", false, true],
            ["institution_ref_id", false, false],
            ["intended_email", false, false],
            ["invited_by", false, false],
            ["revoked_at", true, false],
            ["token_digest", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["accepted_account_id->auth.accounts", "invited_by->auth.accounts"].sort(),
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
        expect.arrayContaining(["invited_by", "accepted_account_id", "unique:token_digest"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."invitations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LoginIdentities", () => {
    const metadata = () => dataSource.getMetadata(LoginIdentitiesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("login_identities");
      expect(columns(metadata())).toEqual(
        (
          [
            ["account_id", false, false],
            ["id", false, true],
            ["issuer", false, false],
            ["last_authenticated_at", true, false],
            ["linked_at", false, false],
            ["subject", false, false],
            ["unlinked_at", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["account_id->auth.accounts"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["account_id", "unique:issuer,subject"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."login_identities" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Memberships", () => {
    const metadata = () => dataSource.getMetadata(MembershipsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("memberships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["account_id", false, false],
            ["ends_at", true, false],
            ["id", false, true],
            ["institution_ref_id", false, false],
            ["revoked_at", true, false],
            ["revoked_by", true, false],
            ["starts_at", true, false],
            ["status", false, false],
            ["verified_at", true, false],
            ["verified_by", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "account_id->auth.accounts",
          "revoked_by->auth.accounts",
          "verified_by->auth.accounts",
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
      expect(indexes).toEqual(expect.arrayContaining(["verified_by", "revoked_by", "account_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."memberships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Permissions", () => {
    const metadata = () => dataSource.getMetadata(PermissionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("permissions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["action", false, false],
            ["code", false, false],
            ["description", true, false],
            ["field_group", true, false],
            ["id", false, true],
            ["is_active", false, false],
            ["resource_type", false, false],
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
        dataSource.query('INSERT INTO "auth"."permissions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("RoleAssignments", () => {
    const metadata = () => dataSource.getMetadata(RoleAssignmentsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("role_assignments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["account_id", false, false],
            ["created_at", false, false],
            ["delegation_id", true, false],
            ["expires_at", true, false],
            ["granted_by", false, false],
            ["id", false, true],
            ["membership_id", true, false],
            ["revocation_reason", true, false],
            ["revoked_at", true, false],
            ["revoked_by", true, false],
            ["role_id", false, false],
            ["scope_id", false, false],
            ["starts_at", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "account_id->auth.accounts",
          "delegation_id->auth.delegations",
          "granted_by->auth.accounts",
          "membership_id->auth.memberships",
          "revoked_by->auth.accounts",
          "role_id->auth.roles",
          "scope_id->auth.scopes",
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
          "membership_id",
          "delegation_id",
          "granted_by",
          "revoked_by",
          "account_id",
          "role_id",
          "scope_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."role_assignments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("RolePermissions", () => {
    const metadata = () => dataSource.getMetadata(RolePermissionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("role_permissions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["granted_at", false, false],
            ["granted_by", false, false],
            ["permission_id", false, true],
            ["role_id", false, true],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "granted_by->auth.accounts",
          "permission_id->auth.permissions",
          "role_id->auth.roles",
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
      expect(indexes).toEqual(expect.arrayContaining(["permission_id", "granted_by"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."role_permissions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Roles", () => {
    const metadata = () => dataSource.getMetadata(RolesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("roles");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["managing_institution_ref_id", true, false],
            ["policy_version", false, false],
            ["protected", false, false],
            ["retired_at", true, false],
            ["title", false, false],
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
      await expect(dataSource.query('INSERT INTO "auth"."roles" DEFAULT VALUES')).rejects.toThrow();
    });
  });

  describe("Scopes", () => {
    const metadata = () => dataSource.getMetadata(ScopesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("scopes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["country_ref_id", true, false],
            ["created_at", false, false],
            ["dataset_ref_id", true, false],
            ["field_group", true, false],
            ["geographic_unit_ref_id", true, false],
            ["id", false, true],
            ["include_descendants", false, false],
            ["institution_ref_id", false, false],
            ["is_global", false, false],
            ["scope_hash", false, false],
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
      expect(indexes).toEqual(expect.arrayContaining(["unique:scope_hash"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "auth"."scopes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FileExtensions", () => {
    const metadata = () => dataSource.getMetadata(FileExtensionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("file_extensions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["content_type", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["extension", false, false],
            ["id", false, true],
            ["updated_at", false, false],
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
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "unique:extension"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."file_extensions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FileRelations", () => {
    const metadata = () => dataSource.getMetadata(FileRelationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("file_relations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["derived_version_id", false, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["processing_provenance", false, false],
            ["source_version_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "derived_version_id->filesystem.file_versions",
          "kind_id->reference.values",
          "source_version_id->filesystem.file_versions",
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
          "unique:source_version_id,derived_version_id,kind_id",
          "derived_version_id",
          "kind_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."file_relations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FileVersions", () => {
    const metadata = () => dataSource.getMetadata(FileVersionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("file_versions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["access", false, false],
            ["content_type", false, false],
            ["created_at", false, false],
            ["created_by_snapshot", false, false],
            ["deleted_at", true, false],
            ["file_extension_id", true, false],
            ["file_id", false, false],
            ["id", false, true],
            ["original_filename", true, false],
            ["pinned", false, false],
            ["provenance", false, false],
            ["revision", false, false],
            ["s3_key", false, false],
            ["sha256", false, false],
            ["size_bytes", false, false],
            ["updated_at", false, false],
            ["verified_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["file_extension_id->filesystem.file_extensions", "file_id->filesystem.files"].sort(),
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
          "unique:file_id,revision",
          "sha256",
          "s3_key",
          "file_extension_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."file_versions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Files", () => {
    const metadata = () => dataSource.getMetadata(FilesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("files");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["current_version_id", true, false],
            ["deleted_at", true, false],
            ["folder_id", false, false],
            ["id", false, true],
            ["name", false, false],
            ["retention", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["current_version_id->filesystem.file_versions", "folder_id->filesystem.folders"].sort(),
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
        expect.arrayContaining(["unique:code", "folder_id", "current_version_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."files" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Folders", () => {
    const metadata = () => dataSource.getMetadata(FoldersEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("folders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["access", false, false],
            ["authorization", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["name", false, false],
            ["parent_id", true, false],
            ["role_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["parent_id->filesystem.folders", "role_id->reference.values"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "parent_id", "role_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."folders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Taggings", () => {
    const metadata = () => dataSource.getMetadata(TaggingsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("taggings");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["file_id", true, false],
            ["folder_id", true, false],
            ["id", false, true],
            ["tag_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "file_id->filesystem.files",
          "folder_id->filesystem.folders",
          "tag_id->filesystem.tags",
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
          "unique:tag_id,file_id",
          "unique:tag_id,folder_id",
          "file_id",
          "folder_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."taggings" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Tags", () => {
    const metadata = () => dataSource.getMetadata(TagsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("tags");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["id", false, true],
            ["title", false, false],
            ["updated_at", false, false],
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
        dataSource.query('INSERT INTO "filesystem"."tags" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Changes", () => {
    const metadata = () => dataSource.getMetadata(ChangesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("changes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["change_kind_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["effective_on", true, false],
            ["explanation", true, false],
            ["id", false, true],
            ["predecessor_feature_id", true, false],
            ["source_ref_id", true, false],
            ["successor_feature_id", true, false],
            ["transformation_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "change_kind_id->reference.values",
          "predecessor_feature_id->geography.features",
          "successor_feature_id->geography.features",
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
          "transformation_id",
          "predecessor_feature_id",
          "successor_feature_id",
          "change_kind_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."changes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Datasets", () => {
    const metadata = () => dataSource.getMetadata(DatasetsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("datasets");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["coverage_feature_id", true, false],
            ["created_at", false, false],
            ["crs", true, false],
            ["deleted_at", true, false],
            ["file_version_ref_id", true, false],
            ["format", false, false],
            ["id", false, true],
            ["quality_notes", true, false],
            ["representation_id", false, false],
            ["resolution", true, false],
            ["resolution_unit_id", true, false],
            ["source_ref_id", true, false],
            ["subject_id", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "coverage_feature_id->geography.features",
          "representation_id->reference.values",
          "resolution_unit_id->reference.units",
          "subject_id->reference.values",
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
          "subject_id",
          "representation_id",
          "coverage_feature_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."datasets" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Features", () => {
    const metadata = () => dataSource.getMetadata(FeaturesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("features");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["feature_type_id", false, false],
            ["id", false, true],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["feature_type_id->reference.values"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "feature_type_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."features" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Geometries", () => {
    const metadata = () => dataSource.getMetadata(GeometriesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("geometries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["feature_id", false, false],
            ["file_version_ref_id", true, false],
            ["geometry", false, false],
            ["geometry_role_id", false, false],
            ["id", false, true],
            ["observed_at", true, false],
            ["source_ref_id", true, false],
            ["srid", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["feature_id->geography.features", "geometry_role_id->reference.values"].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["feature_id", "valid_from,valid_until"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."geometries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Identifiers", () => {
    const metadata = () => dataSource.getMetadata(GeographyIdentifiersEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("identifiers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["external_id", false, false],
            ["feature_id", false, false],
            ["id", false, true],
            ["identifier_scheme_id", false, false],
            ["namespace", true, false],
            ["source_ref_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["feature_id->geography.features", "identifier_scheme_id->reference.values"].sort(),
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
        expect.arrayContaining(["unique:identifier_scheme_id,namespace,external_id", "feature_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."identifiers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Names", () => {
    const metadata = () => dataSource.getMetadata(GeographyNamesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("names");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["feature_id", false, false],
            ["id", false, true],
            ["language_tag", true, false],
            ["name", false, false],
            ["name_kind_id", false, false],
            ["source_ref_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["feature_id->geography.features", "name_kind_id->reference.values"].sort(),
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
        expect.arrayContaining(["feature_id", "name_kind_id", "language_tag"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."names" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Places", () => {
    const metadata = () => dataSource.getMetadata(PlacesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("places");
      expect(columns(metadata())).toEqual(
        (
          [
            ["feature_id", false, true],
            ["is_inhabited", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["feature_id->geography.features"].sort());
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."places" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Relationships", () => {
    const metadata = () => dataSource.getMetadata(GeographyRelationshipsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["object_feature_id", false, false],
            ["relationship_kind_id", false, false],
            ["source_ref_id", true, false],
            ["subject_feature_id", false, false],
            ["system_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "object_feature_id->geography.features",
          "relationship_kind_id->reference.values",
          "subject_feature_id->geography.features",
          "system_id->reference.values",
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
          "subject_feature_id,relationship_kind_id",
          "object_feature_id,relationship_kind_id",
          "valid_from,valid_until",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Units", () => {
    const metadata = () => dataSource.getMetadata(UnitsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["country_id", true, false],
            ["feature_id", false, true],
            ["valid_from", true, false],
            ["valid_until", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["country_id->reference.countries", "feature_id->geography.features"].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["country_id", "valid_from,valid_until"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."units" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("AuthorityScopes", () => {
    const metadata = () => dataSource.getMetadata(AuthorityScopesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("authority_scopes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["authority_kind_id", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["institution_id", true, false],
            ["office_id", true, false],
            ["source_citation_id", true, false],
            ["unit_feature_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "authority_kind_id->reference.values",
          "country_id->reference.countries",
          "institution_id->governance.institutions",
          "office_id->governance.offices",
          "source_citation_id->source.citations",
          "unit_feature_id->geography.units",
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
          "institution_id",
          "office_id",
          "unit_feature_id,valid_from,valid_until",
          "country_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."authority_scopes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Holders", () => {
    const metadata = () => dataSource.getMetadata(HoldersEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("holders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["appointed_by_entity_id", true, false],
            ["appointment_kind_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["individual_id", false, false],
            ["office_id", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "appointed_by_entity_id->official.entities",
          "appointment_kind_id->reference.values",
          "individual_id->official.individuals",
          "office_id->governance.offices",
          "source_citation_id->source.citations",
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
          "office_id,valid_from,valid_until",
          "individual_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."holders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Institutions", () => {
    const metadata = () => dataSource.getMetadata(InstitutionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("institutions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["entity_id", false, false],
            ["id", false, true],
            ["institution_kind_id", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "entity_id->official.entities",
          "institution_kind_id->reference.values",
          "source_citation_id->source.citations",
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
        expect.arrayContaining(["unique:code", "entity_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."institutions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Mandates", () => {
    const metadata = () => dataSource.getMetadata(MandatesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("mandates");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", false, false],
            ["id", false, true],
            ["institution_id", true, false],
            ["mandate_kind_id", false, false],
            ["office_id", true, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "institution_id->governance.institutions",
          "mandate_kind_id->reference.values",
          "office_id->governance.offices",
          "source_citation_id->source.citations",
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
        expect.arrayContaining(["institution_id", "office_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."mandates" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Offices", () => {
    const metadata = () => dataSource.getMetadata(OfficesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("offices");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["institution_id", false, false],
            ["office_kind_id", false, false],
            ["source_citation_id", true, false],
            ["unit_feature_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "institution_id->governance.institutions",
          "office_kind_id->reference.values",
          "source_citation_id->source.citations",
          "unit_feature_id->geography.units",
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
        expect.arrayContaining(["unique:code", "unit_feature_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."offices" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Relationships", () => {
    const metadata = () => dataSource.getMetadata(GovernanceRelationshipsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["object_institution_id", false, false],
            ["relationship_kind_id", false, false],
            ["source_citation_id", true, false],
            ["subject_institution_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "object_institution_id->governance.institutions",
          "relationship_kind_id->reference.values",
          "source_citation_id->source.citations",
          "subject_institution_id->governance.institutions",
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
          "subject_institution_id,relationship_kind_id",
          "object_institution_id,relationship_kind_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Contacts", () => {
    const metadata = () => dataSource.getMetadata(ContactsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("contacts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["entity_id", true, false],
            ["id", false, true],
            ["individual_id", true, false],
            ["kind_id", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["value", false, false],
            ["version", false, false],
            ["visibility_id", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "entity_id->official.entities",
          "individual_id->official.individuals",
          "kind_id->reference.values",
          "source_citation_id->source.citations",
          "visibility_id->reference.values",
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
          "entity_id,kind_id",
          "individual_id,kind_id",
          "visibility_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "official"."contacts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Entities", () => {
    const metadata = () => dataSource.getMetadata(EntitiesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("entities");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["dissolved_on", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["registered_on", true, false],
            ["registration_country_id", true, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "kind_id->reference.values",
          "registration_country_id->reference.countries",
          "source_citation_id->source.citations",
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
          "kind_id",
          "registration_country_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "official"."entities" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Identifiers", () => {
    const metadata = () => dataSource.getMetadata(OfficialIdentifiersEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("identifiers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["entity_id", true, false],
            ["id", false, true],
            ["individual_id", true, false],
            ["issuer_entity_id", true, false],
            ["namespace", true, false],
            ["scheme_id", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["value", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "entity_id->official.entities",
          "individual_id->official.individuals",
          "issuer_entity_id->official.entities",
          "scheme_id->reference.values",
          "source_citation_id->source.citations",
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
          "entity_id",
          "individual_id",
          "unique:scheme_id,issuer_entity_id,namespace,value",
          "scheme_id,value",
          "issuer_entity_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "official"."identifiers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Individuals", () => {
    const metadata = () => dataSource.getMetadata(IndividualsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("individuals");
      expect(columns(metadata())).toEqual(
        (
          [
            ["birth_date", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["death_date", true, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["source_citation_id->source.citations"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "source_citation_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "official"."individuals" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Names", () => {
    const metadata = () => dataSource.getMetadata(OfficialNamesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("names");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["entity_id", true, false],
            ["id", false, true],
            ["individual_id", true, false],
            ["is_preferred", false, false],
            ["language_tag", true, false],
            ["name", false, false],
            ["name_kind_id", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "entity_id->official.entities",
          "individual_id->official.individuals",
          "name_kind_id->reference.values",
          "source_citation_id->source.citations",
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
          "unique:entity_id,language_tag",
          "unique:individual_id,language_tag",
          "entity_id",
          "individual_id",
          "name_kind_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "official"."names" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Relationships", () => {
    const metadata = () => dataSource.getMetadata(OfficialRelationshipsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["from_entity_id", true, false],
            ["from_individual_id", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["share_percentage", true, false],
            ["source_citation_id", true, false],
            ["to_entity_id", true, false],
            ["to_individual_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "from_entity_id->official.entities",
          "from_individual_id->official.individuals",
          "kind_id->reference.values",
          "source_citation_id->source.citations",
          "to_entity_id->official.entities",
          "to_individual_id->official.individuals",
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
          "from_entity_id,kind_id",
          "from_individual_id,kind_id",
          "to_entity_id,kind_id",
          "to_individual_id,kind_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "official"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Country", () => {
    const metadata = () => dataSource.getMetadata(CountryEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("countries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["calling_code", true, false],
            ["code", false, false],
            ["continent_id", true, false],
            ["created_at", false, false],
            ["currency_id", true, false],
            ["deleted_at", true, false],
            ["designation_id", true, false],
            ["established_on", true, false],
            ["id", false, true],
            ["iso_alpha2", false, false],
            ["iso_alpha3", true, false],
            ["iso_numeric", true, false],
            ["name", false, false],
            ["official_name", true, false],
            ["recognition_status_id", true, false],
            ["subregion_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "continent_id->reference.values",
          "currency_id->reference.values",
          "designation_id->reference.values",
          "recognition_status_id->reference.values",
          "subregion_id->reference.values",
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
          "name",
          "unique:iso_alpha2",
          "continent_id",
          "subregion_id",
          "currency_id",
          "recognition_status_id",
          "designation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."countries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Pattern", () => {
    const metadata = () => dataSource.getMetadata(PatternEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("patterns");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["title", false, false],
            ["updated_at", false, false],
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
        dataSource.query('INSERT INTO "reference"."patterns" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Scheme", () => {
    const metadata = () => dataSource.getMetadata(SchemeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("schemes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["owner_snapshot", false, false],
            ["title", false, false],
            ["updated_at", false, false],
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
        dataSource.query('INSERT INTO "reference"."schemes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Topic", () => {
    const metadata = () => dataSource.getMetadata(TopicEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("topics");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["label", false, false],
            ["parent_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["parent_id->reference.topics"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "parent_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."topics" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Unit", () => {
    const metadata = () => dataSource.getMetadata(UnitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["base_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["offset", false, false],
            ["quantity", false, false],
            ["scale", false, false],
            ["symbol", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["base_id->reference.units"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "base_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."units" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Value", () => {
    const metadata = () => dataSource.getMetadata(ValueEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("values");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["label", false, false],
            ["scheme_id", false, false],
            ["supersedes_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["scheme_id->reference.schemes", "supersedes_id->reference.values"].sort(),
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
        expect.arrayContaining(["unique:code", "scheme_id", "supersedes_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."values" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ValueRelation", () => {
    const metadata = () => dataSource.getMetadata(ValueRelationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("value_relations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["relation_kind", false, false],
            ["source_value_id", false, false],
            ["target_value_id", false, false],
            ["valid_from", true, false],
            ["valid_until", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["source_value_id->reference.values", "target_value_id->reference.values"].sort(),
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
          "source_value_id,relation_kind,valid_from",
          "target_value_id,relation_kind",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."value_relations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Apis", () => {
    const metadata = () => dataSource.getMetadata(ApisEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("apis");
      expect(columns(metadata())).toEqual(
        (
          [
            ["base_url", false, false],
            ["created_at", false, false],
            ["credential_binding", true, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["source_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["source_id->source.sources"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:source_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."apis" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Attributions", () => {
    const metadata = () => dataSource.getMetadata(AttributionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("attributions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["assessed_at", false, false],
            ["assessor_snapshot", false, false],
            ["created_at", false, false],
            ["credit", false, false],
            ["deleted_at", true, false],
            ["file_version_id", false, false],
            ["id", false, true],
            ["license_value_id", true, false],
            ["publisher_id", false, false],
            ["rights_statement", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "file_version_id->filesystem.file_versions",
          "license_value_id->reference.values",
          "publisher_id->source.publishers",
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
        expect.arrayContaining(["publisher_id", "file_version_id", "license_value_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."attributions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Captures", () => {
    const metadata = () => dataSource.getMetadata(CapturesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("captures");
      expect(columns(metadata())).toEqual(
        (
          [
            ["content_hash", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["document_id", true, false],
            ["file_version_id", false, false],
            ["id", false, true],
            ["manifest_release_id", true, false],
            ["response_metadata", false, false],
            ["retrieved_at", false, false],
            ["retrieved_url", false, false],
            ["source_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "document_id->source.documents",
          "file_version_id->filesystem.file_versions",
          "manifest_release_id->source.manifest_releases",
          "source_id->source.sources",
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
          "source_id",
          "document_id",
          "file_version_id",
          "manifest_release_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."captures" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Citations", () => {
    const metadata = () => dataSource.getMetadata(CitationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("citations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["capture_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["document_id", true, false],
            ["evidence_id", false, false],
            ["file_version_id", false, false],
            ["id", false, true],
            ["locator", false, false],
            ["locator_kind_id", false, false],
            ["quoted_hash", true, false],
            ["recorded_at", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "capture_id->source.captures",
          "document_id->source.documents",
          "evidence_id->source.evidence",
          "file_version_id->filesystem.file_versions",
          "locator_kind_id->reference.values",
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
          "evidence_id",
          "document_id",
          "capture_id",
          "file_version_id",
          "locator_kind_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."citations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Documents", () => {
    const metadata = () => dataSource.getMetadata(DocumentsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("documents");
      expect(columns(metadata())).toEqual(
        (
          [
            ["canonical_url", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["published_on", true, false],
            ["publisher_id", false, false],
            ["source_id", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "kind_id->reference.values",
          "publisher_id->source.publishers",
          "source_id->source.sources",
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
        expect.arrayContaining(["unique:code", "source_id", "publisher_id", "kind_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."documents" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Evidence", () => {
    const metadata = () => dataSource.getMetadata(EvidenceEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("evidence");
      expect(columns(metadata())).toEqual(
        (
          [
            ["assembled_at", false, false],
            ["assembled_by_snapshot", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["kind_id->reference.values"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "kind_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."evidence" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ManifestBindings", () => {
    const metadata = () => dataSource.getMetadata(ManifestBindingsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("manifest_bindings");
      expect(columns(metadata())).toEqual(
        (
          [
            ["activated_at", false, false],
            ["created_at", false, false],
            ["deactivated_at", true, false],
            ["deleted_at", true, false],
            ["effective_from", false, false],
            ["effective_until", true, false],
            ["id", false, true],
            ["manifest_release_id", false, false],
            ["source_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["manifest_release_id->source.manifest_releases", "source_id->source.sources"].sort(),
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
          "unique:source_id,manifest_release_id,effective_from",
          "manifest_release_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."manifest_bindings" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ManifestReleases", () => {
    const metadata = () => dataSource.getMetadata(ManifestReleasesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("manifest_releases");
      expect(columns(metadata())).toEqual(
        (
          [
            ["approved_at", false, false],
            ["approved_by_snapshot", false, false],
            ["content_hash", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["effective_from", false, false],
            ["effective_until", true, false],
            ["file_version_id", false, false],
            ["id", false, true],
            ["input_schema_code", false, false],
            ["input_schema_version", false, false],
            ["manifest_id", false, false],
            ["release_label", false, false],
            ["required_capabilities", false, false],
            ["status", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["file_version_id->filesystem.file_versions", "manifest_id->source.manifests"].sort(),
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
        expect.arrayContaining(["unique:manifest_id,release_label", "file_version_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."manifest_releases" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Manifests", () => {
    const metadata = () => dataSource.getMetadata(ManifestsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("manifests");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["kind_id->reference.values"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "kind_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."manifests" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PublicationReceipts", () => {
    const metadata = () => dataSource.getMetadata(PublicationReceiptsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("publication_receipts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_snapshot", false, false],
            ["contract_version", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["idempotency_key", false, false],
            ["payload_hash", false, false],
            ["publication_ref_id", false, false],
            ["published_at", false, false],
            ["request_hash", false, false],
            ["result_manifest", false, false],
            ["updated_at", false, false],
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
      expect(indexes).toEqual(
        expect.arrayContaining(["unique:idempotency_key", "unique:publication_ref_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."publication_receipts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Publishers", () => {
    const metadata = () => dataSource.getMetadata(PublishersEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("publishers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["name", false, false],
            ["official_entity_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "country_id->reference.countries",
          "kind_id->reference.values",
          "official_entity_id->official.entities",
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
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "kind_id", "country_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."publishers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Sources", () => {
    const metadata = () => dataSource.getMetadata(SourcesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("sources");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["official_entity_id", true, false],
            ["publisher_id", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "kind_id->reference.values",
          "official_entity_id->official.entities",
          "publisher_id->source.publishers",
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
      expect(indexes).toEqual(expect.arrayContaining(["unique:code", "publisher_id", "kind_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."sources" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Verifications", () => {
    const metadata = () => dataSource.getMetadata(VerificationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("verifications");
      expect(columns(metadata())).toEqual(
        (
          [
            ["assessed_at", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["evidence_id", false, false],
            ["explanation", false, false],
            ["id", false, true],
            ["method_id", false, false],
            ["outcome", false, false],
            ["reviewer_snapshot", false, false],
            ["supersedes_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "evidence_id->source.evidence",
          "method_id->reference.values",
          "supersedes_id->source.verifications",
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
        expect.arrayContaining(["evidence_id", "method_id", "supersedes_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."verifications" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Websites", () => {
    const metadata = () => dataSource.getMetadata(WebsitesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("websites");
      expect(columns(metadata())).toEqual(
        (
          [
            ["canonical_url", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["source_id", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["source_id->source.sources"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:source_id", "unique:canonical_url"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."websites" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });
});
