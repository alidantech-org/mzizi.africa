import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { EvidenceEntity } from "#/modules/source/schema/entities/evidence.entity.ts";
import { VerificationOutcome } from "#/modules/source/schema/enum/verification-outcome.enum.ts";
import type { Confidence } from "#/modules/shared/schema/type/confidence.type.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes.
 */
@Entity({ schema: "source", name: "verifications" })
@Index(["evidenceId"])
@Index(["methodId"])
@Index(["supersedesId"])
export class VerificationsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "assessed_at", type: "timestamptz" })
  assessedAt!: Date;

  @Column({ name: "confidence", type: "double precision", nullable: true })
  confidence?: Confidence | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "evidence_id", type: "uuid" })
  evidenceId!: Id;

  @ManyToOne(() => EvidenceEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "evidence_id" })
  evidence?: Relation<EvidenceEntity>;

  @Column({ name: "explanation", type: "varchar", length: 4000 })
  explanation!: Description;

  @Column({ name: "method_id", type: "uuid" })
  methodId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "method_id" })
  method?: Relation<ValueEntity>;

  @Column({ name: "outcome", type: "enum", enum: VerificationOutcome })
  outcome!: VerificationOutcome;

  @Column({ name: "reviewer_snapshot", type: "text" })
  reviewerSnapshot!: JsonText;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @ManyToOne(() => VerificationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "supersedes_id" })
  supersedes?: Relation<VerificationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
