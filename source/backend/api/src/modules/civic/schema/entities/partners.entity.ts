import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { BidsEntity } from "#/modules/civic/schema/entities/bids.entity.ts";
import { ContractsEntity } from "#/modules/civic/schema/entities/contracts.entity.ts";
import { EntitiesEntity } from "#/modules/official/schema/entities/entities.entity.ts";
import { ValueEntity } from "#/modules/reference/schema/entities/value.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * A party that shares one contract or one bid with the main bidder or contractor: a joint-venture member, a subcontractor or a guarantor.
 */
@Entity({ schema: "civic", name: "partners" })
@Index(["contractId"])
@Index(["bidId"])
@Index(["partnerEntityId"])
@Index(["roleId"])
@Index(["sourceCitationId"])
// Invariant "HasExactlyOneDeal" has no simple form, so it isn't enforced as a database check.
export class PartnersEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "bid_id", type: "uuid", nullable: true })
  bidId?: Id | null;

  @ManyToOne(() => BidsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "bid_id" })
  bid?: Relation<BidsEntity>;

  @Column({ name: "contract_id", type: "uuid", nullable: true })
  contractId?: Id | null;

  @ManyToOne(() => ContractsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "contract_id" })
  contract?: Relation<ContractsEntity>;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "partner_entity_id", type: "uuid" })
  partnerEntityId!: Id;

  @ManyToOne(() => EntitiesEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "partner_entity_id" })
  partnerEntity?: Relation<EntitiesEntity>;

  @Column({ name: "role_id", type: "uuid" })
  roleId!: Id;

  @ManyToOne(() => ValueEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "role_id" })
  role?: Relation<ValueEntity>;

  @Column({
    name: "share_percentage",
    type: "double precision",
    nullable: true,
  })
  sharePercentage?: Percentage | null;

  @Column({ name: "source_citation_id", type: "uuid", nullable: true })
  sourceCitationId?: Id | null;

  @ManyToOne(() => CitationsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "source_citation_id" })
  sourceCitation?: Relation<CitationsEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}
