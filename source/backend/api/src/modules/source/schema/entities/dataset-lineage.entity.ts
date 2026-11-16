import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { CapturesEntity } from "#/modules/source/schema/entities/captures.entity.ts";
import { SourceDatasetsEntity } from "#/modules/source/schema/entities/datasets.entity.ts";
import { DocumentsEntity } from "#/modules/source/schema/entities/documents.entity.ts";
import { LineageRole } from "#/modules/source/schema/enum/lineage-role.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * What a dataset was prepared from: a capture, a document or another dataset, with the role and method.
 */
@Entity({ schema: "source", name: "dataset_lineage" })
@Index(["datasetId", "inputDatasetId", "inputDocumentId", "inputCaptureId"], {
  unique: true,
})
@Index(["datasetId"])
@Index(["inputDatasetId"])
@Index(["inputDocumentId"])
@Index(["inputCaptureId"])
export class DatasetLineageEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "dataset_id", type: "uuid" })
  datasetId!: Id;

  @ManyToOne(() => SourceDatasetsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "dataset_id" })
  dataset?: Relation<SourceDatasetsEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "input_capture_id", type: "uuid", nullable: true })
  inputCaptureId?: Id | null;

  @ManyToOne(() => CapturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_capture_id" })
  inputCapture?: Relation<CapturesEntity>;

  @Column({ name: "input_dataset_id", type: "uuid", nullable: true })
  inputDatasetId?: Id | null;

  @ManyToOne(() => SourceDatasetsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_dataset_id" })
  inputDataset?: Relation<SourceDatasetsEntity>;

  @Column({ name: "input_document_id", type: "uuid", nullable: true })
  inputDocumentId?: Id | null;

  @ManyToOne(() => DocumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "input_document_id" })
  inputDocument?: Relation<DocumentsEntity>;

  @Column({ name: "method", type: "varchar", length: 4000, nullable: true })
  method?: Description | null;

  @Column({ name: "role", type: "enum", enum: LineageRole })
  role!: LineageRole;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
