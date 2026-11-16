import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { PublishersEntity } from "#/modules/source/schema/entities/publishers.entity.ts";
import { SourceKind } from "#/modules/source/schema/enum/source-kind.enum.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A publication channel, named by anything but its domain: a real website, a real API, or a dataset (files or data obtained from somewhere that is neither). Only websites and APIs have domains and paths; the dataset tables record what we prepared from sources.
 */
@Entity({ schema: "source", name: "sources" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["publisherId"])
@Index(["kind"])
export class SourcesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({
    name: "credential_binding",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  credentialBinding?: NonEmptyString255 | null;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({
    name: "description",
    type: "varchar",
    length: 4000,
    nullable: true,
  })
  description?: Description | null;

  @Column({ name: "kind", type: "enum", enum: SourceKind })
  kind!: SourceKind;

  @Column({ name: "official_entity_id", type: "uuid", nullable: true })
  officialEntityId?: Id | null;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "official_entity_id" })
  officialEntity?: Relation<EntitiesEntity>;

  @Column({ name: "publisher_id", type: "uuid" })
  publisherId!: Id;

  @ManyToOne(() => PublishersEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "publisher_id" })
  publisher?: Relation<PublishersEntity>;

  @Column({ name: "title", type: "varchar", length: 300 })
  title!: Name;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
