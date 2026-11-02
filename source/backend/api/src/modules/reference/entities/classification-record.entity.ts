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
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { ClassificationScheme } from "#/types/reference/classification-scheme.type.ts";
import type { Label } from "#/types/reference/label.type.ts";
import type { Order } from "#/types/reference/order.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Classification Record
 */
@Entity({ schema: "reference", name: "classifications" })
@Index("idx_classification_scheme_code", ["jurisdictionId", "scheme", "code"], { unique: true })
export class ClassificationRecordEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "emblem_expected", type: "enum", enum: MediaMarker, nullable: true })
  emblemExpected?: MediaMarker | null;

  @Column({ name: "flag_expected", type: "enum", enum: MediaMarker, nullable: true })
  flagExpected?: MediaMarker | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "jurisdiction_id", type: "uuid" })
  jurisdictionId!: Id;

  @ManyToOne(() => JurisdictionEntity)
  @JoinColumn({ name: "jurisdiction_id" })
  jurisdiction?: Relation<JurisdictionEntity>;

  @Column({ name: "label", type: "varchar", length: 300 })
  label!: Label;

  @Column({ name: "legal_basis", type: "varchar", length: 4000, nullable: true })
  legalBasis?: Description | null;

  @Column({ name: "order", type: "integer", nullable: true })
  order?: Order | null;

  @Column({ name: "scheme", type: "varchar", length: 200 })
  scheme!: ClassificationScheme;

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