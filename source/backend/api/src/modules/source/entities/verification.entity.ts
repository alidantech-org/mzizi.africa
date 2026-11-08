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
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Verification
 */
@Entity({ schema: "source", name: "verifications" })
@Index("idx_verification_target", ["targetKind", "targetId", "isCurrent"])
export class VerificationEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "decided_by", type: "uuid", nullable: true })
  decidedBy?: Id | null;

  @Column({ name: "decision_id", type: "uuid", nullable: true })
  decisionId?: Id | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "rationale", type: "text", nullable: true })
  rationale?: LongText | null;

  @Column({ name: "state", type: "enum", enum: VerificationState })
  state!: VerificationState;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: Id;

  @Column({ name: "target_kind", type: "varchar", length: 100 })
  targetKind!: TargetKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}