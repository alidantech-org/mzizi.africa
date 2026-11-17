import {
  Check,
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
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems.
 */
@Entity({ schema: "geography", name: "relationships" })
@Index(["subjectFeatureId", "objectFeatureId", "relationshipKindId", "systemId", "fromYear"], {
  unique: true,
})
@Index(["subjectFeatureId", "relationshipKindId"])
@Index(["objectFeatureId", "relationshipKindId"])
@Index(["fromYear", "toYear"])
@Check(
  "chk_relationships_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_relationships_relationships_dates_are_ordered",
  `starts_on = null OR ends_on = null OR starts_on <= ends_on`,
)
@Check(
  "chk_relationships_relationship_must_not_be_self_referential",
  `subject_feature_id <> object_feature_id`,
)
export class GeographyRelationshipsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "ends_on", type: "date", nullable: true })
  endsOn?: Date | null;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "object_feature_id", type: "uuid" })
  objectFeatureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "object_feature_id" })
  objectFeature?: Relation<FeaturesEntity>;

  @Column({ name: "relationship_kind_id", type: "uuid" })
  relationshipKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "relationship_kind_id" })
  relationshipKind?: Relation<ValueEntity>;

  @Column({ name: "starts_on", type: "date", nullable: true })
  startsOn?: Date | null;

  @Column({ name: "subject_feature_id", type: "uuid" })
  subjectFeatureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "subject_feature_id" })
  subjectFeature?: Relation<FeaturesEntity>;

  @Column({ name: "system_id", type: "uuid" })
  systemId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "system_id" })
  system?: Relation<ValueEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
