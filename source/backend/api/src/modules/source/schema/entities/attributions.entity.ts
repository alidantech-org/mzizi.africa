import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Credit and rights for one artifact and publisher; equal bytes from other places never overwrite it.
 */
@Entity({ schema: "source", name: "attributions" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["publisherId"])
@Index(["artifactId"])
@Index(["licenseValueId"])
export class AttributionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "artifact_id", type: "uuid" })
  artifactId!: Id;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "artifact_id" })
  artifact?: Relation<ArtifactsEntity>;

  @Column({ name: "assessed_at", type: "timestamptz" })
  assessedAt!: Date;

  @Column({ name: "assessor_snapshot", type: "text" })
  assessorSnapshot!: JsonText;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "credit", type: "varchar", length: 1000 })
  credit!: NonEmptyString1000;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

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
