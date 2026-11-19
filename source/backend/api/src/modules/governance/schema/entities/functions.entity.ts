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

import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { TopicEntity } from "#/modules/reference/schema/entities/topic.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * A public function that a constitution or law assigns to a level of government. Its name and plain wording are copy keyed by code.
 */
@Entity({ schema: "governance", name: "functions" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId"])
@Index(["parentFunctionId"])
@Index(["topicId"])
@Index(["basisProvisionId"])
@Index(["sourceCitationId"])
@Check(
  "chk_functions_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check("chk_functions_function_does_not_parent_itself", `id <> parent_function_id`)
export class FunctionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "basis_provision_id", type: "uuid", nullable: true })
  basisProvisionId?: Id | null;

  @ManyToOne(() => ProvisionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "basis_provision_id" })
  basisProvision?: Relation<ProvisionsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "country_id", type: "uuid" })
  countryId!: Id;

  @ManyToOne(() => CountryEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "country_id" })
  country?: Relation<CountryEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "parent_function_id", type: "uuid", nullable: true })
  parentFunctionId?: Id | null;

  @ManyToOne(() => FunctionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "parent_function_id" })
  parentFunction?: Relation<FunctionsEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "topic_id", type: "uuid", nullable: true })
  topicId?: Id | null;

  @ManyToOne(() => TopicEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "topic_id" })
  topic?: Relation<TopicEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
