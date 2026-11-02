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
import { PersonNameEntity } from "#/modules/governance/entities/person-name.entity.ts";
import { PersonEntity } from "#/modules/governance/entities/person.entity.ts";
import { SelectionProcedureEntity } from "#/modules/governance/entities/selection-procedure.entity.ts";
import { SelectionStageEntity } from "#/modules/governance/entities/selection-stage.entity.ts";
import { LegalAmendmentChangeEntity } from "#/modules/legal/entities/legal-amendment-change.entity.ts";
import { LegalAmendmentEntity } from "#/modules/legal/entities/legal-amendment.entity.ts";
import { LegalAuthorityLinkEntity } from "#/modules/legal/entities/legal-authority-link.entity.ts";
import { LegalInstrumentEntity } from "#/modules/legal/entities/legal-instrument.entity.ts";
import { LegalProvisionEntity } from "#/modules/legal/entities/legal-provision.entity.ts";
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
import { IndicatorCategoryEntity } from "#/modules/statistics/entities/indicator-category.entity.ts";
import { IndicatorColumnEntity } from "#/modules/statistics/entities/indicator-column.entity.ts";
import { IndicatorEntity } from "#/modules/statistics/entities/indicator.entity.ts";
import { ObservationEntity } from "#/modules/statistics/entities/observation.entity.ts";
import { PeriodEntity } from "#/modules/statistics/entities/period.entity.ts";
import { StatisticsTableEntity } from "#/modules/statistics/entities/statistics-table.entity.ts";

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
  PersonEntity,
  PersonNameEntity,
  SelectionProcedureEntity,
  SelectionStageEntity,
  LegalAmendmentEntity,
  LegalAmendmentChangeEntity,
  LegalAuthorityLinkEntity,
  LegalInstrumentEntity,
  LegalProvisionEntity,
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
  IndicatorEntity,
  IndicatorCategoryEntity,
  IndicatorColumnEntity,
  ObservationEntity,
  PeriodEntity,
  StatisticsTableEntity,
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
        dataSource.query('INSERT INTO "comments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EvidenceReference", () => {
    const metadata = () => dataSource.getMetadata(EvidenceReferenceEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("evidence_references");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_id", false, false],
            ["artifact_checksum", false, false],
            ["artifact_id", false, false],
            ["created_at", false, false],
            ["id", false, true],
            ["media_type", false, false],
            ["note", true, false],
            ["size_bytes", false, false],
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
          "artifact_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "evidence_references" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ReviewDecision", () => {
    const metadata = () => dataSource.getMetadata(ReviewDecisionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("review_decisions");
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
        dataSource.query('INSERT INTO "review_decisions" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["borrower_unit_id", false, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["interest_rate", true, false],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["lender_entity_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["principal_amount", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["term_months", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "borrower_unit_id->budgetary_units",
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
          "borrower_unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "loans" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LoanDisbursement", () => {
    const metadata = () => dataSource.getMetadata(LoanDisbursementEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("loan_disbursements");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", false, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["disbursed_on", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["ledger_entry_id", true, false],
            ["licence", true, false],
            ["loan_id", false, false],
            ["method", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "loan_id->loans",
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
        dataSource.query('INSERT INTO "loan_disbursements" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LoanRepayment", () => {
    const metadata = () => dataSource.getMetadata(LoanRepaymentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("loan_repayments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fees_paid", true, false],
            ["id", false, true],
            ["interest_paid", false, false],
            ["is_current", false, false],
            ["ledger_entry_id", true, false],
            ["licence", true, false],
            ["loan_id", false, false],
            ["method", false, false],
            ["paid_on", false, false],
            ["principal_paid", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "loan_id->loans",
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
        dataSource.query('INSERT INTO "loan_repayments" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["is_independent", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["nomination_status", false, false],
            ["party_id", true, false],
            ["person_id", false, false],
            ["retrieved_at", true, false],
            ["seat_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "seat_id->seats",
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
        dataSource.query('INSERT INTO "candidates" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["held_date", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["retrieved_at", true, false],
            ["scheduled_date", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["tool_or_model", true, false],
            ["type_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
          "jurisdiction_id,status",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "elections" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ElectionResult", () => {
    const metadata = () => dataSource.getMetadata(ElectionResultEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("election_results");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["candidate_id", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["declared_at", true, false],
            ["declaring_institution_id", true, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["is_winner", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["rank", true, false],
            ["result_level_id", false, false],
            ["retrieved_at", true, false],
            ["seat_id", false, false],
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
          "candidate_id->candidates",
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
        dataSource.query('INSERT INTO "election_results" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["candidate_id", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["document_url", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["language", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["published_on", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["title", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "candidate_id->candidates",
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
        dataSource.query('INSERT INTO "manifestos" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ManifestoCommitment", () => {
    const metadata = () => dataSource.getMetadata(ManifestoCommitmentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("manifesto_commitments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["manifesto_id", false, false],
            ["method", false, false],
            ["parent_id", true, false],
            ["retrieved_at", true, false],
            ["sort_order", false, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["text", false, false],
            ["tool_or_model", true, false],
            ["topic_id", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "manifesto_id->manifestos",
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
        dataSource.query('INSERT INTO "manifesto_commitments" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["election_id", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["office_id", true, false],
            ["positions", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "election_id->elections",
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
        dataSource.query('INSERT INTO "seats" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EntityIdentifier", () => {
    const metadata = () => dataSource.getMetadata(EntityIdentifierEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("entity_identifiers");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["entity_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["issuing_authority_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["scheme_id", false, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["value", false, false],
            ["verification_state", false, false],
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
          "entity_id->legal_entities",
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
        dataSource.query('INSERT INTO "entity_identifiers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EntityLocation", () => {
    const metadata = () => dataSource.getMetadata(EntityLocationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("entity_locations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["address_text", true, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["entity_id", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind_id", true, false],
            ["licence", true, false],
            ["method", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "entity_id->legal_entities",
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
        dataSource.query('INSERT INTO "entity_locations" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EntityOwnership", () => {
    const metadata = () => dataSource.getMetadata(EntityOwnershipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("entity_ownerships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["entity_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["owner_entity_id", true, false],
            ["owner_person_id", true, false],
            ["percentage", true, false],
            ["position", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "entity_id->legal_entities",
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
        dataSource.query('INSERT INTO "entity_ownerships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalEntity", () => {
    const metadata = () => dataSource.getMetadata(LegalEntityEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("legal_entities");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["entity_type_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["official_name", false, false],
            ["parent_entity_id", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
          "jurisdiction_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal_entities" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["ends_on", true, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["impact_level", true, false],
            ["is_current", false, false],
            ["is_recurring", false, false],
            ["jurisdiction_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["starts_on", false, false],
            ["status", false, false],
            ["title", false, false],
            ["tool_or_model", true, false],
            ["type_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
          "starts_on",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "events" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("EventLink", () => {
    const metadata = () => dataSource.getMetadata(EventLinkEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("event_links");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["event_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["role", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["target_id", false, false],
            ["target_kind", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "event_id->events",
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
        dataSource.query('INSERT INTO "event_links" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fiscal_year_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["program_code", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "unit_id->budgetary_units",
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
        dataSource.query('INSERT INTO "budgets" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("BudgetaryUnit", () => {
    const metadata = () => dataSource.getMetadata(BudgetaryUnitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("budgetary_units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["institution_id", true, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_entity_id", true, false],
            ["level_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["parent_unit_id", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
        dataSource.query('INSERT INTO "budgetary_units" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["budget_id", false, false],
            ["confidence", true, false],
            ["contract_id", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["stage_id", false, false],
            ["stage_order", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "budget_id->budgets",
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
        dataSource.query('INSERT INTO "expenditures" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("FiscalYear", () => {
    const metadata = () => dataSource.getMetadata(FiscalYearEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("fiscal_years");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["ends_on", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["starts_on", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
        dataSource.query('INSERT INTO "fiscal_years" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LedgerEntry", () => {
    const metadata = () => dataSource.getMetadata(LedgerEntryEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("ledger_entries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["account_code", false, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["credit_amount", false, false],
            ["currency_code", false, false],
            ["debit_amount", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["posted_on", false, false],
            ["reference_id", true, false],
            ["reference_kind", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "unit_id->budgetary_units",
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
        dataSource.query('INSERT INTO "ledger_entries" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("RevenueRecord", () => {
    const metadata = () => dataSource.getMetadata(RevenueRecordEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("revenue_records");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", false, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["category_id", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fiscal_year_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["payer_entity_id", true, false],
            ["received_on", false, false],
            ["restriction", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "unit_id->budgetary_units",
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
        dataSource.query('INSERT INTO "revenue_records" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["fiscal_year_id", false, false],
            ["from_unit_id", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["restriction", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["to_unit_id", false, false],
            ["tool_or_model", true, false],
            ["transfer_type_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "from_unit_id->budgetary_units",
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
        dataSource.query('INSERT INTO "transfers" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "unit_id->geo_units",
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "parent_id->geo_units",
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "source_unit_id->geo_units",
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "unit_id->geo_units",
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
        dataSource.query('INSERT INTO "geo_unit_name_versions" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["branch_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["type_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
          "jurisdiction_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "institutions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("InstitutionRelationship", () => {
    const metadata = () => dataSource.getMetadata(InstitutionRelationshipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("institution_relationships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["child_institution_id", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["parent_institution_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "parent_institution_id->institutions",
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
        dataSource.query('INSERT INTO "institution_relationships" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["institution_id", false, false],
            ["is_current", false, false],
            ["is_singleton", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["parent_office_id", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "institution_id->institutions",
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
        dataSource.query('INSERT INTO "offices" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("OfficeHolder", () => {
    const metadata = () => dataSource.getMetadata(OfficeHolderEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("office_holders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["departure_reason", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["office_id", false, false],
            ["person_id", false, false],
            ["retrieved_at", true, false],
            ["selection_procedure_id", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["term_number", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "office_id->offices",
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
        dataSource.query('INSERT INTO "office_holders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("OfficeRule", () => {
    const metadata = () => dataSource.getMetadata(OfficeRuleEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("office_rules");
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
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["numeric_value", true, false],
            ["office_id", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["text_value", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "office_id->offices",
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
        dataSource.query('INSERT INTO "office_rules" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("Person", () => {
    const metadata = () => dataSource.getMetadata(PersonEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("people");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["birth_date", true, false],
            ["birth_date_precision", true, false],
            ["birth_place_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["death_date", true, false],
            ["death_date_precision", true, false],
            ["display_name", false, false],
            ["family_name", true, false],
            ["given_name", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["life_status", false, false],
            ["method", false, false],
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
        dataSource.query('INSERT INTO "people" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PersonName", () => {
    const metadata = () => dataSource.getMetadata(PersonNameEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("person_names");
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
            ["language", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["person_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "person_id->people",
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
        dataSource.query('INSERT INTO "person_names" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SelectionProcedure", () => {
    const metadata = () => dataSource.getMetadata(SelectionProcedureEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("selection_procedures");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["method_id", false, false],
            ["office_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "office_id->offices",
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
        dataSource.query('INSERT INTO "selection_procedures" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("SelectionStage", () => {
    const metadata = () => dataSource.getMetadata(SelectionStageEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("selection_stages");
      expect(columns(metadata())).toEqual(
        (
          [
            ["actor_institution_id", true, false],
            ["actor_office_id", true, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["procedure_id", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["stage_order", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "procedure_id->selection_procedures",
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
        dataSource.query('INSERT INTO "selection_stages" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalAmendment", () => {
    const metadata = () => dataSource.getMetadata(LegalAmendmentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("legal_amendments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amending_instrument_id", true, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["summary", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "instrument_id->legal_instruments",
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
        dataSource.query('INSERT INTO "legal_amendments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalAmendmentChange", () => {
    const metadata = () => dataSource.getMetadata(LegalAmendmentChangeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("legal_amendment_changes");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amendment_id", false, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["kind", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["new_text", true, false],
            ["previous_text", true, false],
            ["provision_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "amendment_id->legal_amendments",
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
        dataSource.query('INSERT INTO "legal_amendment_changes" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalAuthorityLink", () => {
    const metadata = () => dataSource.getMetadata(LegalAuthorityLinkEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("legal_authority_links");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["note", true, false],
            ["provision_id", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["target_id", false, false],
            ["target_kind", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "provision_id->legal_provisions",
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
        dataSource.query('INSERT INTO "legal_authority_links" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalInstrument", () => {
    const metadata = () => dataSource.getMetadata(LegalInstrumentEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("legal_instruments");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["content_hash", true, false],
            ["created_at", false, false],
            ["document_url", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["issuing_institution_id", true, false],
            ["jurisdiction_id", false, false],
            ["kind_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["summary", true, false],
            ["title", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
          "jurisdiction_id,status",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "legal_instruments" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("LegalProvision", () => {
    const metadata = () => dataSource.getMetadata(LegalProvisionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("legal_provisions");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["citation", false, false],
            ["code", false, false],
            ["confidence", true, false],
            ["content", true, false],
            ["created_at", false, false],
            ["heading", true, false],
            ["id", false, true],
            ["instrument_id", false, false],
            ["is_current", false, false],
            ["kind", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["parent_id", true, false],
            ["previous_version_id", true, false],
            ["retrieved_at", true, false],
            ["sort_order", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "instrument_id->legal_instruments",
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
        dataSource.query('INSERT INTO "legal_provisions" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["label", false, false],
            ["licence", true, false],
            ["method", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
        dataSource.query('INSERT INTO "ideologies" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["registry_authority_id", true, false],
            ["registry_identifier", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["symbol_url", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
          "jurisdiction_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "parties" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyIdeology", () => {
    const metadata = () => dataSource.getMetadata(PartyIdeologyEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("party_ideologies");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["ideology_id", false, false],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["party_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "party_id->parties",
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
        dataSource.query('INSERT INTO "party_ideologies" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyMembership", () => {
    const metadata = () => dataSource.getMetadata(PartyMembershipEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("party_memberships");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["party_id", false, false],
            ["person_id", false, false],
            ["retrieved_at", true, false],
            ["role_title", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "party_id->parties",
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
        dataSource.query('INSERT INTO "party_memberships" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyPosition", () => {
    const metadata = () => dataSource.getMetadata(PartyPositionEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("party_positions");
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
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["title", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "unit_id->party_units",
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
        dataSource.query('INSERT INTO "party_positions" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyPositionHolder", () => {
    const metadata = () => dataSource.getMetadata(PartyPositionHolderEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("party_position_holders");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_acting", false, false],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["person_id", false, false],
            ["position_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "position_id->party_positions",
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
        dataSource.query('INSERT INTO "party_position_holders" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PartyUnit", () => {
    const metadata = () => dataSource.getMetadata(PartyUnitEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("party_units");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["level_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["parent_unit_id", true, false],
            ["party_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "party_id->parties",
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
        dataSource.query('INSERT INTO "party_units" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["bidder_entity_id", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["evaluation_note", true, false],
            ["id", false, true],
            ["is_compliant", true, false],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["submitted_on", false, false],
            ["tender_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "tender_id->tenders",
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
        dataSource.query('INSERT INTO "bids" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ContractMilestone", () => {
    const metadata = () => dataSource.getMetadata(ContractMilestoneEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("contract_milestones");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount", true, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["completed_on", true, false],
            ["confidence", true, false],
            ["contract_id", false, false],
            ["created_at", false, false],
            ["currency_code", true, false],
            ["due_on", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["title", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "contract_id->contracts",
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
        dataSource.query('INSERT INTO "contract_milestones" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ContractVariation", () => {
    const metadata = () => dataSource.getMetadata(ContractVariationEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("contract_variations");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amount_change", false, false],
            ["approved_on", true, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["contract_id", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["reason", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "contract_id->contracts",
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
        dataSource.query('INSERT INTO "contract_variations" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["awarded_entity_id", false, false],
            ["awarded_on", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["contracting_office_id", true, false],
            ["contracting_unit_id", false, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["tender_id", false, false],
            ["tool_or_model", true, false],
            ["updated_at", false, false],
            ["valid_from", true, false],
            ["valid_from_precision", true, false],
            ["valid_to", true, false],
            ["valid_to_precision", true, false],
            ["value", false, false],
            ["verification_state", false, false],
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
          "tender_id->tenders",
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
        dataSource.query('INSERT INTO "contracts" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["budget_id", true, false],
            ["closes_on", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["currency_code", false, false],
            ["estimated_value", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["issuing_unit_id", false, false],
            ["kind_id", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["method_id", false, false],
            ["procuring_office_id", true, false],
            ["published_on", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
            ["title", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "issuing_unit_id->budgetary_units",
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
          "issuing_unit_id,status",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "tenders" DEFAULT VALUES'),
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
        dataSource.query('INSERT INTO "jurisdictions" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["is_active", false, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["retrieved_at", true, false],
            ["sector_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
          "geo_unit_id",
        ]),
      );
    });

    it("rejects a row without its required columns", async () => {
      await expect(
        dataSource.query('INSERT INTO "amenities" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("AmenityOffice", () => {
    const metadata = () => dataSource.getMetadata(AmenityOfficeEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("amenity_offices");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amenity_id", false, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["office_id", false, false],
            ["retrieved_at", true, false],
            ["role_kind_id", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "amenity_id->amenities",
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
        dataSource.query('INSERT INTO "amenity_offices" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("PublicService", () => {
    const metadata = () => dataSource.getMetadata(PublicServiceEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("public_services");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["description", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["legal_basis_id", true, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["retrieved_at", true, false],
            ["sector_id", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
        dataSource.query('INSERT INTO "public_services" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("ServiceDelivery", () => {
    const metadata = () => dataSource.getMetadata(ServiceDeliveryEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("service_deliveries");
      expect(columns(metadata())).toEqual(
        (
          [
            ["amenity_id", false, false],
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["budget_id", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["responsible_office_id", true, false],
            ["retrieved_at", true, false],
            ["service_id", false, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["status", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "amenity_id->amenities",
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
        dataSource.query('INSERT INTO "service_deliveries" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["category_id", false, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["definition", true, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["name", false, false],
            ["parent_id", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["tool_or_model", true, false],
            ["unit_of_measure", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "category_id->indicator_categories",
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
        dataSource.query('INSERT INTO "indicators" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("IndicatorCategory", () => {
    const metadata = () => dataSource.getMetadata(IndicatorCategoryEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("indicator_categories");
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
            ["label", false, false],
            ["licence", true, false],
            ["method", false, false],
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
        dataSource.query('INSERT INTO "indicator_categories" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("IndicatorColumn", () => {
    const metadata = () => dataSource.getMetadata(IndicatorColumnEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("indicator_columns");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["data_type", false, false],
            ["id", false, true],
            ["indicator_id", false, false],
            ["is_current", false, false],
            ["label", false, false],
            ["licence", true, false],
            ["method", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "indicator_id->indicators",
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
        dataSource.query('INSERT INTO "indicator_columns" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["column_id", true, false],
            ["confidence", true, false],
            ["confidence_level", false, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["indicator_id", false, false],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["numeric_value", true, false],
            ["period_id", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["table_id", false, false],
            ["text_value", true, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "table_id->statistics_tables",
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
        dataSource.query('INSERT INTO "observations" DEFAULT VALUES'),
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
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["ends_on", false, false],
            ["granularity", false, false],
            ["id", false, true],
            ["is_current", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["starts_on", false, false],
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
        dataSource.query('INSERT INTO "periods" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });

  describe("StatisticsTable", () => {
    const metadata = () => dataSource.getMetadata(StatisticsTableEntity);

    it("maps its contract table and columns", () => {
      expect(metadata().tableName).toBe("statistics_tables");
      expect(columns(metadata())).toEqual(
        (
          [
            ["artifact_checksum", true, false],
            ["artifact_id", true, false],
            ["code", false, false],
            ["collector", true, false],
            ["confidence", true, false],
            ["created_at", false, false],
            ["geo_unit_id", true, false],
            ["id", false, true],
            ["indicator_id", true, false],
            ["is_current", false, false],
            ["jurisdiction_id", false, false],
            ["licence", true, false],
            ["method", false, false],
            ["methodology", true, false],
            ["publisher_institution_id", true, false],
            ["retrieved_at", true, false],
            ["source_name", false, false],
            ["source_reference", true, false],
            ["source_url", true, false],
            ["title", false, false],
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
        .foreignKeys.map((key) => `${key.columnNames.join(",")}->${key.referencedTablePath}`)
        .sort();
      expect(keys).toEqual(
        [
          "jurisdiction_id->jurisdictions",
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
        dataSource.query('INSERT INTO "statistics_tables" DEFAULT VALUES'),
      ).rejects.toThrow();
    });
  });
});