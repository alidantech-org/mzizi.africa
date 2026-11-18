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
import { BeneficiariesEntity } from "#/modules/civic/schema/entities/beneficiaries.entity.ts";
import { BidsEntity } from "#/modules/civic/schema/entities/bids.entity.ts";
import { ContractsEntity } from "#/modules/civic/schema/entities/contracts.entity.ts";
import { DeliveriesEntity } from "#/modules/civic/schema/entities/deliveries.entity.ts";
import { FacilitiesEntity } from "#/modules/civic/schema/entities/facilities.entity.ts";
import { ProcurementsEntity } from "#/modules/civic/schema/entities/procurements.entity.ts";
import { ProjectFeaturesEntity } from "#/modules/civic/schema/entities/project-features.entity.ts";
import { ProjectsEntity } from "#/modules/civic/schema/entities/projects.entity.ts";
import { ServicesEntity } from "#/modules/civic/schema/entities/services.entity.ts";
import { CalendarsEntity } from "#/modules/event/schema/entities/calendars.entity.ts";
import { EventChangesEntity } from "#/modules/event/schema/entities/changes.entity.ts";
import { EventsEntity } from "#/modules/event/schema/entities/events.entity.ts";
import { ItemsEntity } from "#/modules/event/schema/entities/items.entity.ts";
import { EventNamesEntity } from "#/modules/event/schema/entities/names.entity.ts";
import { OccurrencesEntity } from "#/modules/event/schema/entities/occurrences.entity.ts";
import { ParticipantsEntity } from "#/modules/event/schema/entities/participants.entity.ts";
import { RulesEntity } from "#/modules/event/schema/entities/rules.entity.ts";
import { SchedulesEntity } from "#/modules/event/schema/entities/schedules.entity.ts";
import { SeasonsEntity } from "#/modules/event/schema/entities/seasons.entity.ts";
import { SubjectsEntity } from "#/modules/event/schema/entities/subjects.entity.ts";
import { VenuesEntity } from "#/modules/event/schema/entities/venues.entity.ts";
import { ContentTagsEntity } from "#/modules/filesystem/schema/entities/content-tags.entity.ts";
import { ContentsEntity } from "#/modules/filesystem/schema/entities/contents.entity.ts";
import { FileExtensionsEntity } from "#/modules/filesystem/schema/entities/file-extensions.entity.ts";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { FilesEntity } from "#/modules/filesystem/schema/entities/files.entity.ts";
import { FoldersEntity } from "#/modules/filesystem/schema/entities/folders.entity.ts";
import { MediaEntity } from "#/modules/filesystem/schema/entities/media.entity.ts";
import { TaggingsEntity } from "#/modules/filesystem/schema/entities/taggings.entity.ts";
import { TagsEntity } from "#/modules/filesystem/schema/entities/tags.entity.ts";
import { AppropriationsEntity } from "#/modules/finance/schema/entities/appropriations.entity.ts";
import { BudgetVersionsEntity } from "#/modules/finance/schema/entities/budget-versions.entity.ts";
import { BudgetsEntity } from "#/modules/finance/schema/entities/budgets.entity.ts";
import { DebtsEntity } from "#/modules/finance/schema/entities/debts.entity.ts";
import { FiscalPeriodsEntity } from "#/modules/finance/schema/entities/fiscal-periods.entity.ts";
import { FlowsEntity } from "#/modules/finance/schema/entities/flows.entity.ts";
import { FundsEntity } from "#/modules/finance/schema/entities/funds.entity.ts";
import { AssetsEntity } from "#/modules/geography/schema/entities/assets.entity.ts";
import { GeographyChangesEntity } from "#/modules/geography/schema/entities/changes.entity.ts";
import { ClassificationsEntity } from "#/modules/geography/schema/entities/classifications.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { GeometriesEntity } from "#/modules/geography/schema/entities/geometries.entity.ts";
import { GeographyIdentifiersEntity } from "#/modules/geography/schema/entities/identifiers.entity.ts";
import { LevelsEntity } from "#/modules/geography/schema/entities/levels.entity.ts";
import { GeographyNamesEntity } from "#/modules/geography/schema/entities/names.entity.ts";
import { GeographyRelationshipsEntity } from "#/modules/geography/schema/entities/relationships.entity.ts";
import { AgendaEntity } from "#/modules/governance/schema/entities/agenda.entity.ts";
import { AuthorityScopesEntity } from "#/modules/governance/schema/entities/authority-scopes.entity.ts";
import { BillsEntity } from "#/modules/governance/schema/entities/bills.entity.ts";
import { HansardsEntity } from "#/modules/governance/schema/entities/hansards.entity.ts";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { MandatesEntity } from "#/modules/governance/schema/entities/mandates.entity.ts";
import { MotionsEntity } from "#/modules/governance/schema/entities/motions.entity.ts";
import { ObligationsEntity } from "#/modules/governance/schema/entities/obligations.entity.ts";
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { GovernanceRelationshipsEntity } from "#/modules/governance/schema/entities/relationships.entity.ts";
import { ReportsEntity } from "#/modules/governance/schema/entities/reports.entity.ts";
import { SittingsEntity } from "#/modules/governance/schema/entities/sittings.entity.ts";
import { SpeechesEntity } from "#/modules/governance/schema/entities/speeches.entity.ts";
import { StagesEntity } from "#/modules/governance/schema/entities/stages.entity.ts";
import { TermsEntity } from "#/modules/governance/schema/entities/terms.entity.ts";
import { VotesEntity } from "#/modules/governance/schema/entities/votes.entity.ts";
import { LegalEditionsEntity } from "#/modules/legal/schema/entities/editions.entity.ts";
import { EffectsEntity } from "#/modules/legal/schema/entities/effects.entity.ts";
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { LegalNamesEntity } from "#/modules/legal/schema/entities/names.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { ReferencesEntity } from "#/modules/legal/schema/entities/references.entity.ts";
import { LegalRelationshipsEntity } from "#/modules/legal/schema/entities/relationships.entity.ts";
import { TranslationsEntity } from "#/modules/legal/schema/entities/translations.entity.ts";
import { WordingsEntity } from "#/modules/legal/schema/entities/wordings.entity.ts";
import { BrandingEntity } from "#/modules/official/schema/entities/branding.entity.ts";
import { ContactsEntity } from "#/modules/official/schema/entities/contacts.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { OfficialIdentifiersEntity } from "#/modules/official/schema/entities/identifiers.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { OfficialNamesEntity } from "#/modules/official/schema/entities/names.entity.ts";
import { OfficialRelationshipsEntity } from "#/modules/official/schema/entities/relationships.entity.ts";
import { CopyEntity } from "#/modules/reference/schema/entities/copy.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { LanguageNameEntity } from "#/modules/reference/schema/entities/language-name.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { PatternEntity } from "#/modules/reference/schema/entities/pattern.entity.ts";
import { SchemeEntity } from "#/modules/reference/schema/entities/scheme.entity.ts";
import { TopicEntity } from "#/modules/reference/schema/entities/topic.entity.ts";
import { UnitEntity } from "#/modules/reference/schema/entities/unit.entity.ts";
import { ValueLabelEntity } from "#/modules/reference/schema/entities/value-label.entity.ts";
import { ValueRelationEntity } from "#/modules/reference/schema/entities/value-relation.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { AddressesEntity } from "#/modules/source/schema/entities/addresses.entity.ts";
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { AttributionsEntity } from "#/modules/source/schema/entities/attributions.entity.ts";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { CoverageEntity } from "#/modules/source/schema/entities/coverage.entity.ts";
import { DiscoveriesEntity } from "#/modules/source/schema/entities/discoveries.entity.ts";
import { DomainsEntity } from "#/modules/source/schema/entities/domains.entity.ts";
import { SourceEditionsEntity } from "#/modules/source/schema/entities/editions.entity.ts";
import { LinksEntity } from "#/modules/source/schema/entities/links.entity.ts";
import { ProductsEntity } from "#/modules/source/schema/entities/products.entity.ts";
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import { SourceRelationshipsEntity } from "#/modules/source/schema/entities/relationships.entity.ts";
import { SlugsEntity } from "#/modules/source/schema/entities/slugs.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import { VerificationsEntity } from "#/modules/source/schema/entities/verifications.entity.ts";

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
  BeneficiariesEntity,
  BidsEntity,
  ContractsEntity,
  DeliveriesEntity,
  FacilitiesEntity,
  ProcurementsEntity,
  ProjectFeaturesEntity,
  ProjectsEntity,
  ServicesEntity,
  CalendarsEntity,
  EventChangesEntity,
  EventsEntity,
  ItemsEntity,
  EventNamesEntity,
  OccurrencesEntity,
  ParticipantsEntity,
  RulesEntity,
  SchedulesEntity,
  SeasonsEntity,
  SubjectsEntity,
  VenuesEntity,
  ContentTagsEntity,
  ContentsEntity,
  FileExtensionsEntity,
  FileVersionsEntity,
  FilesEntity,
  FoldersEntity,
  MediaEntity,
  TaggingsEntity,
  TagsEntity,
  AppropriationsEntity,
  BudgetVersionsEntity,
  BudgetsEntity,
  DebtsEntity,
  FiscalPeriodsEntity,
  FlowsEntity,
  FundsEntity,
  AssetsEntity,
  GeographyChangesEntity,
  ClassificationsEntity,
  FeaturesEntity,
  GeometriesEntity,
  GeographyIdentifiersEntity,
  LevelsEntity,
  GeographyNamesEntity,
  GeographyRelationshipsEntity,
  AgendaEntity,
  AuthorityScopesEntity,
  BillsEntity,
  HansardsEntity,
  HoldersEntity,
  InstitutionsEntity,
  MandatesEntity,
  MotionsEntity,
  ObligationsEntity,
  OfficesEntity,
  GovernanceRelationshipsEntity,
  ReportsEntity,
  SittingsEntity,
  SpeechesEntity,
  StagesEntity,
  TermsEntity,
  VotesEntity,
  LegalEditionsEntity,
  EffectsEntity,
  InstrumentsEntity,
  LegalNamesEntity,
  ProvisionsEntity,
  ReferencesEntity,
  LegalRelationshipsEntity,
  TranslationsEntity,
  WordingsEntity,
  BrandingEntity,
  ContactsEntity,
  EntitiesEntity,
  OfficialIdentifiersEntity,
  IndividualsEntity,
  OfficialNamesEntity,
  OfficialRelationshipsEntity,
  CopyEntity,
  CountryEntity,
  LanguageEntity,
  LanguageNameEntity,
  PatternEntity,
  SchemeEntity,
  TopicEntity,
  UnitEntity,
  ValueEntity,
  ValueLabelEntity,
  ValueRelationEntity,
  AddressesEntity,
  ArtifactsEntity,
  AttributionsEntity,
  CapturesEntity,
  CitationsEntity,
  CoverageEntity,
  DiscoveriesEntity,
  DomainsEntity,
  SourceEditionsEntity,
  LinksEntity,
  ProductsEntity,
  PublishersEntity,
  SourceRelationshipsEntity,
  SlugsEntity,
  SourcesEntity,
  VerificationsEntity,
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
    "civic",
    "civic",
    "civic",
    "civic",
    "civic",
    "civic",
    "civic",
    "civic",
    "civic",
    "event",
    "event",
    "event",
    "event",
    "event",
    "event",
    "event",
    "event",
    "event",
    "event",
    "event",
    "event",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "filesystem",
    "finance",
    "finance",
    "finance",
    "finance",
    "finance",
    "finance",
    "finance",
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
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "legal",
    "legal",
    "legal",
    "legal",
    "legal",
    "legal",
    "legal",
    "legal",
    "legal",
    "official",
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
    "source",
    "source",
  ]);
  for (const namespace of namespaces) db.createSchema(namespace);
  db.registerExtension("postgis", (schema) =>
    schema.registerEquivalentType({
      name: "geometry",
      equivalentTo: DataType.jsonb,
      isValid: () => true,
    }),
  );
  dataSource = await db.adapters.createTypeormDataSource({
    type: "postgres",
    entities,
  });
  await dataSource.initialize();
  // pg-mem can synchronize a geometry stand-in without PostGIS type modifiers.
  const createFullType = dataSource.driver.createFullType.bind(dataSource.driver);
  dataSource.driver.createFullType = (column) =>
    column.type === "geometry" ? "geometry" : createFullType(column);
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

  describe("Beneficiaries", () => {
    const metadata = () => dataSource.getMetadata(BeneficiariesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("beneficiaries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["benefit_kind_id", false, false],
            ["code", false, false],
            ["contract_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["procurement_id", true, false],
            ["project_id", true, false],
            ["share_percent", true, false],
            ["source_citation_id", true, false],
            ["subject_id", false, false],
            ["subject_table", false, false],
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
          "benefit_kind_id->reference.values",
          "contract_id->civic.contracts",
          "procurement_id->civic.procurements",
          "project_id->civic.projects",
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
          "subject_table,subject_id",
          "project_id",
          "procurement_id",
          "contract_id",
          "benefit_kind_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."beneficiaries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Bids", () => {
    const metadata = () => dataSource.getMetadata(BidsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("bids");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_minor_units", true, false],
            ["bidder_entity_id", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["currency_id", true, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["outcome_id", false, false],
            ["procurement_id", false, false],
            ["source_citation_id", true, false],
            ["submitted_on", true, false],
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
          "bidder_entity_id->official.entities",
          "currency_id->reference.values",
          "outcome_id->reference.values",
          "procurement_id->civic.procurements",
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
        expect.arrayContaining(["procurement_id", "bidder_entity_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(dataSource.query('INSERT INTO "civic"."bids" DEFAULT VALUES')).rejects.toThrow();
    });
  });

  describe("Contracts", () => {
    const metadata = () => dataSource.getMetadata(ContractsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("contracts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_minor_units", false, false],
            ["code", false, false],
            ["contractor_entity_id", false, false],
            ["created_at", false, false],
            ["currency_id", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["nature_id", true, false],
            ["procurement_id", true, false],
            ["project_id", true, false],
            ["signed_on", true, false],
            ["source_citation_id", true, false],
            ["status_id", false, false],
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
          "contractor_entity_id->official.entities",
          "currency_id->reference.values",
          "nature_id->reference.values",
          "procurement_id->civic.procurements",
          "project_id->civic.projects",
          "source_citation_id->source.citations",
          "status_id->reference.values",
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
        expect.arrayContaining(["procurement_id", "project_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."contracts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Deliveries", () => {
    const metadata = () => dataSource.getMetadata(DeliveriesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("deliveries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_minor_units", true, false],
            ["code", false, false],
            ["contract_id", false, false],
            ["created_at", false, false],
            ["currency_id", true, false],
            ["deleted_at", true, false],
            ["delivered_on", true, false],
            ["delivery_kind_id", false, false],
            ["id", false, true],
            ["source_citation_id", true, false],
            ["unit_feature_id", true, false],
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
          "contract_id->civic.contracts",
          "currency_id->reference.values",
          "delivery_kind_id->reference.values",
          "source_citation_id->source.citations",
          "unit_feature_id->geography.features",
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
          "contract_id,delivered_on",
          "unit_feature_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."deliveries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Facilities", () => {
    const metadata = () => dataSource.getMetadata(FacilitiesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("facilities");
      expect(columns(metadata())).toEqual(
        (
          [
            ["closed_on", true, false],
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["facility_class_id", false, false],
            ["feature_id", false, false],
            ["id", false, true],
            ["opened_on", true, false],
            ["operator_entity_id", true, false],
            ["owner_entity_id", true, false],
            ["ownership_id", true, false],
            ["responsible_institution_id", true, false],
            ["source_citation_id", true, false],
            ["status_id", false, false],
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
          "facility_class_id->reference.values",
          "feature_id->geography.features",
          "operator_entity_id->official.entities",
          "owner_entity_id->official.entities",
          "ownership_id->reference.values",
          "responsible_institution_id->governance.institutions",
          "source_citation_id->source.citations",
          "status_id->reference.values",
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
          "unique:feature_id",
          "facility_class_id",
          "operator_entity_id",
          "owner_entity_id",
          "responsible_institution_id",
          "status_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."facilities" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Procurements", () => {
    const metadata = () => dataSource.getMetadata(ProcurementsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("procurements");
      expect(columns(metadata())).toEqual(
        (
          [
            ["awarded_on", true, false],
            ["buyer_entity_id", false, false],
            ["category_id", true, false],
            ["closes_on", true, false],
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["nature_id", true, false],
            ["procedure_kind_id", false, false],
            ["project_id", true, false],
            ["published_on", true, false],
            ["reference", true, false],
            ["source_citation_id", true, false],
            ["status_id", true, false],
            ["title", true, false],
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
          "buyer_entity_id->official.entities",
          "category_id->reference.values",
          "country_id->reference.countries",
          "nature_id->reference.values",
          "procedure_kind_id->reference.values",
          "project_id->civic.projects",
          "source_citation_id->source.citations",
          "status_id->reference.values",
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
      expect(indexes).toEqual(expect.arrayContaining(["buyer_entity_id", "source_citation_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."procurements" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ProjectFeatures", () => {
    const metadata = () => dataSource.getMetadata(ProjectFeaturesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("project_features");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["feature_id", false, false],
            ["feature_kind_id", false, false],
            ["id", false, true],
            ["project_id", false, false],
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
          "feature_id->geography.features",
          "feature_kind_id->reference.values",
          "project_id->civic.projects",
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
          "unique:project_id,feature_id,feature_kind_id",
          "feature_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."project_features" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Projects", () => {
    const metadata = () => dataSource.getMetadata(ProjectsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("projects");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["completed_on", true, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", false, false],
            ["id", false, true],
            ["implementing_entity_id", true, false],
            ["location", true, false],
            ["name", false, false],
            ["responsible_institution_id", true, false],
            ["scope_unit_feature_id", true, false],
            ["source_citation_id", true, false],
            ["sponsor_entity_id", true, false],
            ["started_on", true, false],
            ["status_id", false, false],
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
          "implementing_entity_id->official.entities",
          "responsible_institution_id->governance.institutions",
          "scope_unit_feature_id->geography.features",
          "source_citation_id->source.citations",
          "sponsor_entity_id->official.entities",
          "status_id->reference.values",
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
          "status_id",
          "responsible_institution_id",
          "scope_unit_feature_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."projects" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Services", () => {
    const metadata = () => dataSource.getMetadata(ServicesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("services");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", false, false],
            ["ends_on", true, false],
            ["id", false, true],
            ["name", false, false],
            ["place_feature_id", true, false],
            ["provider_entity_id", false, false],
            ["responsible_institution_id", true, false],
            ["scope_unit_feature_id", true, false],
            ["service_kind_id", false, false],
            ["source_citation_id", true, false],
            ["starts_on", true, false],
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
          "place_feature_id->geography.features",
          "provider_entity_id->official.entities",
          "responsible_institution_id->governance.institutions",
          "scope_unit_feature_id->geography.features",
          "service_kind_id->reference.values",
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
          "provider_entity_id",
          "responsible_institution_id",
          "place_feature_id",
          "scope_unit_feature_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."services" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Calendars", () => {
    const metadata = () => dataSource.getMetadata(CalendarsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("calendars");
      expect(columns(metadata())).toEqual(
        (
          [
            ["calendar_kind_id", false, false],
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["id", false, true],
            ["is_observed", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["year_start_day", true, false],
            ["year_start_month", true, false],
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
          "calendar_kind_id->reference.values",
          "country_id->reference.countries",
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
        expect.arrayContaining(["country_id", "calendar_kind_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."calendars" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Changes", () => {
    const metadata = () => dataSource.getMetadata(EventChangesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("changes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["authority_entity_id", true, false],
            ["basis_provision_id", true, false],
            ["change_kind_id", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["decided_on", true, false],
            ["deleted_at", true, false],
            ["explanation", true, false],
            ["from_on", true, false],
            ["id", false, true],
            ["occurrence_id", false, false],
            ["reason_id", true, false],
            ["replacement_occurrence_id", true, false],
            ["source_citation_id", true, false],
            ["to_on", true, false],
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
          "authority_entity_id->official.entities",
          "basis_provision_id->legal.provisions",
          "change_kind_id->reference.values",
          "occurrence_id->event.occurrences",
          "reason_id->reference.values",
          "replacement_occurrence_id->event.occurrences",
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
          "occurrence_id,decided_on",
          "change_kind_id",
          "reason_id",
          "authority_entity_id",
          "basis_provision_id",
          "replacement_occurrence_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."changes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Events", () => {
    const metadata = () => dataSource.getMetadata(EventsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("events");
      expect(columns(metadata())).toEqual(
        (
          [
            ["basis_provision_id", true, false],
            ["calendar_id", true, false],
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["event_kind_id", false, false],
            ["id", false, true],
            ["organiser_entity_id", true, false],
            ["scope_feature_id", true, false],
            ["scope_level_kind_id", true, false],
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
          "basis_provision_id->legal.provisions",
          "calendar_id->event.calendars",
          "country_id->reference.countries",
          "event_kind_id->reference.values",
          "organiser_entity_id->official.entities",
          "scope_feature_id->geography.features",
          "scope_level_kind_id->reference.values",
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
          "country_id,event_kind_id",
          "scope_feature_id",
          "organiser_entity_id",
          "basis_provision_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."events" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Items", () => {
    const metadata = () => dataSource.getMetadata(ItemsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("items");
      expect(columns(metadata())).toEqual(
        (
          [
            ["counts_working_days", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["event_id", false, false],
            ["id", false, true],
            ["note", true, false],
            ["occurrence_id", true, false],
            ["offset_days", true, false],
            ["position", false, false],
            ["schedule_id", false, false],
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
          "event_id->event.events",
          "occurrence_id->event.occurrences",
          "schedule_id->event.schedules",
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
        expect.arrayContaining(["unique:schedule_id,position", "event_id", "occurrence_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."items" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Names", () => {
    const metadata = () => dataSource.getMetadata(EventNamesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("names");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["event_id", false, false],
            ["id", false, true],
            ["is_preferred", false, false],
            ["language_id", false, false],
            ["name", false, false],
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
      expect(keys).toEqual(["event_id->event.events", "language_id->reference.languages"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining(["unique:event_id,language_id,name", "language_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."names" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Occurrences", () => {
    const metadata = () => dataSource.getMetadata(OccurrencesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("occurrences");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actual_ends_on", true, false],
            ["actual_starts_on", true, false],
            ["code", false, false],
            ["continues_occurrence_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["event_id", false, false],
            ["format_id", true, false],
            ["id", false, true],
            ["is_all_day", false, false],
            ["knowledge_id", false, false],
            ["organiser_entity_id", true, false],
            ["planned_ends_on", true, false],
            ["planned_starts_on", false, false],
            ["source_citation_id", true, false],
            ["starts_at", true, false],
            ["status_id", false, false],
            ["timezone", true, false],
            ["updated_at", false, false],
            ["venue_feature_id", true, false],
            ["venue_note", true, false],
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
          "continues_occurrence_id->event.occurrences",
          "event_id->event.events",
          "format_id->reference.values",
          "knowledge_id->reference.values",
          "organiser_entity_id->official.entities",
          "source_citation_id->source.citations",
          "status_id->reference.values",
          "venue_feature_id->geography.features",
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
          "event_id,planned_starts_on",
          "status_id",
          "knowledge_id",
          "venue_feature_id",
          "organiser_entity_id",
          "continues_occurrence_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."occurrences" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Participants", () => {
    const metadata = () => dataSource.getMetadata(ParticipantsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("participants");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["entity_id", true, false],
            ["id", false, true],
            ["individual_id", true, false],
            ["occurrence_id", false, false],
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
      expect(keys).toEqual(
        [
          "entity_id->official.entities",
          "individual_id->official.individuals",
          "occurrence_id->event.occurrences",
          "role_id->reference.values",
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
        expect.arrayContaining(["occurrence_id", "entity_id", "individual_id", "role_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."participants" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Rules", () => {
    const metadata = () => dataSource.getMetadata(RulesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("rules");
      expect(columns(metadata())).toEqual(
        (
          [
            ["adjustment_id", true, false],
            ["anchor_on", true, false],
            ["created_at", false, false],
            ["day_of_month", true, false],
            ["deleted_at", true, false],
            ["event_id", false, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["interval_years", true, false],
            ["month", true, false],
            ["nth_weekday", true, false],
            ["rrule", true, false],
            ["rule_kind_id", false, false],
            ["source_citation_id", true, false],
            ["to_year", true, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["weekday", true, false],
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
          "adjustment_id->reference.values",
          "event_id->event.events",
          "rule_kind_id->reference.values",
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
        expect.arrayContaining(["event_id", "rule_kind_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."rules" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Schedules", () => {
    const metadata = () => dataSource.getMetadata(SchedulesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("schedules");
      expect(columns(metadata())).toEqual(
        (
          [
            ["anchor_event_id", true, false],
            ["anchor_on", true, false],
            ["basis_provision_id", true, false],
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["issuer_entity_id", true, false],
            ["published_on", true, false],
            ["schedule_kind_id", false, false],
            ["source_citation_id", true, false],
            ["status_id", false, false],
            ["supersedes_schedule_id", true, false],
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
          "anchor_event_id->event.events",
          "basis_provision_id->legal.provisions",
          "country_id->reference.countries",
          "issuer_entity_id->official.entities",
          "schedule_kind_id->reference.values",
          "source_citation_id->source.citations",
          "status_id->reference.values",
          "supersedes_schedule_id->event.schedules",
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
          "country_id,schedule_kind_id",
          "anchor_event_id",
          "issuer_entity_id",
          "status_id",
          "supersedes_schedule_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."schedules" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Seasons", () => {
    const metadata = () => dataSource.getMetadata(SeasonsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("seasons");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["country_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["end_day", true, false],
            ["end_month", false, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["is_natural", false, false],
            ["scope_feature_id", true, false],
            ["season_kind_id", false, false],
            ["source_citation_id", true, false],
            ["start_day", true, false],
            ["start_month", false, false],
            ["to_year", true, false],
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
          "scope_feature_id->geography.features",
          "season_kind_id->reference.values",
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
          "country_id,season_kind_id",
          "scope_feature_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."seasons" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Subjects", () => {
    const metadata = () => dataSource.getMetadata(SubjectsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("subjects");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["event_id", false, false],
            ["id", false, true],
            ["role_id", false, false],
            ["subject_id", false, false],
            ["subject_table", false, false],
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
      expect(keys).toEqual(["event_id->event.events", "role_id->reference.values"].sort());
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
          "unique:event_id,subject_table,subject_id,role_id",
          "subject_table,subject_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."subjects" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Venues", () => {
    const metadata = () => dataSource.getMetadata(VenuesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("venues");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["feature_id", false, false],
            ["id", false, true],
            ["note", true, false],
            ["occurrence_id", false, false],
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
      expect(keys).toEqual(
        [
          "feature_id->geography.features",
          "occurrence_id->event.occurrences",
          "role_id->reference.values",
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
          "unique:occurrence_id,feature_id,role_id",
          "feature_id",
          "role_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "event"."venues" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ContentTags", () => {
    const metadata = () => dataSource.getMetadata(ContentTagsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("content_tags");
      expect(columns(metadata())).toEqual(
        (
          [
            ["content_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
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
      expect(keys).toEqual(["content_id->filesystem.contents", "tag_id->filesystem.tags"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["unique:content_id,tag_id", "tag_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."content_tags" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Contents", () => {
    const metadata = () => dataSource.getMetadata(ContentsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("contents");
      expect(columns(metadata())).toEqual(
        (
          [
            ["body", false, false],
            ["category_id", false, false],
            ["classification_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["file_version_id", true, false],
            ["id", false, true],
            ["is_development_text", false, false],
            ["language_id", false, false],
            ["slug", false, false],
            ["subject_id", false, false],
            ["subject_table", false, false],
            ["summary", true, false],
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
          "category_id->reference.values",
          "classification_id->reference.values",
          "file_version_id->filesystem.file_versions",
          "language_id->reference.languages",
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
          "unique:slug,language_id",
          "subject_table,subject_id",
          "category_id",
          "classification_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."contents" DEFAULT VALUES'),
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
      expect(indexes).toEqual(expect.arrayContaining(["unique:extension"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."file_extensions" DEFAULT VALUES'),
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
      expect(indexes).toEqual(expect.arrayContaining(["folder_id", "current_version_id"]));
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
      expect(indexes).toEqual(expect.arrayContaining(["parent_id", "role_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."folders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Media", () => {
    const metadata = () => dataSource.getMetadata(MediaEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("media");
      expect(columns(metadata())).toEqual(
        (
          [
            ["alt_text", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["external_url", true, false],
            ["file_version_id", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["platform_id", true, false],
            ["position", true, false],
            ["purpose", true, false],
            ["subject_id", false, false],
            ["subject_table", false, false],
            ["thumbnail_url", true, false],
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
          "file_version_id->filesystem.file_versions",
          "kind_id->reference.values",
          "platform_id->reference.values",
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
        expect.arrayContaining(["subject_table,subject_id", "kind_id", "file_version_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."media" DEFAULT VALUES'),
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
      expect(indexes).toEqual(expect.arrayContaining([]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."tags" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Appropriations", () => {
    const metadata = () => dataSource.getMetadata(AppropriationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("appropriations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_minor_units", false, false],
            ["budget_version_id", false, false],
            ["classification_id", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["currency_id", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["parent_appropriation_id", true, false],
            ["project_id", true, false],
            ["recipient_entity_id", true, false],
            ["source_citation_id", true, false],
            ["unit_feature_id", true, false],
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
          "budget_version_id->finance.budget_versions",
          "classification_id->reference.values",
          "currency_id->reference.values",
          "parent_appropriation_id->finance.appropriations",
          "project_id->civic.projects",
          "recipient_entity_id->official.entities",
          "source_citation_id->source.citations",
          "unit_feature_id->geography.features",
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
          "budget_version_id",
          "parent_appropriation_id",
          "project_id",
          "unit_feature_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."appropriations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("BudgetVersions", () => {
    const metadata = () => dataSource.getMetadata(BudgetVersionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("budget_versions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["budget_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["released_on", true, false],
            ["revision", false, false],
            ["source_citation_id", true, false],
            ["status_id", false, false],
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
          "budget_id->finance.budgets",
          "source_citation_id->source.citations",
          "status_id->reference.values",
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
        expect.arrayContaining(["unique:budget_id,revision", "status_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."budget_versions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Budgets", () => {
    const metadata = () => dataSource.getMetadata(BudgetsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("budgets");
      expect(columns(metadata())).toEqual(
        (
          [
            ["budget_kind_id", false, false],
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["fiscal_period_id", false, false],
            ["government_entity_id", true, false],
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
      expect(keys).toEqual(
        [
          "budget_kind_id->reference.values",
          "country_id->reference.countries",
          "fiscal_period_id->finance.fiscal_periods",
          "government_entity_id->official.entities",
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
      expect(indexes).toEqual(expect.arrayContaining(["fiscal_period_id", "source_citation_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."budgets" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Debts", () => {
    const metadata = () => dataSource.getMetadata(DebtsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("debts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_minor_units", false, false],
            ["borrower_entity_id", false, false],
            ["code", false, false],
            ["contracted_on", true, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["currency_id", false, false],
            ["debt_kind_id", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["lender_entity_id", true, false],
            ["maturity_on", true, false],
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
          "borrower_entity_id->official.entities",
          "country_id->reference.countries",
          "currency_id->reference.values",
          "debt_kind_id->reference.values",
          "lender_entity_id->official.entities",
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
        expect.arrayContaining(["borrower_entity_id", "maturity_on", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."debts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FiscalPeriods", () => {
    const metadata = () => dataSource.getMetadata(FiscalPeriodsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("fiscal_periods");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["ends_on", false, false],
            ["id", false, true],
            ["period_kind_id", false, false],
            ["source_citation_id", true, false],
            ["starts_on", false, false],
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
          "period_kind_id->reference.values",
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
      expect(indexes).toEqual(expect.arrayContaining(["starts_on,ends_on", "source_citation_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."fiscal_periods" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Flows", () => {
    const metadata = () => dataSource.getMetadata(FlowsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("flows");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_minor_units", false, false],
            ["appropriation_id", true, false],
            ["code", false, false],
            ["contract_id", true, false],
            ["counterparty_entity_id", true, false],
            ["created_at", false, false],
            ["currency_id", false, false],
            ["debt_id", true, false],
            ["deleted_at", true, false],
            ["expenditure_class_id", true, false],
            ["fiscal_period_id", true, false],
            ["flow_kind_id", false, false],
            ["fund_id", true, false],
            ["id", false, true],
            ["institution_id", true, false],
            ["occurred_on", false, false],
            ["project_id", true, false],
            ["scope_unit_feature_id", true, false],
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
          "appropriation_id->finance.appropriations",
          "contract_id->civic.contracts",
          "counterparty_entity_id->official.entities",
          "currency_id->reference.values",
          "debt_id->finance.debts",
          "expenditure_class_id->reference.values",
          "fiscal_period_id->finance.fiscal_periods",
          "flow_kind_id->reference.values",
          "fund_id->finance.funds",
          "institution_id->governance.institutions",
          "project_id->civic.projects",
          "scope_unit_feature_id->geography.features",
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
          "occurred_on,flow_kind_id",
          "fiscal_period_id",
          "fund_id",
          "appropriation_id",
          "contract_id",
          "debt_id",
          "project_id",
          "institution_id",
          "scope_unit_feature_id",
          "expenditure_class_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."flows" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Funds", () => {
    const metadata = () => dataSource.getMetadata(FundsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("funds");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["fund_kind_id", false, false],
            ["funding_source_id", true, false],
            ["id", false, true],
            ["managing_entity_id", true, false],
            ["scope_unit_feature_id", true, false],
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
          "country_id->reference.countries",
          "fund_kind_id->reference.values",
          "funding_source_id->reference.values",
          "managing_entity_id->official.entities",
          "scope_unit_feature_id->geography.features",
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
      expect(indexes).toEqual(expect.arrayContaining(["managing_entity_id", "source_citation_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."funds" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Assets", () => {
    const metadata = () => dataSource.getMetadata(AssetsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("assets");
      expect(columns(metadata())).toEqual(
        (
          [
            ["band", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["feature_id", false, false],
            ["file_version_id", false, false],
            ["geometry_id", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["layer", true, false],
            ["member", true, false],
            ["purpose_id", false, false],
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
          "feature_id->geography.features",
          "file_version_id->filesystem.file_versions",
          "geometry_id->geography.geometries",
          "kind_id->reference.values",
          "purpose_id->reference.values",
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
          "feature_id",
          "geometry_id",
          "file_version_id",
          "kind_id",
          "purpose_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."assets" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Changes", () => {
    const metadata = () => dataSource.getMetadata(GeographyChangesEntity);

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
          "unique:transformation_id,predecessor_feature_id,successor_feature_id",
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

  describe("Classifications", () => {
    const metadata = () => dataSource.getMetadata(ClassificationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("classifications");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["feature_id", false, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["to_year", true, false],
            ["updated_at", false, false],
            ["value_id", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["feature_id->geography.features", "value_id->reference.values"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining(["unique:feature_id,value_id,from_year", "feature_id", "value_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."classifications" DEFAULT VALUES'),
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
            ["ended_on", true, false],
            ["established_on", true, false],
            ["feature_type_id", false, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["to_year", true, false],
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
      expect(indexes).toEqual(expect.arrayContaining(["feature_type_id", "from_year,to_year"]));
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
            ["area", false, false],
            ["basis_id", false, false],
            ["centroid", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["envelope", false, false],
            ["feature_id", false, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["geometry", false, false],
            ["geometry_role_id", false, false],
            ["id", false, true],
            ["max_zoom", true, false],
            ["min_zoom", true, false],
            ["observed_at", true, false],
            ["revision", false, false],
            ["srid", false, false],
            ["supersedes_id", true, false],
            ["to_year", true, false],
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
          "basis_id->reference.values",
          "feature_id->geography.features",
          "geometry_role_id->reference.values",
          "supersedes_id->geography.geometries",
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
          "unique:feature_id,geometry_role_id,revision",
          "feature_id,geometry_role_id",
          "from_year,to_year",
          "unique:id,feature_id",
          "basis_id",
        ]),
      );
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

  describe("Levels", () => {
    const metadata = () => dataSource.getMetadata(LevelsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("levels");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["country_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["depth", false, false],
            ["feature_kind_id", false, false],
            ["hierarchy_kind_id", false, false],
            ["id", false, true],
            ["is_routing_hierarchy", false, false],
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
          "feature_kind_id->reference.values",
          "hierarchy_kind_id->reference.values",
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
        expect.arrayContaining(["unique:country_id,hierarchy_kind_id,depth", "feature_kind_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."levels" DEFAULT VALUES'),
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
            ["is_default", false, false],
            ["language_id", false, false],
            ["name", false, false],
            ["name_kind_id", false, false],
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
          "feature_id->geography.features",
          "language_id->reference.languages",
          "name_kind_id->reference.values",
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
          "unique:feature_id,name_kind_id,language_id,name",
          "feature_id",
          "name_kind_id",
          "language_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."names" DEFAULT VALUES'),
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
            ["ends_on", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["object_feature_id", false, false],
            ["relationship_kind_id", false, false],
            ["starts_on", true, false],
            ["subject_feature_id", false, false],
            ["system_id", false, false],
            ["to_year", true, false],
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
          "unique:subject_feature_id,object_feature_id,relationship_kind_id,system_id,from_year",
          "subject_feature_id,relationship_kind_id",
          "object_feature_id,relationship_kind_id",
          "from_year,to_year",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Agenda", () => {
    const metadata = () => dataSource.getMetadata(AgendaEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("agenda");
      expect(columns(metadata())).toEqual(
        (
          [
            ["agenda_kind_id", false, false],
            ["bill_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["motion_id", true, false],
            ["position", false, false],
            ["sitting_id", false, false],
            ["source_citation_id", true, false],
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
          "agenda_kind_id->reference.values",
          "bill_id->governance.bills",
          "motion_id->governance.motions",
          "sitting_id->governance.sittings",
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
          "unique:sitting_id,position",
          "agenda_kind_id",
          "motion_id",
          "bill_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."agenda" DEFAULT VALUES'),
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
          "unit_feature_id->geography.features",
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
          "unique:institution_id,office_id,authority_kind_id,unit_feature_id",
          "institution_id",
          "office_id",
          "unit_feature_id",
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

  describe("Bills", () => {
    const metadata = () => dataSource.getMetadata(BillsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("bills");
      expect(columns(metadata())).toEqual(
        (
          [
            ["bill_kind_id", false, false],
            ["code", false, false],
            ["country_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["institution_id", false, false],
            ["instrument_id", true, false],
            ["source_citation_id", true, false],
            ["sponsor_holder_id", true, false],
            ["status_id", false, false],
            ["summary", true, false],
            ["term_id", true, false],
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
          "bill_kind_id->reference.values",
          "country_id->reference.countries",
          "institution_id->governance.institutions",
          "instrument_id->legal.instruments",
          "source_citation_id->source.citations",
          "sponsor_holder_id->governance.holders",
          "status_id->reference.values",
          "term_id->governance.terms",
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
          "country_id",
          "institution_id",
          "bill_kind_id",
          "status_id",
          "sponsor_holder_id",
          "term_id",
          "instrument_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."bills" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Hansards", () => {
    const metadata = () => dataSource.getMetadata(HansardsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("hansards");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_id", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["is_provisional", false, false],
            ["language_id", false, false],
            ["published_on", true, false],
            ["reference", true, false],
            ["sitting_id", false, false],
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
          "artifact_id->source.artifacts",
          "language_id->reference.languages",
          "sitting_id->governance.sittings",
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
        expect.arrayContaining(["sitting_id", "artifact_id", "language_id", "source_citation_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."hansards" DEFAULT VALUES'),
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
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["individual_id", false, false],
            ["left_office_on", true, false],
            ["office_id", false, false],
            ["source_citation_id", true, false],
            ["to_year", true, false],
            ["took_office_on", true, false],
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
          "office_id,from_year,to_year",
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
            ["arm_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["dissolved_on", true, false],
            ["entity_id", false, false],
            ["established_on", true, false],
            ["establishment_basis_id", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["institution_kind_id", false, false],
            ["source_citation_id", true, false],
            ["to_year", true, false],
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
          "arm_id->reference.values",
          "entity_id->official.entities",
          "establishment_basis_id->reference.values",
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
        expect.arrayContaining(["entity_id", "arm_id", "source_citation_id"]),
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
            ["ends_on", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["institution_id", true, false],
            ["mandate_kind_id", false, false],
            ["office_id", true, false],
            ["source_citation_id", true, false],
            ["starts_on", true, false],
            ["term_id", true, false],
            ["to_year", true, false],
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
          "institution_id->governance.institutions",
          "mandate_kind_id->reference.values",
          "office_id->governance.offices",
          "source_citation_id->source.citations",
          "term_id->governance.terms",
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
          "unique:institution_id,office_id,mandate_kind_id,description",
          "institution_id",
          "office_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."mandates" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Motions", () => {
    const metadata = () => dataSource.getMetadata(MotionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("motions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["bill_id", true, false],
            ["budget_version_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["fiscal_period_id", true, false],
            ["id", false, true],
            ["instrument_id", true, false],
            ["motion_kind_id", false, false],
            ["moved_by_holder_id", true, false],
            ["outcome_id", false, false],
            ["provision_id", true, false],
            ["sitting_id", false, false],
            ["source_citation_id", true, false],
            ["summary", true, false],
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
          "bill_id->governance.bills",
          "budget_version_id->finance.budget_versions",
          "fiscal_period_id->finance.fiscal_periods",
          "instrument_id->legal.instruments",
          "motion_kind_id->reference.values",
          "moved_by_holder_id->governance.holders",
          "outcome_id->reference.values",
          "provision_id->legal.provisions",
          "sitting_id->governance.sittings",
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
          "sitting_id",
          "motion_kind_id",
          "outcome_id",
          "moved_by_holder_id",
          "bill_id",
          "instrument_id",
          "provision_id",
          "budget_version_id",
          "fiscal_period_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."motions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Obligations", () => {
    const metadata = () => dataSource.getMetadata(ObligationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("obligations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["basis_provision_id", true, false],
            ["code", false, false],
            ["country_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", false, false],
            ["frequency_id", false, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["obligation_kind_id", false, false],
            ["obligor_institution_id", true, false],
            ["obligor_kind_id", true, false],
            ["recipient_entity_id", true, false],
            ["source_citation_id", true, false],
            ["to_year", true, false],
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
          "basis_provision_id->legal.provisions",
          "country_id->reference.countries",
          "frequency_id->reference.values",
          "obligation_kind_id->reference.values",
          "obligor_institution_id->governance.institutions",
          "obligor_kind_id->reference.values",
          "recipient_entity_id->official.entities",
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
          "country_id",
          "obligation_kind_id",
          "obligor_institution_id",
          "obligor_kind_id",
          "basis_provision_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."obligations" DEFAULT VALUES'),
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
            ["abolished_on", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["created_on", true, false],
            ["deleted_at", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["institution_id", false, false],
            ["office_kind_id", false, false],
            ["source_citation_id", true, false],
            ["to_year", true, false],
            ["unit_feature_id", true, false],
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
          "institution_id->governance.institutions",
          "office_kind_id->reference.values",
          "source_citation_id->source.citations",
          "unit_feature_id->geography.features",
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
      expect(indexes).toEqual(expect.arrayContaining(["unit_feature_id", "source_citation_id"]));
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
          "unique:subject_institution_id,object_institution_id,relationship_kind_id",
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

  describe("Reports", () => {
    const metadata = () => dataSource.getMetadata(ReportsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("reports");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["due_on", true, false],
            ["filed_on", true, false],
            ["id", false, true],
            ["obligation_id", false, false],
            ["period_from", true, false],
            ["period_until", true, false],
            ["reporter_entity_id", false, false],
            ["source_citation_id", true, false],
            ["status_id", false, false],
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
          "artifact_id->source.artifacts",
          "obligation_id->governance.obligations",
          "reporter_entity_id->official.entities",
          "source_citation_id->source.citations",
          "status_id->reference.values",
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
          "obligation_id,period_from",
          "reporter_entity_id",
          "status_id",
          "artifact_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."reports" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Sittings", () => {
    const metadata = () => dataSource.getMetadata(SittingsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("sittings");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["institution_id", false, false],
            ["occurrence_id", false, false],
            ["sequence_number", true, false],
            ["session_label", true, false],
            ["sitting_kind_id", false, false],
            ["source_citation_id", true, false],
            ["term_id", true, false],
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
          "institution_id->governance.institutions",
          "occurrence_id->event.occurrences",
          "sitting_kind_id->reference.values",
          "source_citation_id->source.citations",
          "term_id->governance.terms",
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
          "unique:occurrence_id",
          "institution_id",
          "sitting_kind_id",
          "term_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."sittings" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Speeches", () => {
    const metadata = () => dataSource.getMetadata(SpeechesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("speeches");
      expect(columns(metadata())).toEqual(
        (
          [
            ["bill_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["hansard_id", true, false],
            ["holder_id", false, false],
            ["id", false, true],
            ["motion_id", true, false],
            ["page_reference", true, false],
            ["position", false, false],
            ["sitting_id", false, false],
            ["source_citation_id", true, false],
            ["speech_kind_id", false, false],
            ["summary", true, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["word_count", true, false],
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
          "bill_id->governance.bills",
          "hansard_id->governance.hansards",
          "holder_id->governance.holders",
          "motion_id->governance.motions",
          "sitting_id->governance.sittings",
          "source_citation_id->source.citations",
          "speech_kind_id->reference.values",
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
          "unique:sitting_id,position",
          "holder_id",
          "motion_id",
          "bill_id",
          "hansard_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."speeches" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Stages", () => {
    const metadata = () => dataSource.getMetadata(StagesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("stages");
      expect(columns(metadata())).toEqual(
        (
          [
            ["bill_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["motion_id", true, false],
            ["on_date", true, false],
            ["outcome_id", true, false],
            ["sequence_number", false, false],
            ["sitting_id", true, false],
            ["source_citation_id", true, false],
            ["stage_kind_id", false, false],
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
          "bill_id->governance.bills",
          "motion_id->governance.motions",
          "outcome_id->reference.values",
          "sitting_id->governance.sittings",
          "source_citation_id->source.citations",
          "stage_kind_id->reference.values",
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
          "unique:bill_id,sequence_number",
          "stage_kind_id",
          "sitting_id",
          "motion_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."stages" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Terms", () => {
    const metadata = () => dataSource.getMetadata(TermsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("terms");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["country_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["ends_on", true, false],
            ["id", false, true],
            ["institution_id", true, false],
            ["ordinal", true, false],
            ["source_citation_id", true, false],
            ["starts_on", false, false],
            ["term_kind_id", false, false],
            ["unit_feature_id", true, false],
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
          "institution_id->governance.institutions",
          "source_citation_id->source.citations",
          "term_kind_id->reference.values",
          "unit_feature_id->geography.features",
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
          "country_id,starts_on",
          "term_kind_id",
          "institution_id",
          "unit_feature_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."terms" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Votes", () => {
    const metadata = () => dataSource.getMetadata(VotesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("votes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["holder_id", false, false],
            ["id", false, true],
            ["motion_id", false, false],
            ["position_id", false, false],
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
          "holder_id->governance.holders",
          "motion_id->governance.motions",
          "position_id->reference.values",
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
          "unique:motion_id,holder_id",
          "holder_id",
          "position_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."votes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Editions", () => {
    const metadata = () => dataSource.getMetadata(LegalEditionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("editions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["ceased_on", true, false],
            ["code", false, false],
            ["commenced_on", true, false],
            ["consolidated_on", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["designation", false, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["observed_at", false, false],
            ["repealed_on", true, false],
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
        ["instrument_id->legal.instruments", "supersedes_id->legal.editions"].sort(),
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
          "unique:instrument_id,designation",
          "unique:id,instrument_id",
          "supersedes_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."editions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Effects", () => {
    const metadata = () => dataSource.getMetadata(EffectsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("effects");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["effective_on", true, false],
            ["ended_on", true, false],
            ["explanation", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["observed_at", false, false],
            ["review_status", false, false],
            ["subject_id", false, false],
            ["subject_table", false, false],
            ["to_year", true, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["wording_id", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(["kind_id->reference.values", "wording_id->legal.wordings"].sort());
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
          "unique:wording_id,subject_table,subject_id,kind_id,from_year",
          "subject_table,subject_id",
          "kind_id",
          "wording_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."effects" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Instruments", () => {
    const metadata = () => dataSource.getMetadata(InstrumentsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("instruments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["enacted_on", true, false],
            ["id", false, true],
            ["issuing_entity_id", true, false],
            ["issuing_unit_id", true, false],
            ["kind_id", false, false],
            ["published_on", true, false],
            ["status_id", true, false],
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
          "issuing_entity_id->official.entities",
          "issuing_unit_id->geography.features",
          "kind_id->reference.values",
          "status_id->reference.values",
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
      expect(indexes).toEqual(expect.arrayContaining(["kind_id", "status_id", "issuing_unit_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."instruments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Names", () => {
    const metadata = () => dataSource.getMetadata(LegalNamesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("names");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["is_preferred", false, false],
            ["kind_id", false, false],
            ["language_id", false, false],
            ["name", false, false],
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
          "instrument_id->legal.instruments",
          "kind_id->reference.values",
          "language_id->reference.languages",
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
          "unique:instrument_id,language_id,kind_id,name",
          "instrument_id",
          "language_id",
          "kind_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."names" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Provisions", () => {
    const metadata = () => dataSource.getMetadata(ProvisionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("provisions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["designation", false, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["kind", false, false],
            ["parent_id", true, false],
            ["position", false, false],
            ["title", true, false],
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
        ["instrument_id->legal.instruments", "parent_id->legal.provisions"].sort(),
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
          "unique:parent_id,position",
          "unique:id,instrument_id",
          "instrument_id",
          "parent_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."provisions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("References", () => {
    const metadata = () => dataSource.getMetadata(ReferencesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("references");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["method", false, false],
            ["relation", false, false],
            ["review_status", false, false],
            ["span_end", false, false],
            ["span_start", false, false],
            ["span_text", false, false],
            ["target_provision_id", false, false],
            ["target_wording_id", true, false],
            ["translation_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["wording_id", true, false],
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
          "target_provision_id->legal.provisions",
          "target_wording_id->legal.wordings",
          "translation_id->legal.translations",
          "wording_id->legal.wordings",
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
          "unique:wording_id,target_provision_id,span_start",
          "unique:translation_id,target_provision_id,span_start",
          "wording_id",
          "translation_id",
          "target_provision_id",
          "target_wording_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."references" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Relationships", () => {
    const metadata = () => dataSource.getMetadata(LegalRelationshipsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["affected_wording_id", true, false],
            ["authority_wording_id", true, false],
            ["citation_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["effective_on", true, false],
            ["explanation", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["object_instrument_id", true, false],
            ["resulting_wording_id", true, false],
            ["subject_instrument_id", true, false],
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
          "affected_wording_id->legal.wordings",
          "authority_wording_id->legal.wordings",
          "citation_id->source.citations",
          "kind_id->reference.values",
          "object_instrument_id->legal.instruments",
          "resulting_wording_id->legal.wordings",
          "subject_instrument_id->legal.instruments",
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
          "kind_id",
          "authority_wording_id",
          "affected_wording_id",
          "resulting_wording_id",
          "subject_instrument_id",
          "object_instrument_id",
          "citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Translations", () => {
    const metadata = () => dataSource.getMetadata(TranslationsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("translations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["language_id", false, false],
            ["method", false, false],
            ["notes", true, false],
            ["produced_at", true, false],
            ["produced_by", true, false],
            ["review_status", false, false],
            ["reviewed_at", true, false],
            ["reviewed_by_snapshot", true, false],
            ["text", false, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["wording_id", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("references the contract's related tables", () => {
      const keys = metadata()
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        ["language_id->reference.languages", "wording_id->legal.wordings"].sort(),
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
        expect.arrayContaining(["unique:id,wording_id", "wording_id", "language_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."translations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Wordings", () => {
    const metadata = () => dataSource.getMetadata(WordingsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("wordings");
      expect(columns(metadata())).toEqual(
        (
          [
            ["citation_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["edition_id", false, false],
            ["ends_on", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["language_id", false, false],
            ["observed_at", false, false],
            ["provision_id", false, false],
            ["starts_on", true, false],
            ["supersedes_id", true, false],
            ["text", false, false],
            ["to_year", true, false],
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
          "citation_id->source.citations",
          "edition_id->legal.editions",
          "instrument_id->legal.instruments",
          "language_id->reference.languages",
          "provision_id->legal.provisions",
          "supersedes_id->legal.wordings",
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
          "unique:provision_id,edition_id,language_id",
          "edition_id",
          "language_id",
          "citation_id",
          "supersedes_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."wordings" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Branding", () => {
    const metadata = () => dataSource.getMetadata(BrandingEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("branding");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["entity_id", true, false],
            ["id", false, true],
            ["individual_id", true, false],
            ["kind_id", false, false],
            ["language_id", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
            ["value", true, false],
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
          "kind_id->reference.values",
          "language_id->reference.languages",
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
          "entity_id,kind_id",
          "individual_id,kind_id",
          "language_id",
          "source_citation_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "official"."branding" DEFAULT VALUES'),
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
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["entity_id", true, false],
            ["id", false, true],
            ["individual_id", true, false],
            ["kind_id", false, false],
            ["source_citation_id", true, false],
            ["updated_at", false, false],
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
        expect.arrayContaining(["kind_id", "registration_country_id", "source_citation_id"]),
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
      expect(indexes).toEqual(expect.arrayContaining(["source_citation_id"]));
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
            ["language_id", false, false],
            ["name", false, false],
            ["name_kind_id", false, false],
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
          "entity_id->official.entities",
          "individual_id->official.individuals",
          "language_id->reference.languages",
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
          "unique:entity_id,individual_id,name_kind_id,language_id,name",
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
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["ends_on", true, false],
            ["from_entity_id", true, false],
            ["from_individual_id", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["share_percentage", true, false],
            ["source_citation_id", true, false],
            ["starts_on", true, false],
            ["to_entity_id", true, false],
            ["to_individual_id", true, false],
            ["to_year", true, false],
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

  describe("Copy", () => {
    const metadata = () => dataSource.getMetadata(CopyEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("copy");
      expect(columns(metadata())).toEqual(
        (
          [
            ["country_id", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["is_development_text", false, false],
            ["key", false, false],
            ["language_id", false, false],
            ["text", false, false],
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
        ["country_id->reference.countries", "language_id->reference.languages"].sort(),
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
        expect.arrayContaining(["unique:key,language_id,country_id", "language_id", "country_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."copy" DEFAULT VALUES'),
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
            ["default_language_id", true, false],
            ["deleted_at", true, false],
            ["designation_id", true, false],
            ["established_on", true, false],
            ["id", false, true],
            ["is_served", false, false],
            ["iso_alpha2", true, false],
            ["iso_alpha3", true, false],
            ["iso_numeric", true, false],
            ["name", false, false],
            ["official_name", true, false],
            ["recognition_status_id", true, false],
            ["subdomain", true, false],
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
          "default_language_id->reference.languages",
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

  describe("Language", () => {
    const metadata = () => dataSource.getMetadata(LanguageEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("languages");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["direction_id", true, false],
            ["family_id", true, false],
            ["glottocode", true, false],
            ["id", false, true],
            ["iso6391", true, false],
            ["iso6392", true, false],
            ["iso6393", true, false],
            ["kind_id", false, false],
            ["name", false, false],
            ["parent_id", true, false],
            ["script_id", true, false],
            ["status_id", true, false],
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
          "direction_id->reference.values",
          "family_id->reference.values",
          "kind_id->reference.values",
          "parent_id->reference.languages",
          "script_id->reference.values",
          "status_id->reference.values",
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
          "unique:iso6391",
          "unique:iso6393",
          "unique:glottocode",
          "name",
          "kind_id",
          "family_id",
          "script_id",
          "parent_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."languages" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LanguageName", () => {
    const metadata = () => dataSource.getMetadata(LanguageNameEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("language_names");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["in_language_id", false, false],
            ["language_id", false, false],
            ["name", false, false],
            ["name_kind", false, false],
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
        ["in_language_id->reference.languages", "language_id->reference.languages"].sort(),
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
          "unique:language_id,in_language_id,name_kind,name",
          "language_id",
          "in_language_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."language_names" DEFAULT VALUES'),
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
      expect(indexes).toEqual(expect.arrayContaining([]));
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
      expect(indexes).toEqual(expect.arrayContaining([]));
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
      expect(indexes).toEqual(expect.arrayContaining(["parent_id"]));
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
      expect(indexes).toEqual(expect.arrayContaining(["base_id"]));
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
            ["color_token", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["icon_code", true, false],
            ["id", false, true],
            ["label", false, false],
            ["parent_id", true, false],
            ["position", true, false],
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
        [
          "parent_id->reference.values",
          "scheme_id->reference.schemes",
          "supersedes_id->reference.values",
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
      expect(indexes).toEqual(expect.arrayContaining(["scheme_id", "supersedes_id", "parent_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."values" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ValueLabel", () => {
    const metadata = () => dataSource.getMetadata(ValueLabelEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("value_labels");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["label", false, false],
            ["label_kind", false, false],
            ["language_id", false, false],
            ["updated_at", false, false],
            ["value_id", false, false],
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
        ["language_id->reference.languages", "value_id->reference.values"].sort(),
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
          "unique:value_id,language_id,label_kind,label",
          "value_id",
          "language_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."value_labels" DEFAULT VALUES'),
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
          "unique:source_value_id,target_value_id,relation_kind",
          "source_value_id,relation_kind",
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

  describe("Addresses", () => {
    const metadata = () => dataSource.getMetadata(AddressesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("addresses");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["domain_id", false, false],
            ["id", false, true],
            ["kind", false, false],
            ["method", false, false],
            ["note", true, false],
            ["path", false, false],
            ["query", true, false],
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
      expect(keys).toEqual(["domain_id->source.domains"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining(["unique:domain_id,method,path,query", "domain_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."addresses" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Artifacts", () => {
    const metadata = () => dataSource.getMetadata(ArtifactsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("artifacts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["content_type", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["edition_id", false, false],
            ["file_version_id", true, false],
            ["format", true, false],
            ["id", false, true],
            ["location", true, false],
            ["parent_id", true, false],
            ["sha256", false, false],
            ["size_bytes", true, false],
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
          "edition_id->source.editions",
          "file_version_id->filesystem.file_versions",
          "parent_id->source.artifacts",
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
          "unique:edition_id,sha256",
          "sha256",
          "file_version_id",
          "parent_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."artifacts" DEFAULT VALUES'),
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
            ["artifact_id", false, false],
            ["assessed_at", false, false],
            ["assessor_snapshot", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["credit", false, false],
            ["deleted_at", true, false],
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
          "artifact_id->source.artifacts",
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
        expect.arrayContaining(["publisher_id", "artifact_id", "license_value_id"]),
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
            ["address_id", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["discovery_id", true, false],
            ["id", false, true],
            ["original_url", false, false],
            ["response_metadata", false, false],
            ["retrieved_at", false, false],
            ["retrieved_url", true, false],
            ["source_id", true, false],
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
          "address_id->source.addresses",
          "artifact_id->source.artifacts",
          "discovery_id->source.discoveries",
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
        expect.arrayContaining(["source_id", "address_id", "discovery_id", "artifact_id"]),
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
            ["address_id", true, false],
            ["artifact_id", true, false],
            ["capture_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["id", false, true],
            ["locator", false, false],
            ["locator_kind_id", false, false],
            ["quoted_hash", true, false],
            ["recorded_at", false, false],
            ["subject_id", true, false],
            ["subject_table", true, false],
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
          "address_id->source.addresses",
          "artifact_id->source.artifacts",
          "capture_id->source.captures",
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
          "artifact_id",
          "capture_id",
          "address_id",
          "subject_table,subject_id",
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

  describe("Coverage", () => {
    const metadata = () => dataSource.getMetadata(CoverageEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("coverage");
      expect(columns(metadata())).toEqual(
        (
          [
            ["checked_on", false, false],
            ["code", false, false],
            ["country_id", false, false],
            ["coverage_subject_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["expected_publication_url", true, false],
            ["id", false, true],
            ["level_id", false, false],
            ["note", true, false],
            ["period_from", true, false],
            ["period_until", true, false],
            ["product_id", true, false],
            ["publisher_entity_id", true, false],
            ["scope_unit_feature_id", true, false],
            ["source_id", true, false],
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
          "coverage_subject_id->reference.values",
          "level_id->reference.values",
          "product_id->source.products",
          "publisher_entity_id->official.entities",
          "scope_unit_feature_id->geography.features",
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
          "country_id,coverage_subject_id",
          "source_id",
          "product_id",
          "scope_unit_feature_id",
          "level_id",
          "publisher_entity_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."coverage" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Discoveries", () => {
    const metadata = () => dataSource.getMetadata(DiscoveriesEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("discoveries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["address_id", true, false],
            ["anchor_text", true, false],
            ["context", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["discovered_at", false, false],
            ["found_on_address_id", true, false],
            ["id", false, true],
            ["observed_url", false, false],
            ["source_id", true, false],
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
          "address_id->source.addresses",
          "found_on_address_id->source.addresses",
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
        expect.arrayContaining(["address_id", "found_on_address_id", "source_id", "discovered_at"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."discoveries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Domains", () => {
    const metadata = () => dataSource.getMetadata(DomainsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("domains");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["ends_on", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["host", false, false],
            ["id", false, true],
            ["source_id", false, false],
            ["starts_on", true, false],
            ["to_year", true, false],
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
      expect(indexes).toEqual(expect.arrayContaining(["unique:host", "source_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."domains" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Editions", () => {
    const metadata = () => dataSource.getMetadata(SourceEditionsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("editions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["designation", false, false],
            ["id", false, true],
            ["language_id", true, false],
            ["product_id", false, false],
            ["published_on", true, false],
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
        ["language_id->reference.languages", "product_id->source.products"].sort(),
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
        expect.arrayContaining(["unique:product_id,designation", "language_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."editions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Links", () => {
    const metadata = () => dataSource.getMetadata(LinksEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("links");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["from_slug_id", false, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["relation_kind_id", false, false],
            ["to_slug_id", false, false],
            ["to_year", true, false],
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
          "from_slug_id->source.slugs",
          "relation_kind_id->reference.values",
          "to_slug_id->source.slugs",
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
          "unique:from_slug_id,to_slug_id,relation_kind_id",
          "to_slug_id",
          "relation_kind_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."links" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Products", () => {
    const metadata = () => dataSource.getMetadata(ProductsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("products");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["id", false, true],
            ["kind_id", false, false],
            ["publisher_id", true, false],
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
      expect(keys).toEqual(["kind_id->reference.values", "publisher_id->source.publishers"].sort());
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map(
          (index) =>
            `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`,
        )
        .sort();
      expect(indexes).toEqual(expect.arrayContaining(["kind_id", "publisher_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."products" DEFAULT VALUES'),
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
            ["classification_id", true, false],
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
          "classification_id->reference.values",
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
      expect(indexes).toEqual(
        expect.arrayContaining(["kind_id", "classification_id", "country_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."publishers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Relationships", () => {
    const metadata = () => dataSource.getMetadata(SourceRelationshipsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["execution_ref", true, false],
            ["id", false, true],
            ["input_artifact_id", true, false],
            ["input_capture_id", true, false],
            ["input_edition_id", true, false],
            ["input_file_version_id", true, false],
            ["input_product_id", true, false],
            ["kind_id", false, false],
            ["method", true, false],
            ["output_artifact_id", true, false],
            ["output_capture_id", true, false],
            ["output_edition_id", true, false],
            ["output_file_version_id", true, false],
            ["output_product_id", true, false],
            ["subject_id", true, false],
            ["subject_table", true, false],
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
          "input_artifact_id->source.artifacts",
          "input_capture_id->source.captures",
          "input_edition_id->source.editions",
          "input_file_version_id->filesystem.file_versions",
          "input_product_id->source.products",
          "kind_id->reference.values",
          "output_artifact_id->source.artifacts",
          "output_capture_id->source.captures",
          "output_edition_id->source.editions",
          "output_file_version_id->filesystem.file_versions",
          "output_product_id->source.products",
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
      expect(indexes).toEqual(expect.arrayContaining(["kind_id", "subject_table,subject_id"]));
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Slugs", () => {
    const metadata = () => dataSource.getMetadata(SlugsEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("slugs");
      expect(columns(metadata())).toEqual(
        (
          [
            ["canonical_slug_id", true, false],
            ["code", false, false],
            ["country_id", false, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["from_to_precision", true, false],
            ["from_year", true, false],
            ["id", false, true],
            ["language_id", true, false],
            ["namespace_id", false, false],
            ["parent_slug_id", true, false],
            ["slug", false, false],
            ["subject_id", false, false],
            ["subject_table", false, false],
            ["to_year", true, false],
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
          "canonical_slug_id->source.slugs",
          "country_id->reference.countries",
          "language_id->reference.languages",
          "namespace_id->reference.values",
          "parent_slug_id->source.slugs",
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
          "subject_table,subject_id",
          "parent_slug_id",
          "canonical_slug_id",
          "namespace_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."slugs" DEFAULT VALUES'),
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
            ["classification_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["credential_binding", true, false],
            ["credibility_id", true, false],
            ["deleted_at", true, false],
            ["description", true, false],
            ["id", false, true],
            ["kind", false, false],
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
          "classification_id->reference.values",
          "credibility_id->reference.values",
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
      expect(indexes).toEqual(
        expect.arrayContaining(["publisher_id", "kind", "classification_id", "credibility_id"]),
      );
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
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["deleted_at", true, false],
            ["explanation", false, false],
            ["id", false, true],
            ["method_id", false, false],
            ["outcome", false, false],
            ["reviewer_snapshot", false, false],
            ["subject_id", false, false],
            ["subject_table", false, false],
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
        ["method_id->reference.values", "supersedes_id->source.verifications"].sort(),
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
        expect.arrayContaining(["subject_table,subject_id", "method_id", "supersedes_id"]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."verifications" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });
});
