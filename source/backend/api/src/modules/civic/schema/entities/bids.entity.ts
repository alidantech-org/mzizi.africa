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
import { ProcurementsEntity } from "#/modules/civic/schema/entities/procurements.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One supplier submission to one procurement process, with the reported amount and outcome where known.
 */
@Entity({ schema: "civic", name: "bids" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["procurementId"])
@Index(["bidderEntityId"])
@Index(["sourceCitationId"])
export class BidsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({
    name: "amount_minor_units",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
    nullable: true,
  })
  amountMinorUnits?: AmountMinorUnits | null;

  @Column({ name: "bidder_entity_id", type: "uuid" })
  bidderEntityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bidder_entity_id" })
  bidderEntity?: Relation<EntitiesEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_id", type: "uuid", nullable: true })
  currencyId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "currency_id" })
  currency?: Relation<ValueEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "outcome_id", type: "uuid" })
  outcomeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "outcome_id" })
  outcome?: Relation<ValueEntity>;

  @Column({ name: "procurement_id", type: "uuid" })
  procurementId!: Id;

  @ManyToOne(() => ProcurementsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "procurement_id" })
  procurement?: Relation<ProcurementsEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "submitted_on", type: "date", nullable: true })
  submittedOn?: Date | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
