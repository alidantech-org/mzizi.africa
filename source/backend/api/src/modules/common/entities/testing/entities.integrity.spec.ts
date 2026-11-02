import "reflect-metadata";

import { randomUUID } from "node:crypto";
import { DataType, newDb } from "pg-mem";
import type { DataSource, EntityMetadata } from "typeorm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CommentEntity } from "#/modules/audit/entities/comment.entity.ts";
import { EvidenceReferenceEntity } from "#/modules/audit/entities/evidence-reference.entity.ts";
import { ReviewDecisionEntity } from "#/modules/audit/entities/review-decision.entity.ts";
import { LoanDisbursementEntity } from "#/modules/debt/entities/loan-disbursement.entity.ts";
import { LoanRepaymentEntity } from "#/modules/debt/entities/loan-repayment.entity.ts";
import { LoanEntity } from "#/modules/debt/entities/loan.entity.ts";
import { CandidateEntity } from "#/modules/elections/entities/candidate.entity.ts";
import { ElectionResultEntity } from "#/modules/elections/entities/election-result.entity.ts";
import { ElectionEntity } from "#/modules/elections/entities/election.entity.ts";
import { ManifestoCommitmentEntity } from "#/modules/elections/entities/manifesto-commitment.entity.ts";
import { ManifestoEntity } from "#/modules/elections/entities/manifesto.entity.ts";
import { SeatEntity } from "#/modules/elections/entities/seat.entity.ts";
import { EntityIdentifierEntity } from "#/modules/entities/entities/entity-identifier.entity.ts";
import { EntityLocationEntity } from "#/modules/entities/entities/entity-location.entity.ts";
import { EntityOwnershipEntity } from "#/modules/entities/entities/entity-ownership.entity.ts";
import { LegalEntityEntity } from "#/modules/entities/entities/legal-entity.entity.ts";
import { EventLinkEntity } from "#/modules/events/entities/event-link.entity.ts";
import { EventEntity } from "#/modules/events/entities/event.entity.ts";
import { FileAttachmentEntity } from "#/modules/filesystem/entities/file-attachment.entity.ts";
import { FileEventEntity } from "#/modules/filesystem/entities/file-event.entity.ts";
import { FileVariantEntity } from "#/modules/filesystem/entities/file-variant.entity.ts";
import { FileVersionEntity } from "#/modules/filesystem/entities/file-version.entity.ts";
import { FileEntity } from "#/modules/filesystem/entities/file.entity.ts";
import { FolderEntity } from "#/modules/filesystem/entities/folder.entity.ts";
import { FormatEntity } from "#/modules/filesystem/entities/format.entity.ts";
import { StoreEntity } from "#/modules/filesystem/entities/store.entity.ts";
import { StoredObjectEntity } from "#/modules/filesystem/entities/stored-object.entity.ts";
import { UploadSessionEntity } from "#/modules/filesystem/entities/upload-session.entity.ts";
import { BudgetEntity } from "#/modules/finance/entities/budget.entity.ts";
import { BudgetaryUnitEntity } from "#/modules/finance/entities/budgetary-unit.entity.ts";
import { ExpenditureEntity } from "#/modules/finance/entities/expenditure.entity.ts";
import { FiscalYearEntity } from "#/modules/finance/entities/fiscal-year.entity.ts";
import { LedgerEntryEntity } from "#/modules/finance/entities/ledger-entry.entity.ts";
import { RevenueRecordEntity } from "#/modules/finance/entities/revenue-record.entity.ts";
import { TransferEntity } from "#/modules/finance/entities/transfer.entity.ts";
import { GeoBoundaryVersionEntity } from "#/modules/geography/entities/geo-boundary-version.entity.ts";
import { GeoRelationshipEntity } from "#/modules/geography/entities/geo-relationship.entity.ts";
import { GeoUnitChangeEntity } from "#/modules/geography/entities/geo-unit-change.entity.ts";
import { GeoUnitNameVersionEntity } from "#/modules/geography/entities/geo-unit-name-version.entity.ts";
import { GeoUnitEntity } from "#/modules/geography/entities/geo-unit.entity.ts";
import { InstitutionRelationshipEntity } from "#/modules/governance/entities/institution-relationship.entity.ts";
import { InstitutionEntity } from "#/modules/governance/entities/institution.entity.ts";
import { OfficeHolderEntity } from "#/modules/governance/entities/office-holder.entity.ts";
import { OfficeRuleEntity } from "#/modules/governance/entities/office-rule.entity.ts";
import { OfficeEntity } from "#/modules/governance/entities/office.entity.ts";
import { SelectionProcedureEntity } from "#/modules/governance/entities/selection-procedure.entity.ts";
import { SelectionStageEntity } from "#/modules/governance/entities/selection-stage.entity.ts";
import { AccountGrantEntity } from "#/modules/identity/entities/account-grant.entity.ts";
import { AccountEntity } from "#/modules/identity/entities/account.entity.ts";
import { LegalAmendmentChangeEntity } from "#/modules/legal/entities/legal-amendment-change.entity.ts";
import { LegalAmendmentEntity } from "#/modules/legal/entities/legal-amendment.entity.ts";
import { LegalAuthorityLinkEntity } from "#/modules/legal/entities/legal-authority-link.entity.ts";
import { LegalInstrumentEntity } from "#/modules/legal/entities/legal-instrument.entity.ts";
import { LegalProvisionEntity } from "#/modules/legal/entities/legal-provision.entity.ts";
import { PersonContactEntity } from "#/modules/person/entities/person-contact.entity.ts";
import { PersonHandleEntity } from "#/modules/person/entities/person-handle.entity.ts";
import { PersonNameEntity } from "#/modules/person/entities/person-name.entity.ts";
import { PersonProfileEntity } from "#/modules/person/entities/person-profile.entity.ts";
import { PersonEntity } from "#/modules/person/entities/person.entity.ts";
import { IdeologyEntity } from "#/modules/political/entities/ideology.entity.ts";
import { PartyIdeologyEntity } from "#/modules/political/entities/party-ideology.entity.ts";
import { PartyMembershipEntity } from "#/modules/political/entities/party-membership.entity.ts";
import { PartyPositionHolderEntity } from "#/modules/political/entities/party-position-holder.entity.ts";
import { PartyPositionEntity } from "#/modules/political/entities/party-position.entity.ts";
import { PartyUnitEntity } from "#/modules/political/entities/party-unit.entity.ts";
import { PartyEntity } from "#/modules/political/entities/party.entity.ts";
import { BidEntity } from "#/modules/procurement/entities/bid.entity.ts";
import { ContractMilestoneEntity } from "#/modules/procurement/entities/contract-milestone.entity.ts";
import { ContractVariationEntity } from "#/modules/procurement/entities/contract-variation.entity.ts";
import { ProcurementContractEntity } from "#/modules/procurement/entities/procurement-contract.entity.ts";
import { TenderEntity } from "#/modules/procurement/entities/tender.entity.ts";
import { ClassificationRecordEntity } from "#/modules/reference/entities/classification-record.entity.ts";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { AmenityOfficeEntity } from "#/modules/services/entities/amenity-office.entity.ts";
import { AmenityEntity } from "#/modules/services/entities/amenity.entity.ts";
import { PublicServiceEntity } from "#/modules/services/entities/public-service.entity.ts";
import { ServiceDeliveryEntity } from "#/modules/services/entities/service-delivery.entity.ts";
import { AttributionEntity } from "#/modules/source/entities/attribution.entity.ts";
import { CaptureEntity } from "#/modules/source/entities/capture.entity.ts";
import { DocumentEntity } from "#/modules/source/entities/document.entity.ts";
import { MethodEntity } from "#/modules/source/entities/method.entity.ts";
import { PublisherEntity } from "#/modules/source/entities/publisher.entity.ts";
import { VerificationEntity } from "#/modules/source/entities/verification.entity.ts";
import { IndicatorCategoryEntity } from "#/modules/statistics/entities/indicator-category.entity.ts";
import { IndicatorColumnEntity } from "#/modules/statistics/entities/indicator-column.entity.ts";
import { IndicatorEntity } from "#/modules/statistics/entities/indicator.entity.ts";
import { ObservationEntity } from "#/modules/statistics/entities/observation.entity.ts";
import { PeriodEntity } from "#/modules/statistics/entities/period.entity.ts";
import { StatisticsTableEntity } from "#/modules/statistics/entities/statistics-table.entity.ts";
import { AssessmentEntity } from "#/modules/website/entities/assessment.entity.ts";
import { DomainPatternEntity } from "#/modules/website/entities/domain-pattern.entity.ts";
import { DossierEntity } from "#/modules/website/entities/dossier.entity.ts";
import { SiteCheckEntity } from "#/modules/website/entities/site-check.entity.ts";
import { SiteDomainEntity } from "#/modules/website/entities/site-domain.entity.ts";
import { SiteFamilyEntity } from "#/modules/website/entities/site-family.entity.ts";
import { SiteFingerprintEntity } from "#/modules/website/entities/site-fingerprint.entity.ts";
import { SiteMemberEntity } from "#/modules/website/entities/site-member.entity.ts";
import { SitePublisherEntity } from "#/modules/website/entities/site-publisher.entity.ts";
import { SiteRelationEntity } from "#/modules/website/entities/site-relation.entity.ts";
import { SiteSubjectEntity } from "#/modules/website/entities/site-subject.entity.ts";
import { SiteTraitEntity } from "#/modules/website/entities/site-trait.entity.ts";
import { SiteEntity } from "#/modules/website/entities/site.entity.ts";
import { StructureFileEntity } from "#/modules/website/entities/structure-file.entity.ts";
import { StructureVersionEntity } from "#/modules/website/entities/structure-version.entity.ts";
import { StructureEntity } from "#/modules/website/entities/structure.entity.ts";

