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
import { AccountStatus } from "#/types/identity/account-status.enum.ts";
import type { Issuer } from "#/types/identity/issuer.type.ts";
import type { Subject } from "#/types/identity/subject.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Account
 */
@Entity({ schema: "identity", name: "accounts" })
@Index("idx_account_issuer_subject", ["issuer", "subject"], { unique: true })
@Index("idx_account_person", ["personId"])
export class AccountEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "issuer", type: "varchar", length: 500 })
  issuer!: Issuer;

  @Column({ name: "last_seen_at", type: "timestamptz", nullable: true })
  lastSeenAt?: Date | null;

  @Column({ name: "person_id", type: "uuid", nullable: true })
  personId?: Id | null;

  @Column({ name: "status", type: "enum", enum: AccountStatus })
  status!: AccountStatus;

  @Column({ name: "subject", type: "varchar", length: 255 })
  subject!: Subject;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}