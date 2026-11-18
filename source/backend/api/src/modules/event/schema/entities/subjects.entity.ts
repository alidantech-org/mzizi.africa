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
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * What an event is about or belongs to: an election, an institution, a person, a facility, a bill. An election's registration and nomination dates are events attached to it here.
 */
@Entity({ schema: "event", name: "subjects" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["eventId", "subjectTable", "subjectId", "roleId"], { unique: true })
@Index(["subjectTable", "subjectId"])
export class SubjectsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "event_id", type: "uuid" })
  eventId!: Id;

  @ManyToOne(() => EventsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "event_id" })
  event?: Relation<EventsEntity>;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<ValueEntity>;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: Id;

  @Column({ name: "subject_table", type: "enum", enum: SubjectTable })
  subjectTable!: SubjectTable;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
