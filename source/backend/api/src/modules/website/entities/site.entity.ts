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
import { SiteKind } from "#/types/website/site-kind.enum.ts";
import { SiteStatus } from "#/types/website/site-status.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site
 */
@Entity({ schema: "website", name: "sites" })
@Index("idx_site_code", ["code"], { unique: true })
@Index("idx_site_status", ["status"])
export class SiteEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "description", type: "varchar", length: 4000, nullable: true })
  description?: Description | null;

  @Column({ name: "first_seen_at", type: "timestamptz", nullable: true })
  firstSeenAt?: Date | null;

  @Column({ name: "jurisdiction_id", type: "uuid", nullable: true })
  jurisdictionId?: Id | null;

  @Column({ name: "kind", type: "enum", enum: SiteKind })
  kind!: SiteKind;

  @Column({ name: "last_seen_at", type: "timestamptz", nullable: true })
  lastSeenAt?: Date | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "status", type: "enum", enum: SiteStatus })
  status!: SiteStatus;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}