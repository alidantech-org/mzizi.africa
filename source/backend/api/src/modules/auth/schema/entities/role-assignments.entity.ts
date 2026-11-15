import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { AccountsEntity } from "#/modules/auth/schema/entities/accounts.entity.ts";
import { DelegationsEntity } from "#/modules/auth/schema/entities/delegations.entity.ts";
import { MembershipsEntity } from "#/modules/auth/schema/entities/memberships.entity.ts";
import { RolesEntity } from "#/modules/auth/schema/entities/roles.entity.ts";
import { ScopesEntity } from "#/modules/auth/schema/entities/scopes.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Scoped role grant to an account, optionally through a membership or delegation, with revocation history.
 */
@Entity({ schema: "auth", name: "role_assignments" })
@Index(["membershipId"])
@Index(["delegationId"])
@Index(["grantedBy"])
@Index(["revokedBy"])
@Index(["accountId"])
@Index(["roleId"])
@Index(["scopeId"])
export class RoleAssignmentsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "account_id", type: "uuid" })
  accountId!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "account_id" })
  account?: Relation<AccountsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "delegation_id", type: "uuid", nullable: true })
  delegationId?: Id | null;

  @ManyToOne(() => DelegationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "delegation_id" })
  delegation?: Relation<DelegationsEntity>;

  @Column({ name: "expires_at", type: "timestamptz", nullable: true })
  expiresAt?: Date | null;

  @Column({ name: "granted_by", type: "uuid" })
  grantedBy!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "granted_by" })
  grantedByRelation?: Relation<AccountsEntity>;

  @Column({ name: "membership_id", type: "uuid", nullable: true })
  membershipId?: Id | null;

  @ManyToOne(() => MembershipsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "membership_id" })
  membership?: Relation<MembershipsEntity>;

  @Column({ name: "revocation_reason", type: "varchar", length: 4000, nullable: true })
  revocationReason?: Description | null;

  @Column({ name: "revoked_at", type: "timestamptz", nullable: true })
  revokedAt?: Date | null;

  @Column({ name: "revoked_by", type: "uuid", nullable: true })
  revokedBy?: Id | null;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "revoked_by" })
  revokedByRelation?: Relation<AccountsEntity>;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => RolesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<RolesEntity>;

  @Column({ name: "scope_id", type: "uuid" })
  scopeId!: Id;

  @ManyToOne(() => ScopesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scope_id" })
  scope?: Relation<ScopesEntity>;

  @Column({ name: "starts_at", type: "timestamptz", nullable: true })
  startsAt?: Date | null;
}