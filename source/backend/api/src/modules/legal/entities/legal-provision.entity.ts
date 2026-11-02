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
import { LegalInstrumentEntity } from "#/modules/legal/entities/legal-instrument.entity.ts";
import { ProvisionKind } from "#/types/legal/provision-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Citation } from "#/types/legal/citation.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Legal Provision
 */
@Entity({ schema: "legal", name: "provisions" })
@Index("idx_legal_provision_instrument_code", ["instrumentId", "code", "version"], { unique: true })
@Index("idx_legal_provision_parent", ["parentId"])
export class LegalProvisionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "citation", type: "varchar", length: 300 })
  citation!: Citation;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "content", type: "text", nullable: true })
  content?: LongText | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "heading", type: "varchar", length: 300, nullable: true })
  heading?: Name | null;

  @Column({ name: "instrument_id", type: "uuid" })
  instrumentId!: Id;

  @ManyToOne(() => LegalInstrumentEntity)
  @JoinColumn({ name: "instrument_id" })
  instrument?: Relation<LegalInstrumentEntity>;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: ProvisionKind })
  kind!: ProvisionKind;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @Column({ name: "previous_version_id", type: "uuid", nullable: true })
  previousVersionId?: Id | null;

  @Column({ name: "sort_order", type: "integer" })
  sortOrder!: Count;

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