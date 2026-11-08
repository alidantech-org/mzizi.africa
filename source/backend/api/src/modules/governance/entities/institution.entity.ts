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
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { MediaMarker } from "#/types/shared/media-marker.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { WikidataId } from "#/types/shared/wikidata-id.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Institution
 */
@Entity({ schema: "governance", name: "institutions" })
@Index("idx_institution_code", ["code"], { unique: true })
@Index("idx_institution_jurisdiction", ["jurisdictionId"])
@Index("idx_institution_entity", ["entityId"])
@Index("idx_institution_scope", ["scopeGeoUnitId"])
export class InstitutionEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "branch_id", type: "uuid", nullable: true })
  branchId?: Id | null;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "description", type: "varchar", length: 4000, nullable: true })
  description?: Description | null;

  @Column({ name: "entity_id", type: "uuid", nullable: true })
  entityId?: Id | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "jurisdiction_id", type: "uuid" })
  jurisdictionId!: Id;

  @Column({ name: "legal_basis_id", type: "uuid", nullable: true })
  legalBasisId?: Id | null;

  @Column({ name: "logo_marker", type: "enum", enum: MediaMarker, nullable: true })
  logoMarker?: MediaMarker | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "scope_geo_unit_id", type: "uuid", nullable: true })
  scopeGeoUnitId?: Id | null;

  @Column({ name: "type_id", type: "uuid" })
  typeId!: Id;

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