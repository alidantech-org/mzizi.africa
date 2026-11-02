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
import { PartyStatus } from "#/types/political/party-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { Abbreviation } from "#/types/political/abbreviation.type.ts";
import type { RegistryIdentifier } from "#/types/political/registry-identifier.type.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { WikidataId } from "#/types/shared/wikidata-id.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Party
 */
@Entity({ schema: "political", name: "parties" })
@Index("idx_party_code", ["code"], { unique: true })
@Index("idx_party_jurisdiction", ["jurisdictionId"])
export class PartyEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "abbreviation", type: "varchar", length: 40, nullable: true })
  abbreviation?: Abbreviation | null;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "jurisdiction_id", type: "uuid" })
  jurisdictionId!: Id;

  @Column({ name: "logo_marker", type: "enum", enum: MediaMarker, nullable: true })
  logoMarker?: MediaMarker | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "registry_authority_id", type: "uuid", nullable: true })
  registryAuthorityId?: Id | null;

  @Column({ name: "registry_identifier", type: "varchar", length: 120, nullable: true })
  registryIdentifier?: RegistryIdentifier | null;

  @Column({ name: "status", type: "enum", enum: PartyStatus })
  status!: PartyStatus;

  @Column({ name: "symbol_url", type: "varchar", length: 1000, nullable: true })
  symbolUrl?: Url | null;

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