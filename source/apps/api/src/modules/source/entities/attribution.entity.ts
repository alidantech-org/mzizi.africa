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
import { DocumentEntity } from "#/modules/source/entities/document.entity.ts";
import { AttributionRelation } from "#/types/source/attribution-relation.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Locator } from "#/types/source/locator.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Attribution
 */
@Entity({ schema: "source", name: "attributions" })
@Index("idx_attribution_target", ["targetKind", "targetId"])
@Index("idx_attribution_document", ["documentId"])
export class AttributionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "attributed_by", type: "uuid", nullable: true })
  attributedBy?: Id | null;

  @Column({ name: "capture_id", type: "uuid", nullable: true })
  captureId?: Id | null;

  @Column({ name: "confidence", type: "double precision", nullable: true })
  confidence?: Confidence | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "document_id", type: "uuid" })
  documentId!: Id;

  @ManyToOne(() => DocumentEntity)
  @JoinColumn({ name: "document_id" })
  document?: Relation<DocumentEntity>;

  @Column({ name: "locator", type: "varchar", length: 500, nullable: true })
  locator?: Locator | null;

  @Column({ name: "method_id", type: "uuid" })
  methodId!: Id;

  @Column({ name: "relation", type: "enum", enum: AttributionRelation })
  relation!: AttributionRelation;

  @Column({ name: "target_field", type: "varchar", length: 300, nullable: true })
  targetField?: Label | null;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: Id;

  @Column({ name: "target_kind", type: "varchar", length: 100 })
  targetKind!: TargetKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}