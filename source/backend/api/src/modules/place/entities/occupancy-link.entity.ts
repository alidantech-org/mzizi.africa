import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { OccupancyEntity } from "#/modules/place/entities/occupancy.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { OccupancyLinkKind } from "#/types/place/occupancy-link-kind.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Date } from "#/types/shared/date.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Version } from "#/types/shared/version.type.ts";

/**
 * Occupancy Link
 */
@Entity({ schema: "place", name: "occupancy_links" })
@Index("idx_occupancy_link_pair", ["predecessorId", "successorId"], { unique: true })
@Index("idx_occupancy_link_successor", ["successorId"])
export class OccupancyLinkEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: OccupancyLinkKind })
  kind!: OccupancyLinkKind;

  @Column({ name: "predecessor_id", type: "uuid" })
  predecessorId!: Id;

  @ManyToOne(() => OccupancyEntity)
  @JoinColumn({ name: "predecessor_id" })
  predecessor?: Relation<OccupancyEntity>;

  @Column({ name: "successor_id", type: "uuid" })
  successorId!: Id;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}
