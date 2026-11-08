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
import { LegalEntityEntity } from "#/modules/entities/entities/legal-entity.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { OwnershipPercentage } from "#/types/entities/ownership-percentage.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Entity Ownership
 */
@Entity({ schema: "organization", name: "ownerships" })
@Index("idx_entity_ownership_entity", ["entityId"])
export class EntityOwnershipEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "entity_id", type: "uuid" })
  entityId!: Id;

  @ManyToOne(() => LegalEntityEntity)
  @JoinColumn({ name: "entity_id" })
  entity?: Relation<LegalEntityEntity>;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "owner_entity_id", type: "uuid", nullable: true })
  ownerEntityId?: Id | null;

  @Column({ name: "owner_person_id", type: "uuid", nullable: true })
  ownerPersonId?: Id | null;

  @Column({ name: "percentage", type: "numeric", precision: 7, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  percentage?: OwnershipPercentage | null;

  @Column({ name: "position", type: "varchar", length: 300, nullable: true })
  position?: Label | null;

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