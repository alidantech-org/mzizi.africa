import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { DomainsEntity } from "#/modules/source/schema/entities/domains.entity.ts";
import { AddressKind } from "#/modules/source/schema/enum/address-kind.enum.ts";
import { HttpMethod } from "#/modules/source/schema/enum/http-method.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NullableString1000 } from "#/modules/shared/schema/type/nullable-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A page, listing, file or API endpoint on a domain, distinguished by method, path and query.
 */
@Entity({ schema: "source", name: "addresses" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["domainId", "method", "path", "query"], { unique: true })
@Index(["domainId"])
export class AddressesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "domain_id", type: "uuid" })
  domainId!: Id;

  @ManyToOne(() => DomainsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "domain_id" })
  domain?: Relation<DomainsEntity>;

  @Column({ name: "kind", type: "enum", enum: AddressKind })
  kind!: AddressKind;

  @Column({ name: "method", type: "enum", enum: HttpMethod })
  method!: HttpMethod;

  @Column({ name: "note", type: "varchar", length: 4000, nullable: true })
  note?: Description | null;

  @Column({ name: "path", type: "varchar", length: 1000 })
  path!: NonEmptyString1000;

  @Column({ name: "query", type: "varchar", length: 1000 })
  query!: NullableString1000;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
