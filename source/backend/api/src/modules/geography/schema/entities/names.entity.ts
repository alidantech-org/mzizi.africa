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
import { FeaturesEntity } from "#/modules/geography/schema/entities/features.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A canonical, official, local, alternative, translated or historical name for a feature, with its language (`mul` or `und` when no single language applies), validity and provenance reference.
 */
@Entity({ schema: "geography", name: "names" })
@Index(["featureId", "nameKindId", "languageId", "name"], { unique: true })
@Index(["featureId"])
@Index(["nameKindId"])
@Index(["languageId"])
@Check(
  "chk_names_validity_window_is_ordered",
  `valid_from = null OR valid_until = null OR valid_from < valid_until`,
)
export class GeographyNamesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "feature_id", type: "uuid" })
  featureId!: Id;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "feature_id" })
  feature?: Relation<FeaturesEntity>;

  @Column({ name: "is_default", type: "boolean" })
  isDefault!: Flag;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "name_kind_id", type: "uuid" })
  nameKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "name_kind_id" })
  nameKind?: Relation<ValueEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_until", type: "date", nullable: true })
  validUntil?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
