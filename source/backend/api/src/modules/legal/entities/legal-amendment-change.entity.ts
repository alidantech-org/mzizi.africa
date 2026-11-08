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
import { LegalAmendmentEntity } from "#/modules/legal/entities/legal-amendment.entity.ts";
import { AmendmentChangeKind } from "#/types/legal/amendment-change-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Legal Amendment Change
 */
@Entity({ schema: "legal", name: "changes" })
@Index("idx_legal_change_amendment", ["amendmentId"])
export class LegalAmendmentChangeEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "amendment_id", type: "uuid" })
  amendmentId!: Id;

  @ManyToOne(() => LegalAmendmentEntity)
  @JoinColumn({ name: "amendment_id" })
  amendment?: Relation<LegalAmendmentEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: AmendmentChangeKind })
  kind!: AmendmentChangeKind;

  @Column({ name: "new_text", type: "text", nullable: true })
  newText?: LongText | null;

  @Column({ name: "previous_text", type: "text", nullable: true })
  previousText?: LongText | null;

  @Column({ name: "provision_id", type: "uuid" })
  provisionId!: Id;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}