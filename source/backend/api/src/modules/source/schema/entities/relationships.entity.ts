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
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { EditionsEntity } from "#/modules/source/schema/entities/editions.entity.ts";
import { ProductsEntity } from "#/modules/source/schema/entities/products.entity.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A classified connection from an input to an output or a domain record: derivation, extraction, translation, support. Exact locations are citations on the relationship.
 */
@Entity({ schema: "source", name: "relationships" })
@Index(["kindId"])
@Index(["subjectTable", "subjectId"])
// Invariant "SubjectKeysTogether" has no simple form, so it isn't enforced as a database check.
// Invariant "ExactlyOneOutput" has no simple form, so it isn't enforced as a database check.
// Invariant "ExactlyOneInput" has no simple form, so it isn't enforced as a database check.
export class SourceRelationshipsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "execution_ref",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  executionRef?: NonEmptyString255 | null;

  @Column({ name: "input_artifact_id", type: "uuid", nullable: true })
  inputArtifactId?: Id | null;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_artifact_id" })
  inputArtifact?: Relation<ArtifactsEntity>;

  @Column({ name: "input_capture_id", type: "uuid", nullable: true })
  inputCaptureId?: Id | null;

  @ManyToOne(() => CapturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_capture_id" })
  inputCapture?: Relation<CapturesEntity>;

  @Column({ name: "input_edition_id", type: "uuid", nullable: true })
  inputEditionId?: Id | null;

  @ManyToOne(() => EditionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_edition_id" })
  inputEdition?: Relation<EditionsEntity>;

  @Column({ name: "input_file_version_id", type: "uuid", nullable: true })
  inputFileVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_file_version_id" })
  inputFileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "input_product_id", type: "uuid", nullable: true })
  inputProductId?: Id | null;

  @ManyToOne(() => ProductsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_product_id" })
  inputProduct?: Relation<ProductsEntity>;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "method", type: "varchar", length: 4000, nullable: true })
  method?: Description | null;

  @Column({ name: "output_artifact_id", type: "uuid", nullable: true })
  outputArtifactId?: Id | null;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "output_artifact_id" })
  outputArtifact?: Relation<ArtifactsEntity>;

  @Column({ name: "output_capture_id", type: "uuid", nullable: true })
  outputCaptureId?: Id | null;

  @ManyToOne(() => CapturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "output_capture_id" })
  outputCapture?: Relation<CapturesEntity>;

  @Column({ name: "output_edition_id", type: "uuid", nullable: true })
  outputEditionId?: Id | null;

  @ManyToOne(() => EditionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "output_edition_id" })
  outputEdition?: Relation<EditionsEntity>;

  @Column({ name: "output_file_version_id", type: "uuid", nullable: true })
  outputFileVersionId?: Id | null;

  @ManyToOne(() => FileVersionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "output_file_version_id" })
  outputFileVersion?: Relation<FileVersionsEntity>;

  @Column({ name: "output_product_id", type: "uuid", nullable: true })
  outputProductId?: Id | null;

  @ManyToOne(() => ProductsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "output_product_id" })
  outputProduct?: Relation<ProductsEntity>;

  @Column({ name: "subject_id", type: "uuid", nullable: true })
  subjectId?: Id | null;

  @Column({
    name: "subject_table",
    type: "enum",
    enum: SubjectTable,
    nullable: true,
  })
  subjectTable?: SubjectTable | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
