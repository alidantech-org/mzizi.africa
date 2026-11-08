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
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Candidate
 */
@Entity({ schema: "electoral", name: "candidates" })
@Index("idx_candidate_seat", ["seatId"])
@Index("idx_candidate_person", ["personId"])
export class CandidateEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "is_independent", type: "boolean" })
  isIndependent!: Flag;

  @Column({ name: "nomination_status", type: "enum", enum: NominationStatus })
  nominationStatus!: NominationStatus;

  @Column({ name: "party_id", type: "uuid", nullable: true })
  partyId?: Id | null;

  @Column({ name: "person_id", type: "uuid" })
  personId!: Id;

  @Column({ name: "seat_id", type: "uuid" })
  seatId!: Id;

  @ManyToOne(() => SeatEntity)
  @JoinColumn({ name: "seat_id" })
  seat?: Relation<SeatEntity>;

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