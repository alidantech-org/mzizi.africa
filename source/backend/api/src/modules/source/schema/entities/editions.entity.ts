import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ProductsEntity } from "#/modules/source/schema/entities/products.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A meaningfully distinct release of a product. Another format or scan of the same wording is an artifact, not an edition.
 */
@Entity({ schema: "source", name: "editions" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["productId", "designation"], { unique: true })
@Index(["languageId"])
export class EditionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "description",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  description?: Description | null;

  @Column({ name: "designation", type: "varchar", length: 255 })
  designation!: NonEmptyString255;

  @Column({ name: "language_id", type: "uuid", nullable: true })
  languageId?: Id | null;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "product_id", type: "uuid" })
  productId!: Id;

  @ManyToOne(() => ProductsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "product_id" })
  product?: Relation<ProductsEntity>;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
