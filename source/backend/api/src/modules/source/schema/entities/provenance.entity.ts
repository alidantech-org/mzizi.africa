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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Where a record in any table came from. The loader writes one row for every seeded record, so a record's origin is a query: its dataset, the lines of the CSV and the inputs the dataset came from.
 */
@Entity({ schema: "source", name: "provenance" })
@Index(["tableName", "recordId", "datasetId", "line"], { unique: true })
@Index(["tableName", "recordId"])
@Index(["datasetId"])
@Index(["captureId"])
@Index(["documentId"])
export class ProvenanceEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "capture_id", type: "uuid", nullable: true })
  captureId?: Id | null;

  @ManyToOne(() => CapturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "capture_id" })
  capture?: Relation<CapturesEntity>;

  @Column({ name: "column_name", type: "varchar", length: 100, nullable: true })
  columnName?: NonEmptyString100 | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "dataset_id", type: "uuid" })
  datasetId!: Id;

  @ManyToOne(() => SourceDatasetsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "dataset_id" })
  dataset?: Relation<SourceDatasetsEntity>;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "document_id", type: "uuid", nullable: true })
  documentId?: Id | null;

  @ManyToOne(() => DocumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "document_id" })
  document?: Relation<DocumentsEntity>;

  @Column({ name: "line", type: "integer", nullable: true })
  line?: PositiveInteger | null;

  @Column({ name: "record_id", type: "uuid" })
  recordId!: Id;

  @Column({ name: "table_name", type: "varchar", length: 100 })
  tableName!: NonEmptyString100;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
