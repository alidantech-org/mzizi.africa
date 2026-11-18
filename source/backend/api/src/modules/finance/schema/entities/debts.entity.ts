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
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One public debt instrument between a borrower and optional lender, with contracted amount and maturity facts.
 */
@Entity({ schema: "finance", name: "debts" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["borrowerEntityId"])
@Index(["maturityOn"])
@Index(["sourceCitationId"])
export class DebtsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({
    name: "amount_minor_units",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
  })
  amountMinorUnits!: AmountMinorUnits;

  @Column({ name: "borrower_entity_id", type: "uuid" })
  borrowerEntityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "borrower_entity_id" })
  borrowerEntity?: Relation<EntitiesEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "contracted_on", type: "date", nullable: true })
  contractedOn?: Date | null;

  @Column({ name: "country_id", type: "uuid", nullable: true })
  countryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_id", type: "uuid" })
  currencyId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "currency_id" })
  currency?: Relation<ValueEntity>;

  @Column({ name: "debt_kind_id", type: "uuid" })
  debtKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "debt_kind_id" })
  debtKind?: Relation<ValueEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "lender_entity_id", type: "uuid", nullable: true })
  lenderEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "lender_entity_id" })
  lenderEntity?: Relation<EntitiesEntity>;

  @Column({ name: "maturity_on", type: "date", nullable: true })
  maturityOn?: Date | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
