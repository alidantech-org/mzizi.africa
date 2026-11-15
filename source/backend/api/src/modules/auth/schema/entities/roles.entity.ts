import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Named permission bundle with a policy version; protected roles cannot be edited away.
 */
@Entity({ schema: "auth", name: "roles" })
@Index(["code"], { unique: true })
export class RolesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({
    name: "description",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  description?: Description | null;

  @Column({ name: "managing_institution_ref_id", type: "uuid", nullable: true })
  managingInstitutionRefId?: Id | null;

  @Column({ name: "policy_version", type: "varchar", length: 255 })
  policyVersion!: NonEmptyString255;

  @Column({ name: "protected", type: "boolean" })
  protected!: Flag;

  @Column({ name: "retired_at", type: "timestamptz", nullable: true })
  retiredAt?: Date | null;

  @Column({ name: "title", type: "varchar", length: 255 })
  title!: NonEmptyString255;
}
