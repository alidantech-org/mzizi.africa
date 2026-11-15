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

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import type { Factor } from "#/modules/reference/factor.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * Measurement unit and conversion to its optional base unit; never a spatial unit.
 */
@Entity({ schema: "reference", name: "units" })
@Index(["code"], { unique: true })
@Index(["baseId"])
@Check("chk_unit_unit_scale_must_be_positive", `scale > 0`)
export class UnitEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "base_id", type: "uuid", nullable: true })
  baseId?: Id | null;

  @ManyToOne(() => UnitEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "base_id" })
  base?: Relation<UnitEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "offset", type: "numeric", precision: 38, scale: 18, transformer: new ColumnNumericTransformer() })
  offset!: Factor;

  @Column({ name: "quantity", type: "varchar", length: 255 })
  quantity!: NonEmptyString255;

  @Column({ name: "scale", type: "numeric", precision: 38, scale: 18, transformer: new ColumnNumericTransformer() })
  scale!: Factor;

  @Column({ name: "symbol", type: "varchar", length: 100 })
  symbol!: NonEmptyString100;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}