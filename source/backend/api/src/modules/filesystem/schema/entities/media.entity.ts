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

import { FileVersionsEntity } from "#/modules/filesystem/schema/entities/file-versions.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/**
 * One use of a stored media file by one subject record, which it mentions by table and id. A subject can have many media of any kind and one file can serve many subjects; subjects carry no media pointer.
 */
@Entity({ schema: "filesystem", name: "media" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["subjectTable", "subjectId"])
@Index(["kindId"])
@Index(["fileVersionId"])
@Check("chk_media_media_has_bytes_or_url", `file_version_id <> null OR external_url <> null`)
@Check(
  "chk_media_media_seconds_are_ordered",
  `start_second = null OR end_second = null OR start_second < end_second`,
)
export class MediaEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "alt_text", type: "varchar", length: 500, nullable: true })
  altText?: NonEmptyString500 | null;

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

  @Column({ name: "end_second", type: "integer", nullable: true })
  endSecond?: NonNegativeInteger | null;

  @Column({
    name: "external_url",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  externalUrl?: Url | null;

  @Column({ name: "file_version_id", type: "uuid", nullable: true })
  fileVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "file_version_id" })
  fileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "metadata", type: "text", nullable: true })
  metadata?: JsonText | null;

  @Column({ name: "platform_id", type: "uuid", nullable: true })
  platformId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "platform_id" })
  platform?: Relation<ValueEntity>;

  @Column({ name: "position", type: "integer", nullable: true })
  position?: NonNegativeInteger | null;

  @Column({ name: "purpose", type: "varchar", length: 4000, nullable: true })
  purpose?: Description | null;

  @Column({ name: "start_second", type: "integer", nullable: true })
  startSecond?: NonNegativeInteger | null;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: Id;

  @Column({ name: "subject_table", type: "enum", enum: SubjectTable })
  subjectTable!: SubjectTable;

  @Column({
    name: "thumbnail_url",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  thumbnailUrl?: Url | null;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
