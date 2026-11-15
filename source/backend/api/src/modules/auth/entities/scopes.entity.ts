import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";

/**
 * Deduplicated access scope: global, or narrowed by country, geographic unit, dataset or field group.
 */
@Entity({ schema: "auth", name: "scopes" })
@Index(["scopeHash"], { unique: true })
export class ScopesEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "country_ref_id", type: "uuid", nullable: true })
  countryRefId?: Id | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "dataset_ref_id", type: "uuid", nullable: true })
  datasetRefId?: Id | null;

  @Column({ name: "field_group", type: "varchar", length: 255, nullable: true })
  fieldGroup?: NonEmptyString255 | null;

  @Column({ name: "geographic_unit_ref_id", type: "uuid", nullable: true })
  geographicUnitRefId?: Id | null;

  @Column({ name: "include_descendants", type: "boolean" })
  includeDescendants!: Flag;

  @Column({ name: "institution_ref_id", type: "uuid" })
  institutionRefId!: Id;

  @Column({ name: "is_global", type: "boolean" })
  isGlobal!: Flag;

  @Column({ name: "scope_hash", type: "char", length: 64 })
  scopeHash!: Sha256;
}