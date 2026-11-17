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
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { SourceRelationshipsEntity } from "#/modules/source/schema/entities/relationships.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";

/**
 * Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp.
 */
@Entity({ schema: "source", name: "citations" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["artifactId"])
@Index(["captureId"])
@Index(["relationshipId"])
@Index(["locatorKindId"])
export class CitationsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "artifact_id", type: "uuid" })
  artifactId!: Id;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "artifact_id" })
  artifact?: Relation<ArtifactsEntity>;

  @Column({ name: "capture_id", type: "uuid", nullable: true })
  captureId?: Id | null;

  @ManyToOne(() => CapturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "capture_id" })
  capture?: Relation<CapturesEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "locator", type: "text" })
  locator!: JsonText;

  @Column({ name: "locator_kind_id", type: "uuid" })
  locatorKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "locator_kind_id" })
  locatorKind?: Relation<ValueEntity>;

  @Column({ name: "quoted_hash", type: "char", length: 64, nullable: true })
  quotedHash?: Sha256 | null;

  @Column({ name: "recorded_at", type: "timestamptz" })
  recordedAt!: Date;

  @Column({ name: "relationship_id", type: "uuid", nullable: true })
  relationshipId?: Id | null;

  @ManyToOne(() => SourceRelationshipsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "relationship_id" })
  relationship?: Relation<SourceRelationshipsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
