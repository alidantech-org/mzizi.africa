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
import { ElectionEntity } from "#/modules/elections/entities/election.entity.ts";
import { ResultStatus } from "#/types/elections/result-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { EvidenceForm } from "#/types/elections/evidence-form.type.ts";
import type { RegisterVersion } from "#/types/elections/register-version.type.ts";
import type { Votes } from "#/types/elections/votes.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Electorate
 */
@Entity({ schema: "electoral", name: "electorates" })
@Index("idx_electorate_election", ["electionId", "resultLevelId"])
@Index("idx_electorate_geo", ["geoUnitId"])
export class ElectorateEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "declared_at", type: "timestamptz", nullable: true })
  declaredAt?: Date | null;

  @Column({ name: "declaring_institution_id", type: "uuid", nullable: true })
  declaringInstitutionId?: Id | null;

  @Column({ name: "election_id", type: "uuid" })
  electionId!: Id;

  @ManyToOne(() => ElectionEntity)
  @JoinColumn({ name: "election_id" })
  election?: Relation<ElectionEntity>;

  @Column({ name: "evidence_form", type: "varchar", length: 120, nullable: true })
  evidenceForm?: EvidenceForm | null;

  @Column({ name: "geo_unit_id", type: "uuid", nullable: true })
  geoUnitId?: Id | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "register_version", type: "varchar", length: 200, nullable: true })
  registerVersion?: RegisterVersion | null;

  @Column({ name: "registered_voters", type: "integer", nullable: true })
  registeredVoters?: Votes | null;

  @Column({ name: "rejected_votes", type: "integer", nullable: true })
  rejectedVotes?: Votes | null;

  @Column({ name: "result_level_id", type: "uuid" })
  resultLevelId!: Id;

  @Column({ name: "result_status", type: "enum", enum: ResultStatus, nullable: true })
  resultStatus?: ResultStatus | null;

  @Column({ name: "seat_id", type: "uuid", nullable: true })
  seatId?: Id | null;

  @Column({ name: "spoilt_votes", type: "integer", nullable: true })
  spoiltVotes?: Votes | null;

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

  @Column({ name: "valid_votes", type: "integer", nullable: true })
  validVotes?: Votes | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "votes_cast", type: "integer", nullable: true })
  votesCast?: Votes | null;
}