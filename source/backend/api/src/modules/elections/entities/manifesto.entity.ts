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
import { CandidateEntity } from "#/modules/elections/entities/candidate.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Manifesto
 */
@Entity({ schema: "electoral", name: "manifestos" })
@Index("idx_manifesto_candidate", ["candidateId"])
export class ManifestoEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "candidate_id", type: "uuid" })
  candidateId!: Id;

  @ManyToOne(() => CandidateEntity)
  @JoinColumn({ name: "candidate_id" })
  candidate?: Relation<CandidateEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "document_url", type: "varchar", length: 1000, nullable: true })
  documentUrl?: Url | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "language", type: "varchar", length: 300, nullable: true })
  language?: Label | null;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}