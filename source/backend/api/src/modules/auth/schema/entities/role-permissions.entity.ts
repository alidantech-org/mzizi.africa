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
import { PermissionsEntity } from "#/modules/auth/schema/entities/permissions.entity.ts";
import { RolesEntity } from "#/modules/auth/schema/entities/roles.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Permission granted to a role, with who granted it and when.
 */
@Entity({ schema: "auth", name: "role_permissions" })
@Index(["permissionId"])
@Index(["grantedBy"])
export class RolePermissionsEntity {

  @PrimaryColumn({ name: "permission_id", type: "uuid" })
  permissionId!: Id;

  @ManyToOne(() => PermissionsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "permission_id" })
  permission?: Relation<PermissionsEntity>;

  @PrimaryColumn({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => RolesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<RolesEntity>;

  @Column({ name: "granted_at", type: "timestamptz" })
  grantedAt!: Date;

  @Column({ name: "granted_by", type: "uuid" })
  grantedBy!: Id;

  @ManyToOne(() => AccountsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "granted_by" })
  grantedByRelation?: Relation<AccountsEntity>;
}