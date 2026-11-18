import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { EventsEntity } from "#/modules/event/schema/entities/events.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * The name of an event in one language; at most one preferred name per event and language.
 */
@Entity({ schema: "event", name: "names" })
@Index(["eventId", "languageId", "name"], { unique: true })
@Index(["languageId"])
export class EventNamesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "event_id", type: "uuid" })
  eventId!: Id;

  @ManyToOne(() => EventsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "event_id" })
  event?: Relation<EventsEntity>;

  @Column({ name: "is_preferred", type: "boolean" })
  isPreferred!: Flag;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
