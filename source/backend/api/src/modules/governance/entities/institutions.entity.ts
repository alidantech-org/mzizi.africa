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
import { EntitiesEntity } from "#/modules/official/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";

/**
 * One government institution specialization of an Official entity.
 */
@Entity({ schema: "governance", name: "institutions" })
@Index(["code"], { unique: true })
@Index(["entityId"])
@Index(["sourceCitationId"])
@Check("chk_institutions_validity_window_is_ordered", `valid_from = null OR valid_until = null OR valid_from < valid_until`)
export class InstitutionsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "entity_id", type: "uuid" })
  entityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "entity_id" })
  entity?: Relation<EntitiesEntity>;

  @Column({ name: "institution_kind_id", type: "uuid" })
  institutionKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_kind_id" })
  institutionKind?: Relation<ValueEntity>;

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