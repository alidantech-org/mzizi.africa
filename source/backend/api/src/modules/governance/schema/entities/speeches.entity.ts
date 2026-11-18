import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { BillsEntity } from "#/modules/governance/schema/entities/bills.entity.ts";
import { HansardsEntity } from "#/modules/governance/schema/entities/hansards.entity.ts";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { MotionsEntity } from "#/modules/governance/schema/entities/motions.entity.ts";
import { SittingsEntity } from "#/modules/governance/schema/entities/sittings.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One member's contribution at a sitting as recorded in the Hansard: a speech, question, answer, statement or ruling. The full text, when stored, is a content row about this speech.
 */
@Entity({ schema: "governance", name: "speeches" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["sittingId", "position"], { unique: true })
@Index(["holderId"])
@Index(["motionId"])
@Index(["billId"])
@Index(["hansardId"])
@Index(["sourceCitationId"])
export class SpeechesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "bill_id", type: "uuid", nullable: true })
  billId?: Id | null;

  @ManyToOne(() => BillsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bill_id" })
  bill?: Relation<BillsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "hansard_id", type: "uuid", nullable: true })
  hansardId?: Id | null;

  @ManyToOne(() => HansardsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "hansard_id" })
  hansard?: Relation<HansardsEntity>;

  @Column({ name: "holder_id", type: "uuid" })
  holderId!: Id;

  @ManyToOne(() => HoldersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "holder_id" })
  holder?: Relation<HoldersEntity>;

  @Column({ name: "motion_id", type: "uuid", nullable: true })
  motionId?: Id | null;

  @ManyToOne(() => MotionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "motion_id" })
  motion?: Relation<MotionsEntity>;

  @Column({
    name: "page_reference",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  pageReference?: NonEmptyString100 | null;

  @Column({ name: "position", type: "integer" })
  position!: PositiveInteger;

  @Column({ name: "sitting_id", type: "uuid" })
  sittingId!: Id;

  @ManyToOne(() => SittingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "sitting_id" })
  sitting?: Relation<SittingsEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "speech_kind_id", type: "uuid" })
  speechKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "speech_kind_id" })
  speechKind?: Relation<ValueEntity>;

  @Column({ name: "summary", type: "varchar", length: 4000, nullable: true })
  summary?: Description | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;

  @Column({ name: "word_count", type: "integer", nullable: true })
  wordCount?: NonNegativeInteger | null;
}
