import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * Technical filename suffix and media-type hint; never a semantic document classification.
 */
@Entity({ schema: "filesystem", name: "file_extensions" })
@Index(["code"], { unique: true })
@Index(["extension"], { unique: true })
export class FileExtensionsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "content_type", type: "varchar", length: 255 })
  contentType!: NonEmptyString255;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "description", type: "varchar", length: 4000, nullable: true })
  description?: Description | null;

  @Column({ name: "extension", type: "varchar", length: 100 })
  extension!: NonEmptyString100;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}