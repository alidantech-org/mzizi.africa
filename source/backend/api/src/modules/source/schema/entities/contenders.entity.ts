import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DisputesEntity } from "#/modules/source/schema/entities/disputes.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One side of a dispute: a citation and the claim it supports.
 */
@Entity({ schema: "source", name: "contenders" })
@Index(["disputeId", "citationId"], { unique: true })
@Index(["disputeId"])
@Index(["citationId"])
export class ContendersEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "citation_id", type: "uuid" })
  citationId!: Id;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "citation_id" })
  citation?: Relation<CitationsEntity>;

  @Column({ name: "claim", type: "varchar", length: 4000 })
  claim!: Description;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "dispute_id", type: "uuid" })
  disputeId!: Id;

  @ManyToOne(() => DisputesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "dispute_id" })
  dispute?: Relation<DisputesEntity>;

  @Column({ name: "is_preferred", type: "boolean" })
  isPreferred!: Flag;

  @Column({ name: "position", type: "integer", nullable: true })
  position?: NonNegativeInteger | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
