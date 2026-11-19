import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ContractsEntity } from "#/modules/civic/schema/entities/contracts.entity.ts";
import { ProcurementsEntity } from "#/modules/civic/schema/entities/procurements.entity.ts";
import { OfficesEntity } from "#/modules/governance/schema/entities/offices.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A person who acted in a buying process (evaluated, approved, signed), with the role and the office held then; this is what lets a conflict be checked on a real signature.
 */
@Entity({ schema: "civic", name: "officials" })
@Index(["procurementId"])
@Index(["contractId"])
@Index(["individualId"])
@Index(["roleId"])
@Index(["officeId"])
@Index(["sourceCitationId"])
@Check("chk_officials_has_procurement_or_contract", `procurement_id <> null OR contract_id <> null`)
export class OfficialsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "acted_on", type: "date", nullable: true })
  actedOn?: Date | null;

  @Column({ name: "contract_id", type: "uuid", nullable: true })
  contractId?: Id | null;

  @ManyToOne(() => ContractsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contract_id" })
  contract?: Relation<ContractsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "individual_id", type: "uuid" })
  individualId!: Id;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "individual_id" })
  individual?: Relation<IndividualsEntity>;

  @Column({ name: "office_id", type: "uuid", nullable: true })
  officeId?: Id | null;

  @ManyToOne(() => OfficesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "office_id" })
  office?: Relation<OfficesEntity>;

  @Column({ name: "procurement_id", type: "uuid", nullable: true })
  procurementId?: Id | null;

  @ManyToOne(() => ProcurementsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "procurement_id" })
  procurement?: Relation<ProcurementsEntity>;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