/**
 * Managed by Dryv: every generated entity synchronizes into a Postgres schema (pg-mem) and maps
 * exactly the tables, columns, keys and constraints its contract declares.
 */
const entities = [
  CommentEntity,
  EvidenceReferenceEntity,
  ReviewDecisionEntity,
  LoanEntity,
  LoanDisbursementEntity,
  LoanRepaymentEntity,
  CandidateEntity,
  ElectionEntity,
  ElectionResultEntity,
  ManifestoEntity,
  ManifestoCommitmentEntity,
  SeatEntity,
  EntityIdentifierEntity,
  EntityLocationEntity,
  EntityOwnershipEntity,
  LegalEntityEntity,
  EventEntity,
  EventLinkEntity,
  FileEntity,
  FileAttachmentEntity,
  FileEventEntity,
  FileVariantEntity,
  FileVersionEntity,
  FolderEntity,
  FormatEntity,
  StoreEntity,
  StoredObjectEntity,
  UploadSessionEntity,
  BudgetEntity,
  BudgetaryUnitEntity,
  ExpenditureEntity,
  FiscalYearEntity,
  LedgerEntryEntity,
  RevenueRecordEntity,
  TransferEntity,
  GeoBoundaryVersionEntity,
  GeoRelationshipEntity,
  GeoUnitEntity,
  GeoUnitChangeEntity,
  GeoUnitNameVersionEntity,
  InstitutionEntity,
  InstitutionRelationshipEntity,
  OfficeEntity,
  OfficeHolderEntity,
  OfficeRuleEntity,
  SelectionProcedureEntity,
  SelectionStageEntity,
  AccountEntity,
  AccountGrantEntity,
  LegalAmendmentEntity,
  LegalAmendmentChangeEntity,
  LegalAuthorityLinkEntity,
  LegalInstrumentEntity,
  LegalProvisionEntity,
  PersonEntity,
  PersonContactEntity,
  PersonHandleEntity,
  PersonNameEntity,
  PersonProfileEntity,
  IdeologyEntity,
  PartyEntity,
  PartyIdeologyEntity,
  PartyMembershipEntity,
  PartyPositionEntity,
  PartyPositionHolderEntity,
  PartyUnitEntity,
  BidEntity,
  ContractMilestoneEntity,
  ContractVariationEntity,
  ProcurementContractEntity,
  TenderEntity,
  ClassificationRecordEntity,
  JurisdictionEntity,
  AmenityEntity,
  AmenityOfficeEntity,
  PublicServiceEntity,
  ServiceDeliveryEntity,
  AttributionEntity,
  CaptureEntity,
  DocumentEntity,
  MethodEntity,
  PublisherEntity,
  VerificationEntity,
  IndicatorEntity,
  IndicatorCategoryEntity,
  IndicatorColumnEntity,
  ObservationEntity,
  PeriodEntity,
  StatisticsTableEntity,
  AssessmentEntity,
  DomainPatternEntity,
  DossierEntity,
  SiteEntity,
  SiteCheckEntity,
  SiteDomainEntity,
  SiteFamilyEntity,
  SiteFingerprintEntity,
  SiteMemberEntity,
  SitePublisherEntity,
  SiteRelationEntity,
  SiteSubjectEntity,
  SiteTraitEntity,
  StructureEntity,
  StructureFileEntity,
  StructureVersionEntity,
];

