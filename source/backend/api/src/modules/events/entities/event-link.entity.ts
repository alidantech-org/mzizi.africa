import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { EventEntity } from "#/modules/events/entities/event.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { LinkRole } from "#/types/events/link-role.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Event Link
 */
@Entity({ schema: "calendar", name: "links" })
@Index("idx_event_link_event", ["eventId"])
@Index("idx_event_link_target", ["targetKind", "targetId"])
export class EventLinkEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "event_id", type: "uuid" })
  eventId!: Id;

  @ManyToOne(() => EventEntity)
  @JoinColumn({ name: "event_id" })
  event?: Relation<EventEntity>;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "role", type: "varchar", length: 100, nullable: true })
  role?: LinkRole | null;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: Id;

  @Column({ name: "target_kind", type: "varchar", length: 100 })
  targetKind!: TargetKind;

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