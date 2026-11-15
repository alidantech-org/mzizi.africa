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
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One exact external identifier assigned to an entity or individual under a Reference scheme and optional issuer.
 */
@Entity({ schema: "official", name: "identifiers" })
@Index(["entityId"])
@Index(["individualId"])
@Index(["schemeId", "issuerEntityId", "namespace", "value"], { unique: true })
@Index(["schemeId", "value"])
@Index(["issuerEntityId"])
@Index(["sourceCitationId"])
@Check("chk_identifiers_validity_window_is_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
// Invariant "HasExactlyOneIdentityOwner" has no simple form, so it isn't enforced as a database check.
export class IdentifiersEntity {

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

  @Column({ name: "issuer_entity_id", type: "uuid", nullable: true })
  issuerEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "issuer_entity_id" })
  issuerEntity?: Relation<EntitiesEntity>;

  @Column({ name: "namespace", type: "varchar", length: 255, nullable: true })
  namespace?: NonEmptyString255 | null;

  @Column({ name: "scheme_id", type: "uuid" })
  schemeId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scheme_id" })
  scheme?: Relation<ValueEntity>;

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

  @Column({ name: "value", type: "varchar", length: 1000 })
  value!: NonEmptyString1000;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}