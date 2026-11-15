import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";

/**
 * Durable evidence bundle whose exact supporting items are normalized citations.
 */
@Entity({ schema: "source", name: "evidence" })
@Index(["code"], { unique: true })
@Index(["kindId"])
export class EvidenceEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "assembled_at", type: "timestamptz" })
  assembledAt!: Date;

  @Column({ name: "assembled_by_snapshot", type: "text" })
  assembledBySnapshot!: JsonText;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "description", type: "varchar", length: 4000, nullable: true })
  description?: Description | null;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}