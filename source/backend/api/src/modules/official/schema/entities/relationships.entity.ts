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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One directed typed relationship between exactly two Official identities, optionally with an ownership share.
 */
@Entity({ schema: "official", name: "relationships" })
@Index(["fromEntityId", "kindId"])
@Index(["fromIndividualId", "kindId"])
@Index(["toEntityId", "kindId"])
@Index(["toIndividualId", "kindId"])
@Index(["sourceCitationId"])
@Check("chk_relationships_validity_window_is_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
// Invariant "HasExactlyOneFromIdentity" has no simple form, so it isn't enforced as a database check.
// Invariant "HasExactlyOneToIdentity" has no simple form, so it isn't enforced as a database check.
@Check("chk_relationships_does_not_link_identity_to_itself", `from_entity_id <> to_entity_id AND from_individual_id <> to_individual_id`)
export class RelationshipsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

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

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "share_percentage", type: "double precision", nullable: true })
  sharePercentage?: Percentage | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

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

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}