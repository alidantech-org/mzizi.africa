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
import { SiteEntity } from "#/modules/website/entities/site.entity.ts";
import { SitePublisherRole } from "#/types/website/site-publisher-role.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Site Publisher
 */
@Entity({ schema: "website", name: "site_publishers" })
@Index("idx_sitepublisher_site", ["siteId"])
@Index("idx_sitepublisher_publisher", ["publisherId"])
export class SitePublisherEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "publisher_id", type: "uuid" })
  publisherId!: Id;

  @Column({ name: "role", type: "enum", enum: SitePublisherRole })
  role!: SitePublisherRole;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: Id;

  @ManyToOne(() => SiteEntity)
  @JoinColumn({ name: "site_id" })
  site?: Relation<SiteEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}