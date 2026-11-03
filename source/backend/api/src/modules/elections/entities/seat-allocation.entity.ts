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
import { AllocationKind } from "#/types/elections/allocation-kind.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Seat Allocation
 */
@Entity({ schema: "electoral", name: "seat_allocations" })
@Index("idx_seat_allocation_election", ["electionId", "kind"])
@Index("idx_seat_allocation_party", ["partyId"])
export class SeatAllocationEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "allocated_on", type: "date", nullable: true })
  allocatedOn?: Date | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "declaring_institution_id", type: "uuid", nullable: true })
  declaringInstitutionId?: Id | null;

  @Column({ name: "election_id", type: "uuid" })
  electionId!: Id;

  @ManyToOne(() => ElectionEntity)
  @JoinColumn({ name: "election_id" })
  election?: Relation<ElectionEntity>;

  @Column({ name: "geo_unit_id", type: "uuid", nullable: true })
  geoUnitId?: Id | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: AllocationKind })
  kind!: AllocationKind;

  @Column({ name: "list_position", type: "integer", nullable: true })
  listPosition?: Count | null;

  @Column({ name: "party_id", type: "uuid" })
  partyId!: Id;

  @Column({ name: "person_id", type: "uuid", nullable: true })
  personId?: Id | null;

  @Column({ name: "seat_id", type: "uuid", nullable: true })
  seatId?: Id | null;

  @Column({ name: "seats_entitled", type: "integer", nullable: true })
  seatsEntitled?: Count | null;

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