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
import { LegalEntityEntity } from "#/modules/entities/entities/legal-entity.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { OwnershipPercentage } from "#/types/entities/ownership-percentage.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Entity Ownership
 */
@Entity({ schema: "org", name: "ownerships" })
@Index("idx_entity_ownership_entity", ["entityId"])
export class EntityOwnershipEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "artifact_checksum", type: "varchar", length: 64, nullable: true })
  artifactChecksum?: Checksum | null;

  @Column({ name: "artifact_id", type: "uuid", nullable: true })
  artifactId?: Id | null;

  @Column({ name: "confidence", type: "double precision", nullable: true })
  confidence?: Confidence | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "entity_id", type: "uuid" })
  entityId!: Id;

  @ManyToOne(() => LegalEntityEntity)
  @JoinColumn({ name: "entity_id" })
  entity?: Relation<LegalEntityEntity>;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "licence", type: "varchar", length: 300, nullable: true })
  licence?: Name | null;

  @Column({ name: "method", type: "enum", enum: ProvenanceMethod })
  method!: ProvenanceMethod;

  @Column({ name: "owner_entity_id", type: "uuid", nullable: true })
  ownerEntityId?: Id | null;

  @Column({ name: "owner_person_id", type: "uuid", nullable: true })
  ownerPersonId?: Id | null;

  @Column({ name: "percentage", type: "numeric", precision: 7, scale: 4, transformer: new ColumnNumericTransformer(), nullable: true })
  percentage?: OwnershipPercentage | null;

  @Column({ name: "position", type: "varchar", length: 300, nullable: true })
  position?: Label | null;

  @Column({ name: "retrieved_at", type: "timestamptz", nullable: true })
  retrievedAt?: Date | null;

  @Column({ name: "source_name", type: "varchar", length: 300 })
  sourceName!: Name;

  @Column({ name: "source_reference", type: "varchar", length: 4000, nullable: true })
  sourceReference?: Description | null;

  @Column({ name: "source_url", type: "varchar", length: 1000, nullable: true })
  sourceUrl?: Url | null;

  @Column({ name: "tool_or_model", type: "varchar", length: 300, nullable: true })
  toolOrModel?: Name | null;

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

  @Column({ name: "verification_state", type: "enum", enum: VerificationState })
  verificationState!: VerificationState;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}