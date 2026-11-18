import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { OccurrencesEntity } from "#/modules/event/schema/entities/occurrences.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { TermsEntity } from "#/modules/governance/schema/entities/terms.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * The legislative or deliberative record of one meeting of a public body. When and where it happened is the linked occurrence; this holds the house, term, session and what was considered.
 */
@Entity({ schema: "governance", name: "sittings" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["occurrenceId"], { unique: true })
@Index(["institutionId"])
@Index(["sittingKindId"])
@Index(["termId"])
@Index(["sourceCitationId"])
export class SittingsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "institution_id", type: "uuid" })
  institutionId!: Id;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "occurrence_id", type: "uuid" })
  occurrenceId!: Id;

  @ManyToOne(() => OccurrencesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "occurrence_id" })
  occurrence?: Relation<OccurrencesEntity>;

  @Column({ name: "sequence_number", type: "integer", nullable: true })
  sequenceNumber?: PositiveInteger | null;

  @Column({
    name: "session_label",
    type: "varchar",
    length: 100,
    nullable: true,
  })
  sessionLabel?: NonEmptyString100 | null;

  @Column({ name: "sitting_kind_id", type: "uuid" })
  sittingKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "sitting_kind_id" })
  sittingKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "term_id", type: "uuid", nullable: true })
  termId?: Id | null;

  @ManyToOne(() => TermsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "term_id" })
  term?: Relation<TermsEntity>;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
