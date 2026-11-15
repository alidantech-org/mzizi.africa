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
import type { Email } from "#/modules/shared/schema/type/email.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";

/**
 * Single-use invitation to an institution; only a digest of the token is stored.
 */
@Entity({ schema: "auth", name: "invitations" })
@Index(["invitedBy"])
@Index(["acceptedAccountId"])
@Index(["tokenDigest"], { unique: true })
export class InvitationsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "accepted_account_id", type: "uuid", nullable: true })
  acceptedAccountId?: Id | null;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "accepted_account_id" })
  acceptedAccount?: Relation<AccountsEntity>;

  @Column({ name: "accepted_at", type: "timestamptz", nullable: true })
  acceptedAt?: Date | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "expires_at", type: "timestamptz", nullable: true })
  expiresAt?: Date | null;

  @Column({ name: "institution_ref_id", type: "uuid" })
  institutionRefId!: Id;

  @Column({ name: "intended_email", type: "text" })
  intendedEmail!: Email;

  @Column({ name: "invited_by", type: "uuid" })
  invitedBy!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "invited_by" })
  invitedByRelation?: Relation<AccountsEntity>;

  @Column({ name: "revoked_at", type: "timestamptz", nullable: true })
  revokedAt?: Date | null;

  @Column({ name: "token_digest", type: "char", length: 64 })
  tokenDigest!: Sha256;
}
