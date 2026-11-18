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
import { ProjectsEntity } from "#/modules/civic/schema/entities/projects.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One executed contract with a contractor, optional procurement/project links and contracted amount.
 */
@Entity({ schema: "civic", name: "contracts" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["procurementId"])
@Index(["projectId"])
@Index(["sourceCitationId"])
export class ContractsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({
    name: "amount_minor_units",
    type: "bigint",
    transformer: new ColumnNumericTransformer(),
  })
  amountMinorUnits!: AmountMinorUnits;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "contractor_entity_id", type: "uuid" })
  contractorEntityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contractor_entity_id" })
  contractorEntity?: Relation<EntitiesEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_id", type: "uuid" })
  currencyId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "currency_id" })
  currency?: Relation<ValueEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "nature_id", type: "uuid", nullable: true })
  natureId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "nature_id" })
  nature?: Relation<ValueEntity>;

  @Column({ name: "procurement_id", type: "uuid", nullable: true })
  procurementId?: Id | null;

  @ManyToOne(() => ProcurementsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "procurement_id" })
  procurement?: Relation<ProcurementsEntity>;

  @Column({ name: "project_id", type: "uuid", nullable: true })
  projectId?: Id | null;

  @ManyToOne(() => ProjectsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "project_id" })
  project?: Relation<ProjectsEntity>;

  @Column({ name: "signed_on", type: "date", nullable: true })
  signedOn?: Date | null;

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
