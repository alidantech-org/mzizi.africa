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
import { ScopesEntity } from "#/modules/auth/entities/scopes.entity.ts";
import type { Id } from "#/modules/shared/id.type.ts";

/**
 * Time-limited delegation of scoped access from one account to another.
 */
@Entity({ schema: "auth", name: "delegations" })
@Index(["delegatorAccountId"])
@Index(["delegateAccountId"])
@Index(["revokedBy"])
@Index(["scopeId"])
export class DelegationsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "delegate_account_id", type: "uuid" })
  delegateAccountId!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "delegate_account_id" })
  delegateAccount?: Relation<AccountsEntity>;

  @Column({ name: "delegator_account_id", type: "uuid" })
  delegatorAccountId!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "delegator_account_id" })
  delegatorAccount?: Relation<AccountsEntity>;

  @Column({ name: "expires_at", type: "timestamptz", nullable: true })
  expiresAt?: Date | null;

  @Column({ name: "revoked_at", type: "timestamptz", nullable: true })
  revokedAt?: Date | null;

  @Column({ name: "revoked_by", type: "uuid", nullable: true })
  revokedBy?: Id | null;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "revoked_by" })
  revokedByRelation?: Relation<AccountsEntity>;

  @Column({ name: "scope_id", type: "uuid" })
  scopeId!: Id;

  @ManyToOne(() => ScopesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "scope_id" })
  scope?: Relation<ScopesEntity>;

  @Column({ name: "starts_at", type: "timestamptz", nullable: true })
  startsAt?: Date | null;
}