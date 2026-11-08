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
import { MembershipBasis } from "#/types/website/membership-basis.enum.ts";
import { MembershipRole } from "#/types/website/membership-role.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Site Member
 */
@Entity({ schema: "website", name: "members" })
@Index("idx_member_site", ["siteId"])
@Index("idx_member_family", ["familyId"])
export class SiteMemberEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "basis", type: "enum", enum: MembershipBasis })
  basis!: MembershipBasis;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "family_id", type: "uuid" })
  familyId!: Id;

  @Column({ name: "method_id", type: "uuid", nullable: true })
  methodId?: Id | null;

  @Column({ name: "role", type: "enum", enum: MembershipRole })
  role!: MembershipRole;

  @Column({ name: "score", type: "double precision", nullable: true })
  score?: Confidence | null;

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