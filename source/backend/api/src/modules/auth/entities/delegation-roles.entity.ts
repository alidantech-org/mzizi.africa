import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { DelegationsEntity } from "#/modules/auth/entities/delegations.entity.ts";
import { RolesEntity } from "#/modules/auth/entities/roles.entity.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";

/**
 * Role included in a delegation.
 */
@Entity({ schema: "auth", name: "delegation_roles" })
@Index(["roleId"])
export class DelegationRolesEntity {

  @PrimaryColumn({ name: "delegation_id", type: "uuid" })
  delegationId!: Id;

  @ManyToOne(() => DelegationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "delegation_id" })
  delegation?: Relation<DelegationsEntity>;

  @PrimaryColumn({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => RolesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<RolesEntity>;
}