let dataSource: DataSource;

beforeAll(async () => {
  const db = newDb({ autoCreateForeignKeyIndices: true });
  db.public.registerFunction({ name: "current_database", implementation: () => "dryv" });
  db.public.registerFunction({ name: "version", implementation: () => "PostgreSQL 16" });
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
    "audit",
    "audit",
    "audit",
    "debt",
    "debt",
    "debt",
    "electoral",
    "electoral",
    "electoral",
    "electoral",
    "electoral",
    "electoral",
    "organization",
    "organization",
    "organization",
    "organization",
    "calendar",
    "calendar",
    "filesystem",
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
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "governance",
    "identity",
    "identity",
    "legal",
    "legal",
    "legal",
    "legal",
    "legal",
    "person",
    "person",
    "person",
    "person",
    "person",
    "political",
    "political",
    "political",
    "political",
    "political",
    "political",
    "political",
    "procurement",
    "procurement",
    "procurement",
    "procurement",
    "procurement",
    "reference",
    "reference",
    "civic",
    "civic",
    "civic",
    "civic",
    "source",
    "source",
    "source",
    "source",
    "source",
    "source",
    "statistical",
    "statistical",
    "statistical",
    "statistical",
    "statistical",
    "statistical",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
    "website",
  ]);
  for (const namespace of namespaces) db.createSchema(namespace);
  dataSource = await db.adapters.createTypeormDataSource({ type: "postgres", entities });
  await dataSource.initialize();
  await dataSource.synchronize();
});

afterAll(async () => {
  if (dataSource?.isInitialized) await dataSource.destroy();
});

/** [column, nullable, primary] for every stored column. */
function columns(metadata: EntityMetadata): Array<[string, boolean, boolean]> {
  return metadata.columns
    .map((item) => [item.databaseName, item.isNullable, item.isPrimary] as [string, boolean, boolean])
    .sort(([left], [right]) => left.localeCompare(right));
}

