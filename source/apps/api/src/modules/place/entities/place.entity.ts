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
import { PlaceKind } from "#/types/place/place-kind.enum.ts";
import { PlaceStatus } from "#/types/place/place-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Latitude } from "#/types/place/latitude.type.ts";
import type { Longitude } from "#/types/place/longitude.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Place
 */
@Entity({ schema: "place", name: "places" })
@Index("idx_place_parent", ["parentId"])
@Index("idx_place_located_in", ["locatedInUnitId"])
@Index("idx_place_kind_status", ["kind", "status"])
export class PlaceEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "address_text", type: "text", nullable: true })
  addressText?: LongText | null;

  @Column({ name: "available_from", type: "date", nullable: true })
  availableFrom?: Date | null;

  @Column({ name: "building_type_id", type: "uuid", nullable: true })
  buildingTypeId?: Id | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: PlaceKind })
  kind!: PlaceKind;

  @Column({ name: "latitude", type: "numeric", precision: 9, scale: 6, transformer: new ColumnNumericTransformer(), nullable: true })
  latitude?: Latitude | null;

  @Column({ name: "located_in_unit_id", type: "uuid", nullable: true })
  locatedInUnitId?: Id | null;

  @Column({ name: "longitude", type: "numeric", precision: 9, scale: 6, transformer: new ColumnNumericTransformer(), nullable: true })
  longitude?: Longitude | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @Column({ name: "status", type: "enum", enum: PlaceStatus })
  status!: PlaceStatus;

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