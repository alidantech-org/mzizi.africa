import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { GeometriesEntity } from "#/modules/geography/schema/entities/geometries.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Layer } from "#/modules/geography/schema/type/layer.type.ts";
import type { Member } from "#/modules/geography/schema/type/member.type.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A stored GIS file used for a feature or for one of its geometries. One file can serve many features and a feature can have many files. Photographs and video are filesystem media; acquisition and provenance belong to Source.
 */
@Entity({ schema: "geography", name: "assets" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["featureId"])
@Index(["geometryId"])
@Index(["fileVersionId"])
@Index(["kindId"])
@Index(["purposeId"])
export class AssetsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "band", type: "integer", nullable: true })
  band?: PositiveInteger | null;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "description",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  description?: Description | null;

  @Column({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "file_version_id", type: "uuid" })
  fileVersionId!: Id;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "geometry_id", type: "uuid", nullable: true })
  geometryId?: Id | null;

  @ManyToOne(() => GeometriesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "geometry_id" })
  geometry?: Relation<GeometriesEntity>;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "layer", type: "varchar", length: 255, nullable: true })
  layer?: Layer | null;

  @Column({ name: "member", type: "varchar", length: 1000, nullable: true })
  member?: Member | null;

  @Column({ name: "purpose_id", type: "uuid" })
  purposeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "purpose_id" })
  purpose?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
