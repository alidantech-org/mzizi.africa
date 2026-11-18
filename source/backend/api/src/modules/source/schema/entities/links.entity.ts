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
import { SlugsEntity } from "#/modules/source/schema/entities/slugs.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * A dated relation between two slugs that name the same thing or the same area: translations, aliases, a constituency and a sub-county covering the same land. Must not form cycles.
 */
@Entity({ schema: "source", name: "links" })
@Index(["fromSlugId", "toSlugId", "relationKindId"], { unique: true })
@Index(["toSlugId"])
@Index(["relationKindId"])
@Check(
  "chk_links_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check("chk_links_slug_relation_ends_differ", `from_slug_id <> to_slug_id`)
export class LinksEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "from_slug_id", type: "uuid" })
  fromSlugId!: Id;

  @ManyToOne(() => SlugsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "from_slug_id" })
  fromSlug?: Relation<SlugsEntity>;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "relation_kind_id", type: "uuid" })
  relationKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "relation_kind_id" })
  relationKind?: Relation<ValueEntity>;

  @Column({ name: "to_slug_id", type: "uuid" })
  toSlugId!: Id;

  @ManyToOne(() => SlugsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "to_slug_id" })
  toSlug?: Relation<SlugsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
