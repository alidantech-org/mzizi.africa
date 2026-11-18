import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ContractsEntity } from "#/modules/civic/schema/entities/contracts.entity.ts";
import { ProcurementsEntity } from "#/modules/civic/schema/entities/procurements.entity.ts";
import { ProjectsEntity } from "#/modules/civic/schema/entities/projects.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Who or what benefits from one project, procurement or contract: a facility, a place, an organisation or a population group, with the kind of benefit. The buyer and the supplier are not beneficiaries; they are separate roles.
 */
@Entity({ schema: "civic", name: "beneficiaries" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["subjectTable", "subjectId"])
@Index(["projectId"])
@Index(["procurementId"])
@Index(["contractId"])
@Index(["benefitKindId"])
@Index(["sourceCitationId"])
// Invariant "ExactlyOneSpendingRecord" has no simple form, so it isn't enforced as a database check.
export class BeneficiariesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "benefit_kind_id", type: "uuid" })
  benefitKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "benefit_kind_id" })
  benefitKind?: Relation<ValueEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "contract_id", type: "uuid", nullable: true })
  contractId?: Id | null;

  @ManyToOne(() => ContractsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contract_id" })
  contract?: Relation<ContractsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "procurement_id", type: "uuid", nullable: true })
  procurementId?: Id | null;

  @ManyToOne(() => ProcurementsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "procurement_id" })
  procurement?: Relation<ProcurementsEntity>;

  @Column({ name: "project_id", type: "uuid", nullable: true })
  projectId?: Id | null;

  @ManyToOne(() => ProjectsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "project_id" })
  project?: Relation<ProjectsEntity>;

  @Column({ name: "share_percent", type: "double precision", nullable: true })
  sharePercent?: Percentage | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: Id;

  @Column({ name: "subject_table", type: "enum", enum: SubjectTable })
  subjectTable!: SubjectTable;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
