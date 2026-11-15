import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { AccountsEntity } from "#/modules/auth/entities/accounts.entity.ts";
import { MembershipStatus } from "#/modules/auth/enum/membership-status.enum.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";

/**
 * Account membership of an institution, verified and revocable with attribution.
 */
@Entity({ schema: "auth", name: "memberships" })
@Index(["verifiedBy"])
@Index(["revokedBy"])
@Index(["accountId"])
export class MembershipsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "account_id", type: "uuid" })
  accountId!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "account_id" })
  account?: Relation<AccountsEntity>;

  @Column({ name: "ends_at", type: "timestamptz", nullable: true })
  endsAt?: Date | null;

  @Column({ name: "institution_ref_id", type: "uuid" })
  institutionRefId!: Id;

  @Column({ name: "revoked_at", type: "timestamptz", nullable: true })
  revokedAt?: Date | null;

  @Column({ name: "revoked_by", type: "uuid", nullable: true })
  revokedBy?: Id | null;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "revoked_by" })
  revokedByRelation?: Relation<AccountsEntity>;

  @Column({ name: "starts_at", type: "timestamptz", nullable: true })
  startsAt?: Date | null;

  @Column({ name: "status", type: "enum", enum: MembershipStatus })
  status!: MembershipStatus;

  @Column({ name: "verified_at", type: "timestamptz", nullable: true })
  verifiedAt?: Date | null;

  @Column({ name: "verified_by", type: "uuid", nullable: true })
  verifiedBy?: Id | null;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "verified_by" })
  verifiedByRelation?: Relation<AccountsEntity>;
}