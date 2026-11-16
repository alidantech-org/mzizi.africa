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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { DatasetAssembly } from "#/modules/source/schema/enum/dataset-assembly.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";

/**
 * A dataset we hold, most often a seed CSV that rows are loaded from: categorised, hashed, and either taken as downloaded or assembled from other inputs.
 */
@Entity({ schema: "source", name: "datasets" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["categoryId"])
@Index(["fileVersionId"])
export class SourceDatasetsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "assembly", type: "enum", enum: DatasetAssembly })
  assembly!: DatasetAssembly;

  @Column({ name: "category_id", type: "uuid", nullable: true })
  categoryId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "category_id" })
  category?: Relation<ValueEntity>;

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

  @Column({ name: "file_version_id", type: "uuid", nullable: true })
  fileVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "format", type: "varchar", length: 100 })
  format!: NonEmptyString100;

  @Column({ name: "location", type: "varchar", length: 1000, nullable: true })
  location?: NonEmptyString1000 | null;

  @Column({ name: "sha256", type: "char", length: 64, nullable: true })
  sha256?: Sha256 | null;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
