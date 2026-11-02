import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { LifeStatus } from "#/types/governance/life-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import { VerificationState } from "#/types/shared/verification-state.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Person
 */
@Entity({ schema: "governance", name: "people" })
@Index("idx_person_code", ["code"], { unique: true })
export class PersonEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "artifact_checksum", type: "varchar", length: 64, nullable: true })
  artifactChecksum?: Checksum | null;

  @Column({ name: "artifact_id", type: "uuid", nullable: true })
  artifactId?: Id | null;

  @Column({ name: "birth_date", type: "date", nullable: true })
  birthDate?: Date | null;

  @Column({ name: "birth_date_precision", type: "enum", enum: DatePrecision, nullable: true })
  birthDatePrecision?: DatePrecision | null;

  @Column({ name: "birth_place_id", type: "uuid", nullable: true })
  birthPlaceId?: Id | null;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "confidence", type: "double precision", nullable: true })
  confidence?: Confidence | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "death_date", type: "date", nullable: true })
  deathDate?: Date | null;

  @Column({ name: "death_date_precision", type: "enum", enum: DatePrecision, nullable: true })
  deathDatePrecision?: DatePrecision | null;

  @Column({ name: "display_name", type: "varchar", length: 300 })
  displayName!: Name;

  @Column({ name: "family_name", type: "varchar", length: 300, nullable: true })
  familyName?: Name | null;

  @Column({ name: "given_name", type: "varchar", length: 300, nullable: true })
  givenName?: Name | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "licence", type: "varchar", length: 300, nullable: true })
  licence?: Name | null;

  @Column({ name: "life_status", type: "enum", enum: LifeStatus })
  lifeStatus!: LifeStatus;

  @Column({ name: "method", type: "enum", enum: ProvenanceMethod })
  method!: ProvenanceMethod;

  @Column({ name: "retrieved_at", type: "timestamptz", nullable: true })
  retrievedAt?: Date | null;

  @Column({ name: "source_name", type: "varchar", length: 300 })
  sourceName!: Name;

  @Column({ name: "source_reference", type: "varchar", length: 4000, nullable: true })
  sourceReference?: Description | null;

  @Column({ name: "source_url", type: "varchar", length: 1000, nullable: true })
  sourceUrl?: Url | null;

  @Column({ name: "tool_or_model", type: "varchar", length: 300, nullable: true })
  toolOrModel?: Name | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "verification_state", type: "enum", enum: VerificationState })
  verificationState!: VerificationState;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}