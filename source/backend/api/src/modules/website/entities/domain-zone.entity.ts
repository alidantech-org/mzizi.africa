import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Hostname } from "#/types/website/hostname.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

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
  operator?: string | null;

  @Column({ name: "parent_suffix", type: "varchar", length: 253, nullable: true })
  parentSuffix?: Hostname | null;

  @Column({ name: "purpose", type: "text", nullable: true })
  purpose?: string | null;

  @Column({ name: "second_level_open", type: "boolean", nullable: true })
  secondLevelOpen?: boolean | null;

  @Column({ name: "suffix", type: "varchar", length: 253, unique: true })
  suffix!: Hostname;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}
