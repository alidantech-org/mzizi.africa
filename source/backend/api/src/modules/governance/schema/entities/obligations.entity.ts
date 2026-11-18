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

import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { ProvisionsEntity } from "#/modules/legal/schema/entities/provisions.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * A duty to report or publish, with who owes it, to whom, how often and the law that creates it. Each filing found is a report.
 */
@Entity({ schema: "governance", name: "obligations" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId"])
@Index(["obligationKindId"])
@Index(["obligorInstitutionId"])
@Index(["obligorKindId"])
@Index(["basisProvisionId"])
@Index(["sourceCitationId"])
@Check(
  "chk_obligations_period_years_are_ordered",
  `from_year = null OR to_year = null OR from_year <= to_year`,
)
@Check(
  "chk_obligations_one_obligor_form",
  `obligor_institution_id <> null OR obligor_kind_id <> null`,
)
export class ObligationsEntity {
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

  @Column({ name: "description", type: "varchar", length: 4000 })
  description!: Description;

  @Column({ name: "frequency_id", type: "uuid" })
  frequencyId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "frequency_id" })
  frequency?: Relation<ValueEntity>;

  @Column({
    name: "from_to_precision",
    type: "enum",
    enum: DatePrecision,
    nullable: true,
  })
  fromToPrecision?: DatePrecision | null;

  @Column({ name: "from_year", type: "integer", nullable: true })
  fromYear?: Year | null;

  @Column({ name: "obligation_kind_id", type: "uuid" })
  obligationKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "obligation_kind_id" })
  obligationKind?: Relation<ValueEntity>;

  @Column({ name: "obligor_institution_id", type: "uuid", nullable: true })
  obligorInstitutionId?: Id | null;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "obligor_institution_id" })
  obligorInstitution?: Relation<InstitutionsEntity>;

  @Column({ name: "obligor_kind_id", type: "uuid", nullable: true })
  obligorKindId?: Id | null;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "obligor_kind_id" })
  obligorKind?: Relation<ValueEntity>;

  @Column({ name: "recipient_entity_id", type: "uuid", nullable: true })
  recipientEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "recipient_entity_id" })
  recipientEntity?: Relation<EntitiesEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "to_year", type: "integer", nullable: true })
  toYear?: Year | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
