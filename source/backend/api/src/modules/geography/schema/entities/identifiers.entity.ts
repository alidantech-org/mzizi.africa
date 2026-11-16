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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A preserved identifier assigned to a feature by an external geographic registry or source system.
 */
@Entity({ schema: "geography", name: "identifiers" })
@Index(["identifierSchemeId", "namespace", "externalId"], { unique: true })
@Index(["featureId"])
export class GeographyIdentifiersEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "external_id", type: "varchar", length: 500 })
  externalId!: NonEmptyString500;

  @Column({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "identifier_scheme_id", type: "uuid" })
  identifierSchemeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "identifier_scheme_id" })
  identifierScheme?: Relation<ValueEntity>;

  @Column({ name: "namespace", type: "varchar", length: 255, nullable: true })
  namespace?: NonEmptyString255 | null;

  @Column({ name: "source_id", type: "uuid", nullable: true })
  sourceId?: Id | null;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
