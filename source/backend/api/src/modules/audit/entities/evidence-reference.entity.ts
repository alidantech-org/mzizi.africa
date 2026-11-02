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
import type { MediaType } from "#/types/audit/media-type.type.ts";
import type { SizeBytes } from "#/types/audit/size-bytes.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Evidence Reference
 */
@Entity({ name: "evidence_references" })
@Index("idx_evidence_target", ["targetKind", "targetId"])
@Index("idx_evidence_artifact", ["artifactId"])
export class EvidenceReferenceEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "actor_id", type: "uuid" })
  actorId!: Id;

  @Column({ name: "artifact_checksum", type: "varchar", length: 64 })
  artifactChecksum!: Checksum;

  @Column({ name: "artifact_id", type: "uuid" })
  artifactId!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "media_type", type: "varchar", length: 200 })
  mediaType!: MediaType;

  @Column({ name: "note", type: "varchar", length: 4000, nullable: true })
  note?: Description | null;

  @Column({ name: "size_bytes", type: "integer" })
  sizeBytes!: SizeBytes;

  @Column({ name: "target_id", type: "uuid" })
  targetId!: Id;

  @Column({ name: "target_kind", type: "varchar", length: 100 })
  targetKind!: TargetKind;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}