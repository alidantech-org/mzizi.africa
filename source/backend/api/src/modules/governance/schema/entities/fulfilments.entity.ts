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
import { ProjectsEntity } from "#/modules/civic/schema/entities/projects.entity.ts";
import { AppropriationsEntity } from "#/modules/finance/schema/entities/appropriations.entity.ts";
import { BillsEntity } from "#/modules/governance/schema/entities/bills.entity.ts";
import { PromisesEntity } from "#/modules/governance/schema/entities/promises.entity.ts";
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A recorded link from a promise to what delivered it, with how the link was made and whether it is reviewed.
 */
@Entity({ schema: "governance", name: "fulfilments" })
@Index(["promiseId"])
@Index(["projectId"])
@Index(["contractId"])
@Index(["appropriationId"])
@Index(["billId"])
@Index(["instrumentId"])
@Index(["evidenceStatusId"])
@Index(["sourceCitationId"])
@Check(
  "chk_fulfilments_links_something",
  `project_id <> null OR contract_id <> null OR appropriation_id <> null OR bill_id <> null OR instrument_id <> null`,
)
export class FulfilmentsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "appropriation_id", type: "uuid", nullable: true })
  appropriationId?: Id | null;

  @ManyToOne(() => AppropriationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "appropriation_id" })
  appropriation?: Relation<AppropriationsEntity>;

  @Column({ name: "bill_id", type: "uuid", nullable: true })
  billId?: Id | null;

  @ManyToOne(() => BillsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bill_id" })
  bill?: Relation<BillsEntity>;

  @Column({ name: "contract_id", type: "uuid", nullable: true })
  contractId?: Id | null;

  @ManyToOne(() => ContractsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contract_id" })
  contract?: Relation<ContractsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "evidence_status_id", type: "uuid" })
  evidenceStatusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "evidence_status_id" })
  evidenceStatus?: Relation<ValueEntity>;

  @Column({ name: "instrument_id", type: "uuid", nullable: true })
  instrumentId?: Id | null;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "instrument_id" })
  instrument?: Relation<InstrumentsEntity>;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "project_id", type: "uuid", nullable: true })
  projectId?: Id | null;

  @ManyToOne(() => ProjectsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "project_id" })
  project?: Relation<ProjectsEntity>;

  @Column({ name: "promise_id", type: "uuid" })
  promiseId!: Id;

  @ManyToOne(() => PromisesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "promise_id" })
  promise?: Relation<PromisesEntity>;

  @Column({ name: "recorded_on", type: "date" })
  recordedOn!: Date;

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
