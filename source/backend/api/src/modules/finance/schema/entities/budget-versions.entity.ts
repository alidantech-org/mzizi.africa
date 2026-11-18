import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { BudgetsEntity } from "#/modules/finance/schema/entities/budgets.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One ordered release or revision of a budget, preserving original and supplementary versions separately.
 */
@Entity({ schema: "finance", name: "budget_versions" })
@Index(["budgetId", "revision"], { unique: true })
@Index(["statusId"])
@Index(["sourceCitationId"])
export class BudgetVersionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "budget_id", type: "uuid" })
  budgetId!: Id;

  @ManyToOne(() => BudgetsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "budget_id" })
  budget?: Relation<BudgetsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "released_on", type: "date", nullable: true })
  releasedOn?: Date | null;

  @Column({ name: "revision", type: "integer" })
  revision!: PositiveInteger;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
