import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { MotionsEntity } from "#/modules/governance/schema/entities/motions.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One office holder's recorded position on one motion (a division), including being absent.
 */
@Entity({ schema: "governance", name: "votes" })
@Index(["motionId", "holderId"], { unique: true })
@Index(["holderId"])
@Index(["positionId"])
@Index(["sourceCitationId"])
export class VotesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "holder_id", type: "uuid" })
  holderId!: Id;

  @ManyToOne(() => HoldersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "holder_id" })
  holder?: Relation<HoldersEntity>;

  @Column({ name: "motion_id", type: "uuid" })
  motionId!: Id;

  @ManyToOne(() => MotionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "motion_id" })
  motion?: Relation<MotionsEntity>;

  @Column({ name: "position_id", type: "uuid" })
  positionId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "position_id" })
  position?: Relation<ValueEntity>;

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
