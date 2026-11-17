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
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One attested name form for exactly one entity or individual, with its language (`mul` or `und` when none applies) and validity.
 */
@Entity({ schema: "official", name: "names" })
@Index(["entityId", "individualId", "nameKindId", "languageId", "name"], {
  unique: true,
})
@Index(["entityId"])
@Index(["individualId"])
@Index(["nameKindId"])
@Index(["sourceCitationId"])
@Check(
  "chk_names_validity_window_is_ordered",
  `valid_from = null OR valid_until = null OR valid_from < valid_until`,
)
// Invariant "HasExactlyOneIdentityOwner" has no simple form, so it isn't enforced as a database check.
export class OfficialNamesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "entity_id", type: "uuid", nullable: true })
  entityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "entity_id" })
  entity?: Relation<EntitiesEntity>;

  @Column({ name: "individual_id", type: "uuid", nullable: true })
  individualId?: Id | null;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "individual_id" })
  individual?: Relation<IndividualsEntity>;

  @Column({ name: "is_preferred", type: "boolean" })
  isPreferred!: Flag;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "name_kind_id", type: "uuid" })
  nameKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "name_kind_id" })
  nameKind?: Relation<ValueEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
