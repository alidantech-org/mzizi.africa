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
import { SeatEntity } from "#/modules/elections/entities/seat.entity.ts";
import { NominationStatus } from "#/types/elections/nomination-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Candidate
 */
@Entity({ name: "candidates" })
@Index("idx_candidate_seat", ["seatId"])
@Index("idx_candidate_person", ["personId"])
export class CandidateEntity {

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

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "is_independent", type: "boolean" })
  isIndependent!: Flag;

  @Column({ name: "licence", type: "varchar", length: 300, nullable: true })
  licence?: Name | null;

  @Column({ name: "method", type: "enum", enum: ProvenanceMethod })
  method!: ProvenanceMethod;

  @Column({ name: "nomination_status", type: "enum", enum: NominationStatus })
  nominationStatus!: NominationStatus;

  @Column({ name: "party_id", type: "uuid", nullable: true })
  partyId?: Id | null;

  @Column({ name: "person_id", type: "uuid" })
  personId!: Id;

  @Column({ name: "retrieved_at", type: "timestamptz", nullable: true })
  retrievedAt?: Date | null;

  @Column({ name: "seat_id", type: "uuid" })
  seatId!: Id;

  @ManyToOne(() => SeatEntity)
  @JoinColumn({ name: "seat_id" })
  seat?: Relation<SeatEntity>;

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