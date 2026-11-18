import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Stable instrument identity, independent of its names, editions, downloads and languages.
 */
@Entity({ schema: "legal", name: "instruments" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["kindId"])
@Index(["statusId"])
@Index(["issuingUnitId"])
export class InstrumentsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "enacted_on", type: "date", nullable: true })
  enactedOn?: Date | null;

  @Column({ name: "issuing_entity_id", type: "uuid", nullable: true })
  issuingEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "issuing_entity_id" })
  issuingEntity?: Relation<EntitiesEntity>;

  @Column({ name: "issuing_unit_id", type: "uuid", nullable: true })
  issuingUnitId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "issuing_unit_id" })
  issuingUnit?: Relation<FeaturesEntity>;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "status_id", type: "uuid", nullable: true })
  statusId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
