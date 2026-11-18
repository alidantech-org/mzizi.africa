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
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { WordingsEntity } from "#/modules/legal/schema/entities/wordings.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A substantive legal operation or hierarchy link between wordings or instruments. Source derivation is not recorded here.
 */
@Entity({ schema: "legal", name: "relationships" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["kindId"])
@Index(["authorityWordingId"])
@Index(["affectedWordingId"])
@Index(["resultingWordingId"])
@Index(["subjectInstrumentId"])
@Index(["objectInstrumentId"])
@Index(["citationId"])
// Invariant "ExactlyOneLevel" has no simple form, so it isn't enforced as a database check.
// Invariant "InstrumentEndsTogether" has no simple form, so it isn't enforced as a database check.
@Check("chk_relationships_instruments_must_differ", `subject_instrument_id <> object_instrument_id`)
@Check(
  "chk_relationships_wording_must_not_affect_itself",
  `affected_wording_id <> resulting_wording_id`,
)
export class LegalRelationshipsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "affected_wording_id", type: "uuid", nullable: true })
  affectedWordingId?: Id | null;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "affected_wording_id" })
  affectedWording?: Relation<WordingsEntity>;

  @Column({ name: "authority_wording_id", type: "uuid", nullable: true })
  authorityWordingId?: Id | null;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "authority_wording_id" })
  authorityWording?: Relation<WordingsEntity>;

  @Column({ name: "citation_id", type: "uuid", nullable: true })
  citationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "citation_id" })
  citation?: Relation<CitationsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "effective_on", type: "date", nullable: true })
  effectiveOn?: Date | null;

  @Column({
    name: "explanation",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  explanation?: Description | null;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "object_instrument_id", type: "uuid", nullable: true })
  objectInstrumentId?: Id | null;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "object_instrument_id" })
  objectInstrument?: Relation<InstrumentsEntity>;

  @Column({ name: "resulting_wording_id", type: "uuid", nullable: true })
  resultingWordingId?: Id | null;

  @ManyToOne(() => WordingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "resulting_wording_id" })
  resultingWording?: Relation<WordingsEntity>;

  @Column({ name: "subject_instrument_id", type: "uuid", nullable: true })
  subjectInstrumentId?: Id | null;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "subject_instrument_id" })
  subjectInstrument?: Relation<InstrumentsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
