import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { FileVersionsEntity } from "#/modules/filesystem/entities/file-versions.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import { PublishersEntity } from "#/modules/source/entities/publishers.entity.ts";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * Accepted rights and credit statement tied to exact content and publisher.
 */
@Entity({ schema: "source", name: "attributions" })
@Index(["publisherId"])
@Index(["fileVersionId"])
@Index(["licenseValueId"])
export class AttributionsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "assessed_at", type: "timestamptz" })
  assessedAt!: Date;

  @Column({ name: "assessor_snapshot", type: "text" })
  assessorSnapshot!: JsonText;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "credit", type: "varchar", length: 1000 })
  credit!: NonEmptyString1000;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "file_version_id", type: "uuid" })
  fileVersionId!: Id;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "license_value_id", type: "uuid", nullable: true })
  licenseValueId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "license_value_id" })
  licenseValue?: Relation<ValueEntity>;

  @Column({ name: "publisher_id", type: "uuid" })
  publisherId!: Id;

  @ManyToOne(() => PublishersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "publisher_id" })
  publisher?: Relation<PublishersEntity>;

  @Column({ name: "rights_statement", type: "varchar", length: 4000 })
  rightsStatement!: Description;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}