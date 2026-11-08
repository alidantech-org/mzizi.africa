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
import { FamilyKind } from "#/types/website/family-kind.enum.ts";
import { FamilyStatus } from "#/types/website/family-status.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Family
 */
@Entity({ schema: "website", name: "families" })
@Index("idx_family_code", ["code"], { unique: true })
export class SiteFamilyEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "description", type: "varchar", length: 4000, nullable: true })
  description?: Description | null;

  @Column({ name: "jurisdiction_id", type: "uuid", nullable: true })
  jurisdictionId?: Id | null;

  @Column({ name: "kind", type: "enum", enum: FamilyKind })
  kind!: FamilyKind;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "status", type: "enum", enum: FamilyStatus })
  status!: FamilyStatus;

  @Column({ name: "subject_kind_id", type: "uuid", nullable: true })
  subjectKindId?: Id | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}