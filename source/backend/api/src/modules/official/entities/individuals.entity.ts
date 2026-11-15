import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { CitationsEntity } from "#/modules/source/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";

/**
 * One real human identity; names, identifiers and contacts are normalized in shared tables.
 */
@Entity({ schema: "official", name: "individuals" })
@Index(["code"], { unique: true })
@Index(["sourceCitationId"])
export class IndividualsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "birth_date", type: "date", nullable: true })
  birthDate?: Date | null;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "death_date", type: "date", nullable: true })
  deathDate?: Date | null;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}