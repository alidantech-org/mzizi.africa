import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FiscalPeriodsEntity } from "#/modules/finance/schema/entities/fiscal-periods.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One institutional/country budget identity for a fiscal period and budget classification.
 */
@Entity({ schema: "finance", name: "budgets" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["fiscalPeriodId"])
@Index(["sourceCitationId"])
export class BudgetsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "budget_kind_id", type: "uuid" })
  budgetKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "budget_kind_id" })
  budgetKind?: Relation<ValueEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "country_id", type: "uuid", nullable: true })
  countryId?: Id | null;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "fiscal_period_id", type: "uuid" })
  fiscalPeriodId!: Id;

  @ManyToOne(() => FiscalPeriodsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "fiscal_period_id" })
  fiscalPeriod?: Relation<FiscalPeriodsEntity>;

  @Column({ name: "government_entity_id", type: "uuid", nullable: true })
  governmentEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "government_entity_id" })
  governmentEntity?: Relation<EntitiesEntity>;

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
