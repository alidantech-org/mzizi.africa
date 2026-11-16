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
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * An edge in a geographic transformation; multiple rows sharing transformation_id represent splits, mergers, creation or dissolution without overwriting predecessor identities.
 */
@Entity({ schema: "geography", name: "changes" })
@Index(["transformationId", "predecessorFeatureId", "successorFeatureId"], {
  unique: true,
})
@Index(["transformationId"])
@Index(["predecessorFeatureId"])
@Index(["successorFeatureId"])
@Index(["changeKindId"])
export class ChangesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "change_kind_id", type: "uuid" })
  changeKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "change_kind_id" })
  changeKind?: Relation<ValueEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "effective_on", type: "date", nullable: true })
  effectiveOn?: Date | null;

  @Column({
    name: "explanation",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  explanation?: Description | null;

  @Column({ name: "predecessor_feature_id", type: "uuid", nullable: true })
  predecessorFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "predecessor_feature_id" })
  predecessorFeature?: Relation<FeaturesEntity>;

  @Column({ name: "source_id", type: "uuid", nullable: true })
  sourceId?: Id | null;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "successor_feature_id", type: "uuid", nullable: true })
  successorFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "successor_feature_id" })
  successorFeature?: Relation<FeaturesEntity>;

  @Column({ name: "transformation_id", type: "uuid" })
  transformationId!: Id;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
