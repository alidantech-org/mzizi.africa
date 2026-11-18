import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { HoldersEntity } from "#/modules/governance/schema/entities/holders.entity.ts";
import { InstitutionsEntity } from "#/modules/governance/schema/entities/institutions.entity.ts";
import { TermsEntity } from "#/modules/governance/schema/entities/terms.entity.ts";
import { InstrumentsEntity } from "#/modules/legal/schema/entities/instruments.entity.ts";
import { CountryEntity } from "#/modules/reference/schema/entities/country.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A proposed law from introduction to enactment. Stages record each reading, committee, assent and publication; the enacted law is a legal instrument.
 */
@Entity({ schema: "governance", name: "bills" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["countryId"])
@Index(["institutionId"])
@Index(["billKindId"])
@Index(["statusId"])
@Index(["sponsorHolderId"])
@Index(["termId"])
@Index(["instrumentId"])
@Index(["sourceCitationId"])
export class BillsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "bill_kind_id", type: "uuid" })
  billKindId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bill_kind_id" })
  billKind?: Relation<ValueEntity>;

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

  @Column({ name: "institution_id", type: "uuid" })
  institutionId!: Id;

  @ManyToOne(() => InstitutionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "institution_id" })
  institution?: Relation<InstitutionsEntity>;

  @Column({ name: "instrument_id", type: "uuid", nullable: true })
  instrumentId?: Id | null;

  @ManyToOne(() => InstrumentsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "instrument_id" })
  instrument?: Relation<InstrumentsEntity>;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "sponsor_holder_id", type: "uuid", nullable: true })
  sponsorHolderId?: Id | null;

  @ManyToOne(() => HoldersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "sponsor_holder_id" })
  sponsorHolder?: Relation<HoldersEntity>;

  @Column({ name: "status_id", type: "uuid" })
  statusId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "status_id" })
  status?: Relation<ValueEntity>;

  @Column({ name: "summary", type: "varchar", length: 4000, nullable: true })
  summary?: Description | null;

  @Column({ name: "term_id", type: "uuid", nullable: true })
  termId?: Id | null;

  @ManyToOne(() => TermsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "term_id" })
  term?: Relation<TermsEntity>;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
