import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { AddressesEntity } from "#/modules/source/schema/entities/addresses.entity.ts";
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { DiscoveriesEntity } from "#/modules/source/schema/entities/discoveries.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/**
 * One retrieval of an address: when, from which link, with what response. Repeated captures never overwrite each other.
 */
@Entity({ schema: "source", name: "captures" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["sourceId"])
@Index(["addressId"])
@Index(["discoveryId"])
@Index(["artifactId"])
export class CapturesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "address_id", type: "uuid", nullable: true })
  addressId?: Id | null;

  @ManyToOne(() => AddressesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "address_id" })
  address?: Relation<AddressesEntity>;

  @Column({ name: "artifact_id", type: "uuid", nullable: true })
  artifactId?: Id | null;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "artifact_id" })
  artifact?: Relation<ArtifactsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "discovery_id", type: "uuid", nullable: true })
  discoveryId?: Id | null;

  @ManyToOne(() => DiscoveriesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "discovery_id" })
  discovery?: Relation<DiscoveriesEntity>;

  @Column({ name: "original_url", type: "varchar", length: 2048 })
  originalUrl!: Url;

  @Column({ name: "response_metadata", type: "text" })
  responseMetadata!: JsonText;

  @Column({ name: "retrieved_at", type: "timestamptz" })
  retrievedAt!: Date;

  @Column({
    name: "retrieved_url",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  retrievedUrl?: Url | null;

  @Column({ name: "source_id", type: "uuid" })
  sourceId!: Id;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
