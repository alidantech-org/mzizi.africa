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
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { IndividualsEntity } from "#/modules/official/schema/entities/individuals.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * One organisation or person taking part in one occurrence in a role.
 */
@Entity({ schema: "event", name: "participants" })
@Index(["occurrenceId"])
@Index(["entityId"])
@Index(["individualId"])
@Index(["roleId"])
// Invariant "ExactlyOneParticipant" has no simple form, so it isn't enforced as a database check.
export class ParticipantsEntity {
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

  @Column({ name: "occurrence_id", type: "uuid" })
  occurrenceId!: Id;

  @ManyToOne(() => OccurrencesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "occurrence_id" })
  occurrence?: Relation<OccurrencesEntity>;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
