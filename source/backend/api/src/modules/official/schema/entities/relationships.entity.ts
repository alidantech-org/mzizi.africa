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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * One directed typed relationship between exactly two Official identities, optionally with an ownership share.
 */
@Entity({ schema: "official", name: "relationships" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["fromEntityId", "kindId"])
@Index(["fromIndividualId", "kindId"])
@Index(["toEntityId", "kindId"])
@Index(["toIndividualId", "kindId"])
@Index(["sourceCitationId"])
@Check(
  "chk_relationships_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_relationships_relationships_dates_are_ordered",
  `starts_on = null OR ends_on = null OR starts_on <= ends_on`,
)
// Invariant "HasExactlyOneFromIdentity" has no simple form, so it isn't enforced as a database check.
// Invariant "HasExactlyOneToIdentity" has no simple form, so it isn't enforced as a database check.
@Check(
  "chk_relationships_does_not_link_identity_to_itself",
  `from_entity_id <> to_entity_id AND from_individual_id <> to_individual_id`,
)
export class OfficialRelationshipsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "ends_on", type: "date", nullable: true })
  endsOn?: Date | null;

  @Column({ name: "from_entity_id", type: "uuid", nullable: true })
  fromEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "from_entity_id" })
  fromEntity?: Relation<EntitiesEntity>;

  @Column({ name: "from_individual_id", type: "uuid", nullable: true })
  fromIndividualId?: Id | null;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "from_individual_id" })
  fromIndividual?: Relation<IndividualsEntity>;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({
    name: "share_percentage",
    type: "double precision",
    nullable: true,
  })
  sharePercentage?: Percentage | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "starts_on", type: "date", nullable: true })
  startsOn?: Date | null;

  @Column({ name: "to_entity_id", type: "uuid", nullable: true })
  toEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "to_entity_id" })
  toEntity?: Relation<EntitiesEntity>;

  @Column({ name: "to_individual_id", type: "uuid", nullable: true })
  toIndividualId?: Id | null;

  @ManyToOne(() => IndividualsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "to_individual_id" })
  toIndividual?: Relation<IndividualsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
