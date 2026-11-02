import { Check, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { DomainZoneEntity } from "#/modules/website/entities/domain-zone.entity.ts";
import { SiteDomainEntity } from "#/modules/website/entities/site-domain.entity.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * DNS Snapshot
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

  @ManyToOne(() => SiteDomainEntity)
  @JoinColumn({ name: "domain_id" })
  domain?: Relation<SiteDomainEntity>;

  @Column({ name: "observed_at", type: "timestamptz" })
  observedAt!: Date;

  @Column({ name: "rcode", type: "text", nullable: true })
  rcode?: string | null;

  @Column({ name: "record_type", type: "text" })
  recordType!: string;

  @Column({ name: "resolver", type: "text", nullable: true })
  resolver?: string | null;

  @Column({ name: "values", type: "text" })
  values!: string;

  @Column({ name: "zone_id", type: "uuid", nullable: true })
  zoneId?: Id | null;

  @ManyToOne(() => DomainZoneEntity)
  @JoinColumn({ name: "zone_id" })
  zone?: Relation<DomainZoneEntity>;
}
