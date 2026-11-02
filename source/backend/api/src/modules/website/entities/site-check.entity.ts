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
import { CheckKind } from "#/types/website/check-kind.enum.ts";
import { CheckOutcome } from "#/types/website/check-outcome.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Site Check
 */
@Entity({ schema: "website", name: "checks" })
@Index("idx_check_site", ["siteId", "checkedAt"])
export class SiteCheckEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "checked_at", type: "timestamptz" })
  checkedAt!: Date;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "detail", type: "text", nullable: true })
  detail?: LongText | null;

  @Column({ name: "kind", type: "enum", enum: CheckKind })
  kind!: CheckKind;

  @Column({ name: "outcome", type: "enum", enum: CheckOutcome })
  outcome!: CheckOutcome;

  @Column({ name: "site_id", type: "uuid" })
  siteId!: Id;

  @ManyToOne(() => SiteEntity)
  @JoinColumn({ name: "site_id" })
  site?: Relation<SiteEntity>;

  @Column({ name: "structure_version_id", type: "uuid", nullable: true })
  structureVersionId?: Id | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}