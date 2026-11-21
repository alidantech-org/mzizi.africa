import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { SourceAddressesEntity } from "#/modules/source/schema/entities/addresses.entity.ts";
import { SourcesEntity } from "#/modules/source/schema/entities/sources.entity.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NullableString1000 } from "#/modules/shared/schema/type/nullable-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";

/**
 * An observation that an address exists: where it was found, as what text and when. Retrieval is a separate capture.
 */
@Entity({ schema: "source", name: "discoveries" })
@Index(["addressId"])
@Index(["foundOnAddressId"])
@Index(["sourceId"])
@Index(["discoveredAt"])
export class DiscoveriesEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "address_id", type: "uuid", nullable: true })
  addressId?: Id | null;

  @ManyToOne(() => SourceAddressesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "address_id" })
  address?: Relation<SourceAddressesEntity>;

  @Column({
    name: "anchor_text",
    type: "varchar",
    length: 1000,
    nullable: true,
  })
  anchorText?: NullableString1000 | null;

  @Column({ name: "context", type: "varchar", length: 4000, nullable: true })
  context?: Description | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "discovered_at", type: "timestamptz" })
  discoveredAt!: Date;

  @Column({ name: "found_on_address_id", type: "uuid", nullable: true })
  foundOnAddressId?: Id | null;

  @ManyToOne(() => SourceAddressesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "found_on_address_id" })
  foundOnAddress?: Relation<SourceAddressesEntity>;

  @Column({ name: "observed_url", type: "varchar", length: 2048 })
  observedUrl!: Url;

  @Column({ name: "source_id", type: "uuid", nullable: true })
  sourceId?: Id | null;

  @ManyToOne(() => SourcesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_id" })
  source?: Relation<SourcesEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
