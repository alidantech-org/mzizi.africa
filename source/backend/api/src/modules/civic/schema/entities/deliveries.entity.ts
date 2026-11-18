import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/schema/entities/base/column-numeric.transformer.ts";
import { ContractsEntity } from "#/modules/civic/schema/entities/contracts.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One dated deliverable or milestone under a contract, optionally scoped to a geographic unit.
 */
@Entity({ schema: "civic", name: "deliveries" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["contractId", "deliveredOn"])
@Index(["unitFeatureId"])
@Index(["sourceCitationId"])
export class DeliveriesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({
    name: "amount_minor_units",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
    nullable: true,
  })
  amountMinorUnits?: AmountMinorUnits | null;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "contract_id", type: "uuid" })
  contractId!: Id;

  @ManyToOne(() => ContractsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contract_id" })
  contract?: Relation<ContractsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_id", type: "uuid", nullable: true })
  currencyId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "currency_id" })
  currency?: Relation<ValueEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "delivered_on", type: "date", nullable: true })
  deliveredOn?: Date | null;

  @Column({ name: "delivery_kind_id", type: "uuid" })
  deliveryKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "delivery_kind_id" })
  deliveryKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "unit_feature_id", type: "uuid", nullable: true })
  unitFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "unit_feature_id" })
  unitFeature?: Relation<FeaturesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
