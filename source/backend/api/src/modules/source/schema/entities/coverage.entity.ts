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
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { ProductsEntity } from "#/modules/source/schema/entities/products.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/**
 * What a source or product covers, for which place, years and kind of record, how completely, and when that was checked. It makes every 'none recorded' honest: the page says which sources were checked, and a gap is never read as zero.
 */
@Entity({ schema: "source", name: "coverage" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId", "coverageSubjectId"])
@Index(["sourceId"])
@Index(["productId"])
@Index(["scopeUnitFeatureId"])
@Index(["levelId"])
@Index(["publisherEntityId"])
@Check("chk_coverage_source_or_product_named", `source_id <> null OR product_id <> null`)
@Check(
  "chk_coverage_coverage_period_is_ordered",
  `period_from = null OR period_until = null OR period_from <= period_until`,
)
export class CoverageEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "checked_on", type: "date" })
  checkedOn!: Date;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "country_id", type: "uuid" })
  countryId!: Id;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "coverage_subject_id", type: "uuid" })
  coverageSubjectId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "coverage_subject_id" })
  coverageSubject?: Relation<ValueEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "expected_publication_url",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  expectedPublicationUrl?: Url | null;

  @Column({ name: "level_id", type: "uuid" })
  levelId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "level_id" })
  level?: Relation<ValueEntity>;

  @Column({ name: "note", type: "varchar", length: 4000, nullable: true })
  note?: Description | null;

  @Column({ name: "period_from", type: "date", nullable: true })
  periodFrom?: Date | null;

  @Column({ name: "period_until", type: "date", nullable: true })
  periodUntil?: Date | null;

  @Column({ name: "product_id", type: "uuid", nullable: true })
  productId?: Id | null;

  @ManyToOne(() => ProductsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "product_id" })
  product?: Relation<ProductsEntity>;

  @Column({ name: "publisher_entity_id", type: "uuid", nullable: true })
  publisherEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "publisher_entity_id" })
  publisherEntity?: Relation<EntitiesEntity>;

  @Column({ name: "scope_unit_feature_id", type: "uuid", nullable: true })
  scopeUnitFeatureId?: Id | null;

  @ManyToOne(() => FeaturesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scope_unit_feature_id" })
  scopeUnitFeature?: Relation<FeaturesEntity>;

  @Column({ name: "source_id", type: "uuid", nullable: true })
  sourceId?: Id | null;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
