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
import { StoredObjectEntity } from "#/modules/filesystem/entities/stored-object.entity.ts";
import { VariantKind } from "#/types/filesystem/variant-kind.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Variant
 */
@Entity({ schema: "filesystem", name: "variants" })
@Index("idx_variant_object", ["objectId", "kind"])
export class FileVariantEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "derived_object_id", type: "uuid" })
  derivedObjectId!: Id;

  @Column({ name: "kind", type: "enum", enum: VariantKind })
  kind!: VariantKind;

  @Column({ name: "object_id", type: "uuid" })
  objectId!: Id;

  @ManyToOne(() => StoredObjectEntity)
  @JoinColumn({ name: "object_id" })
  object?: Relation<StoredObjectEntity>;

  @Column({ name: "parameters", type: "varchar", length: 4000, nullable: true })
  parameters?: Description | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}