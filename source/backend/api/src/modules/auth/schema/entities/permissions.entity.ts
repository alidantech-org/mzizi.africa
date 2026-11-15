import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { AuthAction } from "#/modules/auth/schema/enum/auth-action.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Named action on a resource type, optionally narrowed to a field group.
 */
@Entity({ schema: "auth", name: "permissions" })
@Index(["code"], { unique: true })
export class PermissionsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "action", type: "enum", enum: AuthAction })
  action!: AuthAction;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({
    name: "description",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  description?: Description | null;

  @Column({ name: "field_group", type: "varchar", length: 255, nullable: true })
  fieldGroup?: NonEmptyString255 | null;

  @Column({ name: "is_active", type: "boolean" })
  isActive!: Flag;

  @Column({ name: "resource_type", type: "varchar", length: 255 })
  resourceType!: NonEmptyString255;
}
