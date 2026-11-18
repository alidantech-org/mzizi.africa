import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { ProvisionKind } from "#/modules/legal/schema/enum/provision-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Stable provision identity within one instrument; hierarchy stays within that instrument. One provision holds one statement.
 */
@Entity({ schema: "legal", name: "provisions" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["parentId", "position"], { unique: true })
@Index(["id", "instrumentId"], { unique: true })
@Index(["instrumentId"])
@Index(["parentId"])
export class ProvisionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "designation", type: "varchar", length: 255 })
  designation!: NonEmptyString255;

  @Column({ name: "instrument_id", type: "uuid" })
  instrumentId!: Id;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "instrument_id" })
  instrument?: Relation<InstrumentsEntity>;

  @Column({ name: "kind", type: "enum", enum: ProvisionKind })
  kind!: ProvisionKind;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_id" })
  parent?: Relation<ProvisionsEntity>;

  @Column({ name: "position", type: "integer" })
  position!: PositiveInteger;

  @Column({ name: "title", type: "varchar", length: 300, nullable: true })
  title?: Name | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
