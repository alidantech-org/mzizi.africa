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
import { FingerprintKind } from "#/types/website/fingerprint-kind.enum.ts";
import type { Checksum } from "#/types/shared/checksum.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Fingerprint
 */
@Entity({ schema: "website", name: "fingerprints" })
@Index("idx_fingerprint_site", ["siteId", "kind", "computedAt"])
export class SiteFingerprintEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "check_id", type: "uuid", nullable: true })
  checkId?: Id | null;

  @Column({ name: "computed_at", type: "timestamptz" })
  computedAt!: Date;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "digest", type: "varchar", length: 64 })
  digest!: Checksum;

  @Column({ name: "features", type: "text" })
  features!: LongText;

  @Column({ name: "kind", type: "enum", enum: FingerprintKind })
  kind!: FingerprintKind;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: Id;

  @ManyToOne(() => SiteEntity)
  @JoinColumn({ name: "site_id" })
  site?: Relation<SiteEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}