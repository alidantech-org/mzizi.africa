import {
  Column,
  Entity,
  PrimaryColumn,
} from "typeorm";

import { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/schema/enum/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Login principal for a person or service; identity is separate from the people and institutions it refers to.
 */
@Entity({ schema: "auth", name: "accounts" })
export class AccountsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "actor_kind", type: "enum", enum: AuthActorKind })
  actorKind!: AuthActorKind;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "disabled_at", type: "timestamptz", nullable: true })
  disabledAt?: Date | null;

  @Column({ name: "display_name", type: "varchar", length: 255 })
  displayName!: NonEmptyString255;

  @Column({ name: "last_authenticated_at", type: "timestamptz", nullable: true })
  lastAuthenticatedAt?: Date | null;

  @Column({ name: "person_ref_id", type: "uuid" })
  personRefId!: Id;

  @Column({ name: "status", type: "enum", enum: AccountStatus })
  status!: AccountStatus;
}