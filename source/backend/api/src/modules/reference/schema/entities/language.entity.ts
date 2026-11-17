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

import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Glottocode } from "#/modules/reference/schema/type/glottocode.type.ts";
import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Iso6392 } from "#/modules/reference/schema/type/iso6392.type.ts";
import type { Iso6393 } from "#/modules/reference/schema/type/iso6393.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A language, macrolanguage, variety or one of the special no-language codes, with its ISO 639 and Glottolog identifiers and its classification as scheme values.
 */
@Entity({ schema: "reference", name: "languages" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["iso6391"], { unique: true })
@Index(["iso6393"], { unique: true })
@Index(["glottocode"], { unique: true })
@Index(["name"])
@Index(["kindId"])
@Index(["familyId"])
@Index(["scriptId"])
@Index(["parentId"])
@Check("chk_language_language_is_not_its_own_parent", `id <> parent_id`)
export class LanguageEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "direction_id", type: "uuid", nullable: true })
  directionId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "direction_id" })
  direction?: Relation<ValueEntity>;

  @Column({ name: "family_id", type: "uuid", nullable: true })
  familyId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "family_id" })
  family?: Relation<ValueEntity>;

  @Column({ name: "glottocode", type: "char", length: 8, nullable: true })
  glottocode?: Glottocode | null;

  @Column({ name: "iso6391", type: "char", length: 2, nullable: true })
  iso6391?: Iso6391 | null;

  @Column({ name: "iso6392", type: "char", length: 3, nullable: true })
  iso6392?: Iso6392 | null;

  @Column({ name: "iso6393", type: "char", length: 3, nullable: true })
  iso6393?: Iso6393 | null;

  @Column({ name: "kind_id", type: "uuid" })
  kindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "kind_id" })
  kind?: Relation<ValueEntity>;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "parent_id", type: "uuid", nullable: true })
  parentId?: Id | null;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_id" })
  parent?: Relation<LanguageEntity>;

  @Column({ name: "script_id", type: "uuid", nullable: true })
  scriptId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "script_id" })
  script?: Relation<ValueEntity>;

  @Column({ name: "status_id", type: "uuid", nullable: true })
  statusId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
