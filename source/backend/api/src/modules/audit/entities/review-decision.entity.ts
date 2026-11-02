import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { Decision } from "#/types/audit/decision.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Review Decision
 */
@Entity({ name: "review_decisions" })
@Index("idx_decision_target", ["targetKind", "targetId"])
export class ReviewDecisionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "decision", type: "enum", enum: Decision })
  decision!: Decision;

  @Column({ name: "proposed_state", type: "enum", enum: VerificationState })
  proposedState!: VerificationState;

  @Column({ name: "rationale", type: "text" })
  rationale!: LongText;

  @Column({ name: "reviewer_id", type: "uuid" })
  reviewerId!: Id;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: Id;

  @Column({ name: "target_kind", type: "varchar", length: 100 })
  targetKind!: TargetKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}