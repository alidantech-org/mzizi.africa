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
import { StorageTier } from "#/types/filesystem/storage-tier.enum.ts";
import { StoreKind } from "#/types/filesystem/store-kind.enum.ts";
import type { BusinessCode } from "#/types/shared/business-code.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Store
 */
@Entity({ schema: "filesystem", name: "stores" })
@Index("idx_store_code", ["code"], { unique: true })
export class StoreEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 200 })
  code!: BusinessCode;

  @Column({ name: "configuration_name", type: "varchar", length: 300 })
  configurationName!: Label;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_active", type: "boolean" })
  isActive!: Flag;

  @Column({ name: "kind", type: "enum", enum: StoreKind })
  kind!: StoreKind;

  @Column({ name: "region", type: "varchar", length: 300, nullable: true })
  region?: Label | null;

  @Column({ name: "tier", type: "enum", enum: StorageTier })
  tier!: StorageTier;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}