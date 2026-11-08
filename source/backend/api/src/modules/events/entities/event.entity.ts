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
import { EventStatus } from "#/types/events/event-status.enum.ts";
import { ImpactLevel } from "#/types/events/impact-level.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Event
 */
@Entity({ schema: "calendar", name: "events" })
@Index("idx_event_code", ["code"], { unique: true })
@Index("idx_event_starts", ["startsOn"])
export class EventEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "description", type: "text", nullable: true })
  description?: LongText | null;

  @Column({ name: "ends_on", type: "date", nullable: true })
  endsOn?: Date | null;

  @Column({ name: "geo_unit_id", type: "uuid", nullable: true })
  geoUnitId?: Id | null;

  @Column({ name: "impact_level", type: "enum", enum: ImpactLevel, nullable: true })
  impactLevel?: ImpactLevel | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "is_recurring", type: "boolean" })
  isRecurring!: Flag;

  @Column({ name: "jurisdiction_id", type: "uuid" })
  jurisdictionId!: Id;

  @Column({ name: "starts_on", type: "date" })
  startsOn!: Date;

  @Column({ name: "status", type: "enum", enum: EventStatus })
  status!: EventStatus;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "type_id", type: "uuid" })
  typeId!: Id;

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