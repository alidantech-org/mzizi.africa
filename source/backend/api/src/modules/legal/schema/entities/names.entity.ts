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
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A name of one instrument in one language, with its kind and validity. All forms resolve to the same instrument.
 */
@Entity({ schema: "legal", name: "names" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["instrumentId", "languageId", "kindId", "name"], { unique: true })
@Index(["instrumentId"])
@Index(["languageId"])
@Index(["kindId"])
export class LegalNamesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "instrument_id", type: "uuid" })
  instrumentId!: Id;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "instrument_id" })
  instrument?: Relation<InstrumentsEntity>;

  @Column({ name: "is_preferred", type: "boolean" })
  isPreferred!: Flag;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

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
