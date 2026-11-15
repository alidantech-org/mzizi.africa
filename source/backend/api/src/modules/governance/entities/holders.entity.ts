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
import { OfficesEntity } from "#/modules/governance/entities/offices.entity.ts";
import { EntitiesEntity } from "#/modules/official/entities/entities.entity.ts";
import { IndividualsEntity } from "#/modules/official/entities/individuals.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";

/**
 * One person's continuous tenure in one office, with appointment kind and effective dates.
 */
@Entity({ schema: "governance", name: "holders" })
@Index(["officeId", "validFrom", "validUntil"])
@Index(["individualId"])
@Index(["sourceCitationId"])
@Check("chk_holders_validity_window_is_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
export class HoldersEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "appointed_by_entity_id", type: "uuid", nullable: true })
  appointedByEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "appointed_by_entity_id" })
  appointedByEntity?: Relation<EntitiesEntity>;

  @Column({ name: "appointment_kind_id", type: "uuid" })
  appointmentKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "appointment_kind_id" })
  appointmentKind?: Relation<ValueEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "individual_id", type: "uuid" })
  individualId!: Id;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "individual_id" })
  individual?: Relation<IndividualsEntity>;

  @Column({ name: "office_id", type: "uuid" })
  officeId!: Id;

  @ManyToOne(() => OfficesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}