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
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Domain Zone
 */
@Entity({ schema: "website", name: "domain_zones" })
export class DomainZoneEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "operator", type: "text", nullable: true })
  operator?: LongText | null;

  @Column({ name: "parent_suffix", type: "varchar", length: 253, nullable: true })
  parentSuffix?: Hostname | null;

  @Column({ name: "purpose", type: "text", nullable: true })
  purpose?: LongText | null;

  @Column({ name: "second_level_open", type: "boolean", nullable: true })
  secondLevelOpen?: Flag | null;

  @Column({ name: "suffix", type: "varchar", length: 253 })
  suffix!: Hostname;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}