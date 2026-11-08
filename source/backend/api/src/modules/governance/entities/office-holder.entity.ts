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
import { OfficeEntity } from "#/modules/governance/entities/office.entity.ts";
import { DepartureReason } from "#/types/governance/departure-reason.enum.ts";
import { HolderStatus } from "#/types/governance/holder-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Count } from "#/types/shared/count.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Office Holder
 */
@Entity({ schema: "governance", name: "holders" })
@Index("idx_office_holder_office", ["officeId", "isCurrent"])
@Index("idx_office_holder_person", ["personId"])
export class OfficeHolderEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "departure_reason", type: "enum", enum: DepartureReason, nullable: true })
  departureReason?: DepartureReason | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "legal_basis_id", type: "uuid", nullable: true })
  legalBasisId?: Id | null;

  @Column({ name: "office_id", type: "uuid" })
  officeId!: Id;

  @ManyToOne(() => OfficeEntity)
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficeEntity>;

  @Column({ name: "person_id", type: "uuid" })
  personId!: Id;

  @Column({ name: "selection_procedure_id", type: "uuid", nullable: true })
  selectionProcedureId?: Id | null;

  @Column({ name: "status", type: "enum", enum: HolderStatus })
  status!: HolderStatus;

  @Column({ name: "term_number", type: "integer", nullable: true })
  termNumber?: Count | null;

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