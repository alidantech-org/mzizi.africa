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
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A meaningful legal content state of an instrument. Not a download and not a Source publication edition.
 */
@Entity({ schema: "legal", name: "editions" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["instrumentId", "designation"], { unique: true })
@Index(["id", "instrumentId"], { unique: true })
@Index(["supersedesId"])
@Check("chk_editions_edition_must_not_supersede_itself", `id <> supersedes_id`)
export class LegalEditionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "ceased_on", type: "date", nullable: true })
  ceasedOn?: Date | null;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "commenced_on", type: "date", nullable: true })
  commencedOn?: Date | null;

  @Column({ name: "consolidated_on", type: "date", nullable: true })
  consolidatedOn?: Date | null;

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

  @Column({ name: "observed_at", type: "timestamptz" })
  observedAt!: Date;

  @Column({ name: "repealed_on", type: "date", nullable: true })
  repealedOn?: Date | null;

  @Column({ name: "supersedes_id", type: "uuid", nullable: true })
  supersedesId?: Id | null;

  @ManyToOne(() => LegalEditionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "supersedes_id" })
  supersedes?: Relation<LegalEditionsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
