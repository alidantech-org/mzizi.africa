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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * External issuer and subject linked to one account; unlinking is recorded, never deleted.
 */
@Entity({ schema: "auth", name: "login_identities" })
@Index(["accountId"])
@Index(["issuer", "subject"], { unique: true })
export class LoginIdentitiesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "account_id", type: "uuid" })
  accountId!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "account_id" })
  account?: Relation<AccountsEntity>;

  @Column({ name: "issuer", type: "varchar", length: 500 })
  issuer!: NonEmptyString500;

  @Column({
    name: "last_authenticated_at",
    type: "timestamptz",
    nullable: true,
  })
  lastAuthenticatedAt?: Date | null;

  @Column({ name: "linked_at", type: "timestamptz" })
  linkedAt!: Date;

  @Column({ name: "subject", type: "varchar", length: 500 })
  subject!: NonEmptyString500;

  @Column({ name: "unlinked_at", type: "timestamptz", nullable: true })
  unlinkedAt?: Date | null;
}
