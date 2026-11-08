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
import type { Rank } from "#/types/elections/rank.type.ts";
import type { Votes } from "#/types/elections/votes.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Election Result
 */
@Entity({ schema: "electoral", name: "results" })
@Index("idx_result_candidate", ["candidateId"])
@Index("idx_result_seat", ["seatId", "resultLevelId"])
export class ElectionResultEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "candidate_id", type: "uuid" })
  candidateId!: Id;

  @ManyToOne(() => CandidateEntity)
  @JoinColumn({ name: "candidate_id" })
  candidate?: Relation<CandidateEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "declared_at", type: "timestamptz", nullable: true })
  declaredAt?: Date | null;

  @Column({ name: "declaring_institution_id", type: "uuid", nullable: true })
  declaringInstitutionId?: Id | null;

  @Column({ name: "geo_unit_id", type: "uuid", nullable: true })
  geoUnitId?: Id | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "is_winner", type: "boolean" })
  isWinner!: Flag;

  @Column({ name: "rank", type: "integer", nullable: true })
  rank?: Rank | null;

  @Column({ name: "result_level_id", type: "uuid" })
  resultLevelId!: Id;

  @Column({ name: "seat_id", type: "uuid" })
  seatId!: Id;

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

  @Column({ name: "votes", type: "integer" })
  votes!: Votes;
}