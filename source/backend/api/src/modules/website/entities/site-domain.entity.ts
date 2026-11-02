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
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import { DomainRole } from "#/types/website/domain-role.enum.ts";
import { UrlScheme } from "#/types/website/url-scheme.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Site Domain
 */
@Entity({ schema: "website", name: "domains" })
@Index("idx_domain_site_host", ["siteId", "hostname", "validFrom"], { unique: true })
@Index("idx_domain_hostname", ["hostname"])
export class SiteDomainEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "hostname", type: "varchar", length: 253 })
  hostname!: Hostname;

  @Column({ name: "observed_at", type: "timestamptz", nullable: true })
  observedAt?: Date | null;

  @Column({ name: "role", type: "enum", enum: DomainRole })
  role!: DomainRole;

  @Column({ name: "scheme", type: "enum", enum: UrlScheme })
  scheme!: UrlScheme;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: Id;

  @ManyToOne(() => SiteEntity)
  @JoinColumn({ name: "site_id" })
  site?: Relation<SiteEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date" })
  validFrom!: Date;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision })
  validFromPrecision!: DatePrecision;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}