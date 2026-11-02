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
import { LifeStatus } from "#/types/person/life-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { WikidataId } from "#/types/shared/wikidata-id.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Person
 */
@Entity({ schema: "person", name: "individuals" })
@Index("idx_individual_code", ["code"], { unique: true })
export class PersonEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "birth_date", type: "date", nullable: true })
  birthDate?: Date | null;

  @Column({ name: "birth_date_precision", type: "enum", enum: DatePrecision, nullable: true })
  birthDatePrecision?: DatePrecision | null;

  @Column({ name: "birth_place_id", type: "uuid", nullable: true })
  birthPlaceId?: Id | null;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

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

  @Column({ name: "life_status", type: "enum", enum: LifeStatus })
  lifeStatus!: LifeStatus;

  @Column({ name: "portrait_marker", type: "enum", enum: MediaMarker, nullable: true })
  portraitMarker?: MediaMarker | null;

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

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "wikidata_id", type: "varchar", length: 20, nullable: true })
  wikidataId?: WikidataId | null;
}