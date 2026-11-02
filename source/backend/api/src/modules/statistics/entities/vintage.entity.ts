import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";

import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Date } from "#/types/shared/date.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { ObservationValue } from "#/types/statistics/observation-value.type.ts";

/** Release vintage of a published figure. */
@Entity({ schema: "statistical", name: "vintages" })
@Index("idx_vintage_code", ["code"], { unique: true })
export class VintageEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "label", type: "varchar", length: 200 })
  label!: string;

  @Column({ name: "publisher_institution_id", type: "uuid", nullable: true })
  publisherInstitutionId?: Id | null;

  @Column({ name: "released_on", type: "date", nullable: true })
  releasedOn?: Date | null;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

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