describe("entity schema matches the contract", () => {
  it("synchronizes every entity into Postgres", () => {
    expect(dataSource.isInitialized).toBe(true);
    expect(dataSource.entityMetadatas).toHaveLength(entities.length);
  });

  describe("Comment", () => {
    const metadata = () => dataSource.getMetadata(CommentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("comments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_id", false, false],
            ["body", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["parent_comment_id", true, false],
            ["target_id", false, false],
            ["target_kind", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "target_kind,target_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "audit"."comments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EvidenceReference", () => {
    const metadata = () => dataSource.getMetadata(EvidenceReferenceEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("evidence");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_id", false, false],
            ["created_at", false, false],
            ["file_id", false, false],
            ["id", false, true],
            ["note", true, false],
            ["target_id", false, false],
            ["target_kind", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "target_kind,target_id",
          "file_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "audit"."evidence" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ReviewDecision", () => {
    const metadata = () => dataSource.getMetadata(ReviewDecisionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("decisions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["decision", false, false],
            ["id", false, true],
            ["proposed_state", false, false],
            ["rationale", false, false],
            ["reviewer_id", false, false],
            ["target_id", false, false],
            ["target_kind", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "target_kind,target_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "audit"."decisions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Loan", () => {
    const metadata = () => dataSource.getMetadata(LoanEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("loans");
      expect(columns(metadata())).toEqual(
        (
          [
            ["borrower_unit_id", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["interest_rate", true, false],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["lender_entity_id", true, false],
            ["principal_amount", false, false],
            ["status", false, false],
            ["term_months", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "borrower_unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "debt"."loans" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LoanDisbursement", () => {
    const metadata = () => dataSource.getMetadata(LoanDisbursementEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("disbursements");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["disbursed_on", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["ledger_entry_id", true, false],
            ["loan_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "loan_id->debt.loans",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "loan_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "debt"."disbursements" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LoanRepayment", () => {
    const metadata = () => dataSource.getMetadata(LoanRepaymentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("repayments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fees_paid", true, false],
            ["id", false, true],
            ["interest_paid", false, false],
            ["is_current", false, false],
            ["ledger_entry_id", true, false],
            ["loan_id", false, false],
            ["paid_on", false, false],
            ["principal_paid", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "loan_id->debt.loans",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "loan_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "debt"."repayments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Candidate", () => {
    const metadata = () => dataSource.getMetadata(CandidateEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("candidates");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["is_independent", false, false],
            ["nomination_status", false, false],
            ["party_id", true, false],
            ["person_id", false, false],
            ["seat_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "seat_id->electoral.seats",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "seat_id",
          "person_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "electoral"."candidates" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Election", () => {
    const metadata = () => dataSource.getMetadata(ElectionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("elections");
      expect(columns(metadata())).toEqual(
        (
          [
            ["administering_institution_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["held_date", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_basis_id", true, false],
            ["name", false, false],
            ["scheduled_date", true, false],
            ["status", false, false],
            ["type_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "jurisdiction_id,status",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "electoral"."elections" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ElectionResult", () => {
    const metadata = () => dataSource.getMetadata(ElectionResultEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("results");
      expect(columns(metadata())).toEqual(
        (
          [
            ["candidate_id", false, false],
            ["created_at", false, false],
            ["declared_at", true, false],
            ["declaring_institution_id", true, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["is_winner", false, false],
            ["rank", true, false],
            ["result_level_id", false, false],
            ["seat_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
            ["votes", false, false],
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
          "candidate_id->electoral.candidates",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "candidate_id",
          "seat_id,result_level_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "electoral"."results" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Manifesto", () => {
    const metadata = () => dataSource.getMetadata(ManifestoEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("manifestos");
      expect(columns(metadata())).toEqual(
        (
          [
            ["candidate_id", false, false],
            ["created_at", false, false],
            ["document_url", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["language", true, false],
            ["published_on", true, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "candidate_id->electoral.candidates",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "candidate_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "electoral"."manifestos" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ManifestoCommitment", () => {
    const metadata = () => dataSource.getMetadata(ManifestoCommitmentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("commitments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["manifesto_id", false, false],
            ["parent_id", true, false],
            ["sort_order", false, false],
            ["text", false, false],
            ["topic_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "manifesto_id->electoral.manifestos",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "manifesto_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "electoral"."commitments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Seat", () => {
    const metadata = () => dataSource.getMetadata(SeatEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("seats");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["election_id", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["office_id", true, false],
            ["positions", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "election_id->electoral.elections",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:election_id,code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "electoral"."seats" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EntityIdentifier", () => {
    const metadata = () => dataSource.getMetadata(EntityIdentifierEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("identifiers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["entity_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["issuing_authority_id", true, false],
            ["scheme_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "entity_id->organization.entities",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "entity_id",
          "scheme_id,value",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "organization"."identifiers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EntityLocation", () => {
    const metadata = () => dataSource.getMetadata(EntityLocationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("locations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["address_text", true, false],
            ["created_at", false, false],
            ["entity_id", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "entity_id->organization.entities",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "entity_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "organization"."locations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EntityOwnership", () => {
    const metadata = () => dataSource.getMetadata(EntityOwnershipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("ownerships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["entity_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["owner_entity_id", true, false],
            ["owner_person_id", true, false],
            ["percentage", true, false],
            ["position", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "entity_id->organization.entities",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "entity_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "organization"."ownerships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalEntity", () => {
    const metadata = () => dataSource.getMetadata(LegalEntityEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("entities");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["entity_type_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["official_name", false, false],
            ["parent_entity_id", true, false],
            ["status", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "jurisdiction_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "organization"."entities" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Event", () => {
    const metadata = () => dataSource.getMetadata(EventEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("events");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["ends_on", true, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["impact_level", true, false],
            ["is_current", false, false],
            ["is_recurring", false, false],
            ["jurisdiction_id", false, false],
            ["starts_on", false, false],
            ["status", false, false],
            ["title", false, false],
            ["type_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "starts_on",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "calendar"."events" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EventLink", () => {
    const metadata = () => dataSource.getMetadata(EventLinkEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("links");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["event_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["role", true, false],
            ["target_id", false, false],
            ["target_kind", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "event_id->calendar.events",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "event_id",
          "target_kind,target_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "calendar"."links" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("File", () => {
    const metadata = () => dataSource.getMetadata(FileEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("files");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["current_version_id", true, false],
            ["folder_id", false, false],
            ["id", false, true],
            ["is_legal_hold", false, false],
            ["name", false, false],
            ["owner_account_id", true, false],
            ["status", false, false],
            ["trashed_at", true, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["visibility", false, false],
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
          "folder_id->filesystem.folders",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "folder_id,name",
          "status,visibility",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."files" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FileAttachment", () => {
    const metadata = () => dataSource.getMetadata(FileAttachmentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("attachments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["file_id", false, false],
            ["id", false, true],
            ["position", false, false],
            ["role", false, false],
            ["target_id", false, false],
            ["target_kind", false, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "target_kind,target_id,role",
          "file_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."attachments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FileEvent", () => {
    const metadata = () => dataSource.getMetadata(FileEventEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("events");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_id", true, false],
            ["created_at", false, false],
            ["detail", true, false],
            ["file_id", false, false],
            ["id", false, true],
            ["kind", false, false],
            ["occurred_at", false, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["version_id", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "file_id,occurred_at",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."events" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FileVariant", () => {
    const metadata = () => dataSource.getMetadata(FileVariantEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("variants");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["derived_object_id", false, false],
            ["id", false, true],
            ["kind", false, false],
            ["object_id", false, false],
            ["parameters", true, false],
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
          "object_id->filesystem.objects",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "object_id,kind",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."variants" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FileVersion", () => {
    const metadata = () => dataSource.getMetadata(FileVersionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("versions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["file_id", false, false],
            ["id", false, true],
            ["note", true, false],
            ["object_id", false, false],
            ["updated_at", false, false],
            ["uploaded_by", true, false],
            ["version", false, false],
            ["version_number", false, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:file_id,version_number",
          "object_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."versions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Folder", () => {
    const metadata = () => dataSource.getMetadata(FolderEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("folders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["depth", false, false],
            ["id", false, true],
            ["name", false, false],
            ["parent_id", true, false],
            ["path", false, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["visibility", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:path",
          "parent_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."folders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Format", () => {
    const metadata = () => dataSource.getMetadata(FormatEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("formats");
      expect(columns(metadata())).toEqual(
        (
          [
            ["category", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["extension", false, false],
            ["id", false, true],
            ["is_previewable", false, false],
            ["max_size_bytes", true, false],
            ["mime_type", false, false],
            ["name", false, false],
            ["processing_strategy", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "mime_type",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."formats" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Store", () => {
    const metadata = () => dataSource.getMetadata(StoreEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("stores");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["configuration_name", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_active", false, false],
            ["kind", false, false],
            ["region", true, false],
            ["tier", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."stores" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("StoredObject", () => {
    const metadata = () => dataSource.getMetadata(StoredObjectEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("objects");
      expect(columns(metadata())).toEqual(
        (
          [
            ["content_hash", false, false],
            ["created_at", false, false],
            ["duration_seconds", true, false],
            ["format_id", true, false],
            ["id", false, true],
            ["media_height", true, false],
            ["media_width", true, false],
            ["object_key", false, false],
            ["page_count", true, false],
            ["scan_status", false, false],
            ["size_bytes", false, false],
            ["store_id", false, false],
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
          "store_id->filesystem.stores",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:store_id,content_hash,size_bytes",
          "unique:store_id,object_key",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."objects" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("UploadSession", () => {
    const metadata = () => dataSource.getMetadata(UploadSessionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("uploads");
      expect(columns(metadata())).toEqual(
        (
          [
            ["completed_file_id", true, false],
            ["created_at", false, false],
            ["expected_hash", true, false],
            ["expected_size_bytes", false, false],
            ["expires_at", false, false],
            ["file_name", false, false],
            ["folder_id", false, false],
            ["id", false, true],
            ["requested_by", true, false],
            ["state", false, false],
            ["store_id", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "state,expires_at",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "filesystem"."uploads" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Budget", () => {
    const metadata = () => dataSource.getMetadata(BudgetEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("budgets");
      expect(columns(metadata())).toEqual(
        (
          [
            ["approved_amount", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fiscal_year_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["legal_basis_id", true, false],
            ["program_code", true, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "unit_id->finance.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unit_id,fiscal_year_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."budgets" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("BudgetaryUnit", () => {
    const metadata = () => dataSource.getMetadata(BudgetaryUnitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["institution_id", true, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_entity_id", true, false],
            ["level_id", false, false],
            ["name", false, false],
            ["parent_unit_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."units" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Expenditure", () => {
    const metadata = () => dataSource.getMetadata(ExpenditureEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("expenditures");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", false, false],
            ["approver_person_id", true, false],
            ["budget_id", false, false],
            ["contract_id", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["stage_id", false, false],
            ["stage_order", false, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "budget_id,stage_order",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."expenditures" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FiscalYear", () => {
    const metadata = () => dataSource.getMetadata(FiscalYearEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("years");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["ends_on", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["starts_on", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."years" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LedgerEntry", () => {
    const metadata = () => dataSource.getMetadata(LedgerEntryEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("entries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["account_code", false, false],
            ["created_at", false, false],
            ["credit_amount", false, false],
            ["currency_code", false, false],
            ["debit_amount", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["posted_on", false, false],
            ["reference_id", true, false],
            ["reference_kind", false, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "unit_id->finance.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unit_id,posted_on",
          "reference_kind,reference_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."entries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("RevenueRecord", () => {
    const metadata = () => dataSource.getMetadata(RevenueRecordEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("revenues");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", false, false],
            ["category_id", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fiscal_year_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["payer_entity_id", true, false],
            ["received_on", false, false],
            ["restriction", false, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "unit_id->finance.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unit_id,fiscal_year_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."revenues" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Transfer", () => {
    const metadata = () => dataSource.getMetadata(TransferEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("transfers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fiscal_year_id", false, false],
            ["from_unit_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["restriction", false, false],
            ["status", false, false],
            ["to_unit_id", false, false],
            ["transfer_type_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "from_unit_id->finance.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "from_unit_id,fiscal_year_id",
          "to_unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "finance"."transfers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoBoundaryVersion", () => {
    const metadata = () => dataSource.getMetadata(GeoBoundaryVersionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("boundaries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["geometry", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["label_point", true, false],
            ["reference_year", true, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
            ["version_number", false, false],
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
          "unit_id->geography.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
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
        dataSource.query('INSERT INTO "geography"."boundaries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoRelationship", () => {
    const metadata = () => dataSource.getMetadata(GeoRelationshipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["child_id", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["parent_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "parent_id->geography.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "parent_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoUnit", () => {
    const metadata = () => dataSource.getMetadata(GeoUnitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_active", false, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["kind", false, false],
            ["level_id", false, false],
            ["name", false, false],
            ["parent_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
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
        dataSource.query('INSERT INTO "geography"."units" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoUnitChange", () => {
    const metadata = () => dataSource.getMetadata(GeoUnitChangeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("changes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["source_unit_id", false, false],
            ["target_unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "source_unit_id->geography.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "source_unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."changes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("GeoUnitNameVersion", () => {
    const metadata = () => dataSource.getMetadata(GeoUnitNameVersionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("names");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["language", true, false],
            ["name", false, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "unit_id->geography.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "geography"."names" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Institution", () => {
    const metadata = () => dataSource.getMetadata(InstitutionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("institutions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["branch_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_basis_id", true, false],
            ["name", false, false],
            ["type_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "jurisdiction_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."institutions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("InstitutionRelationship", () => {
    const metadata = () => dataSource.getMetadata(InstitutionRelationshipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["child_institution_id", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["legal_basis_id", true, false],
            ["parent_institution_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "parent_institution_id->governance.institutions",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "parent_institution_id,kind",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."relationships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Office", () => {
    const metadata = () => dataSource.getMetadata(OfficeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("offices");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["institution_id", false, false],
            ["is_current", false, false],
            ["is_singleton", false, false],
            ["name", false, false],
            ["parent_office_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "institution_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."offices" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("OfficeHolder", () => {
    const metadata = () => dataSource.getMetadata(OfficeHolderEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("holders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["departure_reason", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["office_id", false, false],
            ["person_id", false, false],
            ["selection_procedure_id", true, false],
            ["status", false, false],
            ["term_number", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "office_id->governance.offices",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "office_id,is_current",
          "person_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."holders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("OfficeRule", () => {
    const metadata = () => dataSource.getMetadata(OfficeRuleEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("rules");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["legal_basis_id", true, false],
            ["numeric_value", true, false],
            ["office_id", false, false],
            ["text_value", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "office_id->governance.offices",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "office_id,kind",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."rules" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SelectionProcedure", () => {
    const metadata = () => dataSource.getMetadata(SelectionProcedureEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("procedures");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["method_id", false, false],
            ["office_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "office_id->governance.offices",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "office_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."procedures" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SelectionStage", () => {
    const metadata = () => dataSource.getMetadata(SelectionStageEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("stages");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_institution_id", true, false],
            ["actor_office_id", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["procedure_id", false, false],
            ["stage_order", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "procedure_id->governance.procedures",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "procedure_id,stage_order",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "governance"."stages" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Account", () => {
    const metadata = () => dataSource.getMetadata(AccountEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("accounts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["issuer", false, false],
            ["last_seen_at", true, false],
            ["person_id", true, false],
            ["status", false, false],
            ["subject", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:issuer,subject",
          "person_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "identity"."accounts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("AccountGrant", () => {
    const metadata = () => dataSource.getMetadata(AccountGrantEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("grants");
      expect(columns(metadata())).toEqual(
        (
          [
            ["account_id", false, false],
            ["created_at", false, false],
            ["granted_by", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", true, false],
            ["role", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "account_id->identity.accounts",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "account_id,role",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "identity"."grants" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalAmendment", () => {
    const metadata = () => dataSource.getMetadata(LegalAmendmentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("amendments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amending_instrument_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["is_current", false, false],
            ["summary", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "instrument_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."amendments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalAmendmentChange", () => {
    const metadata = () => dataSource.getMetadata(LegalAmendmentChangeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("changes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amendment_id", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["new_text", true, false],
            ["previous_text", true, false],
            ["provision_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "amendment_id->legal.amendments",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "amendment_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."changes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalAuthorityLink", () => {
    const metadata = () => dataSource.getMetadata(LegalAuthorityLinkEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("links");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["note", true, false],
            ["provision_id", false, false],
            ["target_id", false, false],
            ["target_kind", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "provision_id->legal.provisions",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "target_kind,target_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."links" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalInstrument", () => {
    const metadata = () => dataSource.getMetadata(LegalInstrumentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("instruments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["content_hash", true, false],
            ["created_at", false, false],
            ["document_url", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["issuing_institution_id", true, false],
            ["jurisdiction_id", false, false],
            ["kind_id", false, false],
            ["status", false, false],
            ["summary", true, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "jurisdiction_id,status",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal"."instruments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalProvision", () => {
    const metadata = () => dataSource.getMetadata(LegalProvisionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("provisions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["citation", false, false],
            ["code", false, false],
            ["content", true, false],
            ["created_at", false, false],
            ["heading", true, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["is_current", false, false],
            ["kind", false, false],
            ["parent_id", true, false],
            ["previous_version_id", true, false],
            ["sort_order", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:instrument_id,code,version",
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

  describe("Person", () => {
    const metadata = () => dataSource.getMetadata(PersonEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("individuals");
      expect(columns(metadata())).toEqual(
        (
          [
            ["birth_date", true, false],
            ["birth_date_precision", true, false],
            ["birth_place_id", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["death_date", true, false],
            ["death_date_precision", true, false],
            ["display_name", false, false],
            ["family_name", true, false],
            ["given_name", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["life_status", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "person"."individuals" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PersonContact", () => {
    const metadata = () => dataSource.getMetadata(PersonContactEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("contacts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["exposure", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["label", true, false],
            ["office_id", true, false],
            ["person_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "person_id->person.individuals",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "person_id,exposure",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "person"."contacts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PersonHandle", () => {
    const metadata = () => dataSource.getMetadata(PersonHandleEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("handles");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["exposure", false, false],
            ["handle", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["is_verified", false, false],
            ["person_id", false, false],
            ["platform_id", false, false],
            ["updated_at", false, false],
            ["url", true, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "person_id->person.individuals",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "person_id,exposure",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "person"."handles" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PersonName", () => {
    const metadata = () => dataSource.getMetadata(PersonNameEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("names");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["language", true, false],
            ["name", false, false],
            ["person_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "person_id->person.individuals",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "person_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "person"."names" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PersonProfile", () => {
    const metadata = () => dataSource.getMetadata(PersonProfileEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("profiles");
      expect(columns(metadata())).toEqual(
        (
          [
            ["biography", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["language", true, false],
            ["nationality_id", true, false],
            ["occupation", true, false],
            ["person_id", false, false],
            ["summary", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "person_id->person.individuals",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "person_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "person"."profiles" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Ideology", () => {
    const metadata = () => dataSource.getMetadata(IdeologyEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("ideologies");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["label", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "political"."ideologies" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Party", () => {
    const metadata = () => dataSource.getMetadata(PartyEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("parties");
      expect(columns(metadata())).toEqual(
        (
          [
            ["abbreviation", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["name", false, false],
            ["registry_authority_id", true, false],
            ["registry_identifier", true, false],
            ["status", false, false],
            ["symbol_url", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "jurisdiction_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "political"."parties" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyIdeology", () => {
    const metadata = () => dataSource.getMetadata(PartyIdeologyEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("alignments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["ideology_id", false, false],
            ["is_current", false, false],
            ["party_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "party_id->political.parties",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "party_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "political"."alignments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyMembership", () => {
    const metadata = () => dataSource.getMetadata(PartyMembershipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("memberships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["party_id", false, false],
            ["person_id", false, false],
            ["role_title", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "party_id->political.parties",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "party_id",
          "person_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "political"."memberships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyPosition", () => {
    const metadata = () => dataSource.getMetadata(PartyPositionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("positions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["title", false, false],
            ["unit_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "unit_id->political.units",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:unit_id,code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "political"."positions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyPositionHolder", () => {
    const metadata = () => dataSource.getMetadata(PartyPositionHolderEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("holders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["is_acting", false, false],
            ["is_current", false, false],
            ["person_id", false, false],
            ["position_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "position_id->political.positions",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "position_id",
          "person_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "political"."holders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyUnit", () => {
    const metadata = () => dataSource.getMetadata(PartyUnitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["level_id", false, false],
            ["name", false, false],
            ["parent_unit_id", true, false],
            ["party_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "party_id->political.parties",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:party_id,code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "political"."units" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Bid", () => {
    const metadata = () => dataSource.getMetadata(BidEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("bids");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", false, false],
            ["bidder_entity_id", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["evaluation_note", true, false],
            ["id", false, true],
            ["is_compliant", true, false],
            ["is_current", false, false],
            ["status", false, false],
            ["submitted_on", false, false],
            ["tender_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "tender_id->procurement.tenders",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "tender_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "procurement"."bids" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ContractMilestone", () => {
    const metadata = () => dataSource.getMetadata(ContractMilestoneEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("milestones");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", true, false],
            ["completed_on", true, false],
            ["contract_id", false, false],
            ["created_at", false, false],
            ["currency_code", true, false],
            ["due_on", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "contract_id->procurement.contracts",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "contract_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "procurement"."milestones" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ContractVariation", () => {
    const metadata = () => dataSource.getMetadata(ContractVariationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("variations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_change", false, false],
            ["approved_on", true, false],
            ["contract_id", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["reason", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "contract_id->procurement.contracts",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "contract_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "procurement"."variations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ProcurementContract", () => {
    const metadata = () => dataSource.getMetadata(ProcurementContractEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("contracts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["awarded_entity_id", false, false],
            ["awarded_on", true, false],
            ["code", false, false],
            ["contracting_office_id", true, false],
            ["contracting_unit_id", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["status", false, false],
            ["tender_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "tender_id->procurement.tenders",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "tender_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "procurement"."contracts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Tender", () => {
    const metadata = () => dataSource.getMetadata(TenderEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("tenders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["budget_id", true, false],
            ["closes_on", true, false],
            ["code", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["estimated_value", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["issuing_unit_id", false, false],
            ["kind_id", false, false],
            ["legal_basis_id", true, false],
            ["method_id", false, false],
            ["procuring_office_id", true, false],
            ["published_on", true, false],
            ["status", false, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "issuing_unit_id,status",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "procurement"."tenders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ClassificationRecord", () => {
    const metadata = () => dataSource.getMetadata(ClassificationRecordEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("classifications");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["label", false, false],
            ["legal_basis", true, false],
            ["order", true, false],
            ["scheme", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "jurisdiction_id->reference.jurisdictions",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:jurisdiction_id,scheme,code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."classifications" DEFAULT VALUES'),
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
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["name", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "reference"."jurisdictions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Amenity", () => {
    const metadata = () => dataSource.getMetadata(AmenityEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("amenities");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_active", false, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["name", false, false],
            ["sector_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "geo_unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."amenities" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("AmenityOffice", () => {
    const metadata = () => dataSource.getMetadata(AmenityOfficeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("posts");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amenity_id", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["office_id", false, false],
            ["role_kind_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "amenity_id->civic.amenities",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "amenity_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."posts" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PublicService", () => {
    const metadata = () => dataSource.getMetadata(PublicServiceEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("services");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_basis_id", true, false],
            ["name", false, false],
            ["sector_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."services" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ServiceDelivery", () => {
    const metadata = () => dataSource.getMetadata(ServiceDeliveryEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("deliveries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amenity_id", false, false],
            ["budget_id", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["responsible_office_id", true, false],
            ["service_id", false, false],
            ["status", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "amenity_id->civic.amenities",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "amenity_id",
          "service_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "civic"."deliveries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Attribution", () => {
    const metadata = () => dataSource.getMetadata(AttributionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("attributions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["attributed_by", true, false],
            ["capture_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["document_id", false, false],
            ["id", false, true],
            ["locator", true, false],
            ["method_id", false, false],
            ["relation", false, false],
            ["target_field", true, false],
            ["target_id", false, false],
            ["target_kind", false, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "target_kind,target_id",
          "document_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."attributions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Capture", () => {
    const metadata = () => dataSource.getMetadata(CaptureEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("captures");
      expect(columns(metadata())).toEqual(
        (
          [
            ["assessment_id", true, false],
            ["content_hash", true, false],
            ["created_at", false, false],
            ["document_id", false, false],
            ["domain_id", true, false],
            ["family_version_id", true, false],
            ["file_version_id", true, false],
            ["http_status", true, false],
            ["id", false, true],
            ["retrieved_at", false, false],
            ["retrieved_by", true, false],
            ["retrieved_url", true, false],
            ["site_id", true, false],
            ["structure_version_id", true, false],
            ["tool", true, false],
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
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "document_id,retrieved_at",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."captures" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Document", () => {
    const metadata = () => dataSource.getMetadata(DocumentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("documents");
      expect(columns(metadata())).toEqual(
        (
          [
            ["citation", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["jurisdiction_id", true, false],
            ["kind_id", false, false],
            ["language", true, false],
            ["licence", true, false],
            ["published_on", true, false],
            ["published_on_precision", true, false],
            ["publisher_id", false, false],
            ["site_id", true, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["url", true, false],
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
          "publisher_id->source.publishers",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "publisher_id",
          "published_on",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."documents" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Method", () => {
    const metadata = () => dataSource.getMetadata(MethodEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("methods");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["kind", false, false],
            ["model", true, false],
            ["name", false, false],
            ["tool", true, false],
            ["tool_version", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "kind",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."methods" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Publisher", () => {
    const metadata = () => dataSource.getMetadata(PublisherEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("publishers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["jurisdiction_id", true, false],
            ["kind_id", false, false],
            ["name", false, false],
            ["reliability", true, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["website_url", true, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."publishers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Verification", () => {
    const metadata = () => dataSource.getMetadata(VerificationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("verifications");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["decided_by", true, false],
            ["decision_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["rationale", true, false],
            ["state", false, false],
            ["target_id", false, false],
            ["target_kind", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "target_kind,target_id,is_current",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "source"."verifications" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Indicator", () => {
    const metadata = () => dataSource.getMetadata(IndicatorEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("indicators");
      expect(columns(metadata())).toEqual(
        (
          [
            ["category_id", false, false],
            ["code", false, false],
            ["created_at", false, false],
            ["definition", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["name", false, false],
            ["parent_id", true, false],
            ["unit_of_measure", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "category_id->statistical.categories",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "statistical"."indicators" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("IndicatorCategory", () => {
    const metadata = () => dataSource.getMetadata(IndicatorCategoryEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("categories");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["label", false, false],
            ["parent_id", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "statistical"."categories" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("IndicatorColumn", () => {
    const metadata = () => dataSource.getMetadata(IndicatorColumnEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("fields");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["data_type", false, false],
            ["id", false, true],
            ["indicator_id", false, false],
            ["is_current", false, false],
            ["label", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "indicator_id->statistical.indicators",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "statistical"."fields" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Observation", () => {
    const metadata = () => dataSource.getMetadata(ObservationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("observations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["column_id", true, false],
            ["confidence_level", false, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["indicator_id", false, false],
            ["is_current", false, false],
            ["numeric_value", true, false],
            ["period_id", false, false],
            ["table_id", false, false],
            ["text_value", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "table_id->statistical.datasets",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "table_id",
          "indicator_id,period_id,geo_unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "statistical"."observations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Period", () => {
    const metadata = () => dataSource.getMetadata(PeriodEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("periods");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["ends_on", false, false],
            ["granularity", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["starts_on", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "statistical"."periods" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("StatisticsTable", () => {
    const metadata = () => dataSource.getMetadata(StatisticsTableEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("datasets");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["collector", true, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["indicator_id", true, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["methodology", true, false],
            ["publisher_institution_id", true, false],
            ["title", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "statistical"."datasets" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Assessment", () => {
    const metadata = () => dataSource.getMetadata(AssessmentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("assessments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["access_basis", false, false],
            ["access_conditions", true, false],
            ["approved_scope", false, false],
            ["conditions", true, false],
            ["created_at", false, false],
            ["evidence", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", true, false],
            ["lawful_basis", true, false],
            ["licence_name", true, false],
            ["licence_url", true, false],
            ["licence_version", true, false],
            ["personal_data_categories", false, false],
            ["processing_purpose", true, false],
            ["rationale", true, false],
            ["review_due_at", true, false],
            ["reviewed_at", true, false],
            ["reviewed_by", true, false],
            ["rights_holder", false, false],
            ["site_id", false, false],
            ["source_type", false, false],
            ["status", false, false],
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
          "site_id->website.sites",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "site_id,is_current",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."assessments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("DomainPattern", () => {
    const metadata = () => dataSource.getMetadata(DomainPatternEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("domain_patterns");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["domain_role", false, false],
            ["family_id", false, false],
            ["id", false, true],
            ["notes", true, false],
            ["scheme", false, false],
            ["status", false, false],
            ["template", false, false],
            ["updated_at", false, false],
            ["variables", false, false],
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
          "family_id->website.families",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "family_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."domain_patterns" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Dossier", () => {
    const metadata = () => dataSource.getMetadata(DossierEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("dossiers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["applicable_laws", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["launch_stage", false, false],
            ["legislation_repository_url", true, false],
            ["open_questions", true, false],
            ["regulator", true, false],
            ["review_due_at", true, false],
            ["reviewed_at", true, false],
            ["reviewer_id", true, false],
            ["supersedes_id", true, false],
            ["treaty_status", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "jurisdiction_id,is_current",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."dossiers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Site", () => {
    const metadata = () => dataSource.getMetadata(SiteEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("sites");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["first_seen_at", true, false],
            ["id", false, true],
            ["jurisdiction_id", true, false],
            ["kind", false, false],
            ["last_seen_at", true, false],
            ["name", false, false],
            ["status", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
          "status",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."sites" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteCheck", () => {
    const metadata = () => dataSource.getMetadata(SiteCheckEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("checks");
      expect(columns(metadata())).toEqual(
        (
          [
            ["checked_at", false, false],
            ["created_at", false, false],
            ["detail", true, false],
            ["id", false, true],
            ["kind", false, false],
            ["outcome", false, false],
            ["site_id", false, false],
            ["structure_version_id", true, false],
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
          "site_id->website.sites",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "site_id,checked_at",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."checks" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteDomain", () => {
    const metadata = () => dataSource.getMetadata(SiteDomainEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("domains");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["hostname", false, false],
            ["id", false, true],
            ["observed_at", true, false],
            ["role", false, false],
            ["scheme", false, false],
            ["site_id", false, false],
            ["updated_at", false, false],
            ["valid_from", false, false],
            ["valid_from_precision", false, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
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
          "site_id->website.sites",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:site_id,hostname,valid_from",
          "hostname",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."domains" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteFamily", () => {
    const metadata = () => dataSource.getMetadata(SiteFamilyEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("families");
      expect(columns(metadata())).toEqual(
        (
          [
            ["code", false, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["jurisdiction_id", true, false],
            ["kind", false, false],
            ["name", false, false],
            ["status", false, false],
            ["subject_kind_id", true, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:code",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."families" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteFingerprint", () => {
    const metadata = () => dataSource.getMetadata(SiteFingerprintEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("fingerprints");
      expect(columns(metadata())).toEqual(
        (
          [
            ["check_id", true, false],
            ["computed_at", false, false],
            ["created_at", false, false],
            ["digest", false, false],
            ["features", false, false],
            ["id", false, true],
            ["kind", false, false],
            ["site_id", false, false],
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
          "site_id->website.sites",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "site_id,kind,computed_at",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."fingerprints" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteMember", () => {
    const metadata = () => dataSource.getMetadata(SiteMemberEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("members");
      expect(columns(metadata())).toEqual(
        (
          [
            ["basis", false, false],
            ["created_at", false, false],
            ["family_id", false, false],
            ["id", false, true],
            ["method_id", true, false],
            ["role", false, false],
            ["score", true, false],
            ["site_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_to", true, false],
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
          "site_id->website.sites",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "site_id",
          "family_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."members" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SitePublisher", () => {
    const metadata = () => dataSource.getMetadata(SitePublisherEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("site_publishers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["publisher_id", false, false],
            ["role", false, false],
            ["site_id", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_to", true, false],
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
          "site_id->website.sites",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "site_id",
          "publisher_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."site_publishers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteRelation", () => {
    const metadata = () => dataSource.getMetadata(SiteRelationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("relations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["basis", false, false],
            ["created_at", false, false],
            ["evidence", true, false],
            ["from_id", false, false],
            ["from_kind", false, false],
            ["id", false, true],
            ["relation", false, false],
            ["score", true, false],
            ["to_id", false, false],
            ["to_kind", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "from_kind,from_id",
          "to_kind,to_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."relations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteSubject", () => {
    const metadata = () => dataSource.getMetadata(SiteSubjectEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("subjects");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["relation", false, false],
            ["site_id", false, false],
            ["target_id", false, false],
            ["target_kind", false, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_to", true, false],
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
          "site_id->website.sites",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "site_id",
          "target_kind,target_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."subjects" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SiteTrait", () => {
    const metadata = () => dataSource.getMetadata(SiteTraitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("traits");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["id", false, true],
            ["method_id", true, false],
            ["observed_at", true, false],
            ["owner_id", false, false],
            ["owner_kind", false, false],
            ["score", true, false],
            ["tag", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "owner_kind,owner_id",
          "tag",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."traits" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Structure", () => {
    const metadata = () => dataSource.getMetadata(StructureEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("structures");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["current_version_id", true, false],
            ["id", false, true],
            ["owner_id", false, false],
            ["owner_kind", false, false],
            ["purpose", false, false],
            ["status", false, false],
            ["updated_at", false, false],
            ["version", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:owner_kind,owner_id,purpose",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."structures" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("StructureFile", () => {
    const metadata = () => dataSource.getMetadata(StructureFileEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("structure_files");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["file_version_id", false, false],
            ["id", false, true],
            ["path", false, false],
            ["role", false, false],
            ["updated_at", false, false],
            ["version", false, false],
            ["version_id", false, false],
          ] as Array<[string, boolean, boolean]>
        ).sort(([left], [right]) => left.localeCompare(right)),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:version_id,path",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."structure_files" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("StructureVersion", () => {
    const metadata = () => dataSource.getMetadata(StructureVersionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("structure_versions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["created_at", false, false],
            ["created_by", true, false],
            ["folder_id", true, false],
            ["id", false, true],
            ["manifest_hash", false, false],
            ["method_id", true, false],
            ["notes_summary", true, false],
            ["number", false, false],
            ["schema_version", false, false],
            ["status", false, false],
            ["structure_id", false, false],
            ["supersedes_id", true, false],
            ["updated_at", false, false],
            ["validation_report", true, false],
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
          "structure_id->website.structures",
        ].sort(),
      );
    });

    it("declares the contract's indexes", () => {
      const indexes = metadata()
        .indices.map((index) => `${index.isUnique ? "unique:" : ""}${index.columns.map((item) => item.databaseName).join(",")}`)
        .sort();
      expect(indexes).toEqual(
        expect.arrayContaining([
          "unique:structure_id,number",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "website"."structure_versions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });
});