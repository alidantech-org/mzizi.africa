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
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { JsonText } from "#/types/website/json-text.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Dns Snapshot
 */
@Entity({ schema: "website", name: "dns_snapshots" })
@Index("idx_dns_snapshot_domain", ["domainId", "recordType", "observedAt"])
@Index("idx_dns_snapshot_zone", ["zoneId", "recordType", "observedAt"])
export class DnsSnapshotEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "domain_id", type: "uuid", nullable: true })
  domainId?: Id | null;

  @Column({ name: "observed_at", type: "timestamptz" })
  observedAt!: Date;

  @Column({ name: "rcode", type: "text", nullable: true })
  rcode?: LongText | null;

  @Column({ name: "record_type", type: "text" })
  recordType!: LongText;

  @Column({ name: "resolver", type: "text", nullable: true })
  resolver?: LongText | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "values", type: "text" })
  values!: JsonText;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "zone_id", type: "uuid", nullable: true })
  zoneId?: Id | null;
}