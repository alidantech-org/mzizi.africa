import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ObligationsEntity } from "#/modules/governance/schema/entities/obligations.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One expected or found filing under an obligation, for one reporter and period, with its status and the document when found. Absence is a status, not a missing row.
 */
@Entity({ schema: "governance", name: "reports" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["obligationId", "periodFrom"])
@Index(["reporterEntityId"])
@Index(["statusId"])
@Index(["artifactId"])
@Index(["sourceCitationId"])
@Check(
  "chk_reports_report_period_is_ordered",
  `period_from = null OR period_until = null OR period_from <= period_until`,
)
export class ReportsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "artifact_id", type: "uuid", nullable: true })
  artifactId?: Id | null;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "artifact_id" })
  artifact?: Relation<ArtifactsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "due_on", type: "date", nullable: true })
  dueOn?: Date | null;

  @Column({ name: "filed_on", type: "date", nullable: true })
  filedOn?: Date | null;

  @Column({ name: "obligation_id", type: "uuid" })
  obligationId!: Id;

  @ManyToOne(() => ObligationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "obligation_id" })
  obligation?: Relation<ObligationsEntity>;

  @Column({ name: "period_from", type: "date", nullable: true })
  periodFrom?: Date | null;

  @Column({ name: "period_until", type: "date", nullable: true })
  periodUntil?: Date | null;

  @Column({ name: "reporter_entity_id", type: "uuid" })
  reporterEntityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "reporter_entity_id" })
  reporterEntity?: Relation<EntitiesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
