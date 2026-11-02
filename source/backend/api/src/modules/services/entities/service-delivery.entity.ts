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
import { AmenityEntity } from "#/modules/services/entities/amenity.entity.ts";
import { DeliveryStatus } from "#/types/services/delivery-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Service Delivery
 */
@Entity({ schema: "civic", name: "deliveries" })
@Index("idx_service_delivery_amenity", ["amenityId"])
@Index("idx_service_delivery_service", ["serviceId"])
export class ServiceDeliveryEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "amenity_id", type: "uuid" })
  amenityId!: Id;

  @ManyToOne(() => AmenityEntity)
  @JoinColumn({ name: "amenity_id" })
  amenity?: Relation<AmenityEntity>;

  @Column({ name: "budget_id", type: "uuid", nullable: true })
  budgetId?: Id | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "responsible_office_id", type: "uuid", nullable: true })
  responsibleOfficeId?: Id | null;

  @Column({ name: "service_id", type: "uuid" })
  serviceId!: Id;

  @Column({ name: "status", type: "enum", enum: DeliveryStatus })
  status!: DeliveryStatus;

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