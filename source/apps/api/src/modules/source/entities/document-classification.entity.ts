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
import { ClassifierMethod } from "#/types/source/classifier-method.enum.ts";
import { RouteStatus } from "#/types/source/route-status.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DocumentKindCode } from "#/types/source/document-kind-code.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Document Classification
 */
@Entity({ schema: "source", name: "document_classifications" })
@Index("idx_docclass_document_version", ["documentId", "classifierVersion"], { unique: true })
@Index("idx_docclass_kind", ["kind"])
export class DocumentClassificationEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "classified_at", type: "timestamptz" })
  classifiedAt!: Date;

  @Column({ name: "classifier_version", type: "varchar", length: 200 })
  classifierVersion!: ToolName;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "document_id", type: "uuid" })
  documentId!: Id;

  @Column({ name: "evidence", type: "text", nullable: true })
  evidence?: LongText | null;

  @Column({ name: "facts", type: "text", nullable: true })
  facts?: LongText | null;

  @Column({ name: "kind", type: "varchar", length: 60 })
  kind!: DocumentKindCode;

  @Column({ name: "method", type: "enum", enum: ClassifierMethod })
  method!: ClassifierMethod;

  @Column({ name: "route_parser", type: "varchar", length: 200, nullable: true })
  routeParser?: ToolName | null;

  @Column({ name: "route_status", type: "enum", enum: RouteStatus })
  routeStatus!: RouteStatus;

  @Column({ name: "score", type: "double precision" })
  score!: Confidence;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}