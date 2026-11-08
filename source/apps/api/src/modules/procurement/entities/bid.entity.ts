import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";

import { ColumnNumericTransformer } from "#/modules/common/entities/base/column-numeric.transformer.ts";
import { TenderEntity } from "#/modules/procurement/entities/tender.entity.ts";
import { BidStatus } from "#/types/procurement/bid-status.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Amount } from "#/types/shared/amount.type.ts";
import type { CurrencyCode } from "#/types/shared/currency-code.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Bid
 */
@Entity({ schema: "procurement", name: "bids" })
@Index("idx_bid_tender", ["tenderId"])
export class BidEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "amount", type: "numeric", precision: 20, scale: 4, transformer: new ColumnNumericTransformer() })
  amount!: Amount;

  @Column({ name: "bidder_entity_id", type: "uuid" })
  bidderEntityId!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "currency_code", type: "varchar", length: 3 })
  currencyCode!: CurrencyCode;

  @Column({ name: "evaluation_note", type: "varchar", length: 4000, nullable: true })
  evaluationNote?: Description | null;

  @Column({ name: "is_compliant", type: "boolean", nullable: true })
  isCompliant?: Flag | null;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "status", type: "enum", enum: BidStatus })
  status!: BidStatus;

  @Column({ name: "submitted_on", type: "date" })
  submittedOn!: Date;

  @Column({ name: "tender_id", type: "uuid" })
  tenderId!: Id;

  @ManyToOne(() => TenderEntity)
  @JoinColumn({ name: "tender_id" })
  tender?: Relation<TenderEntity>;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "valid_from", type: "date", nullable: true })
  validFrom?: Date | null;

  @Column({ name: "valid_from_precision", type: "enum", enum: DatePrecision, nullable: true })
  validFromPrecision?: DatePrecision | null;

  @Column({ name: "valid_to", type: "date", nullable: true })
  validTo?: Date | null;

  @Column({ name: "valid_to_precision", type: "enum", enum: DatePrecision, nullable: true })
  validToPrecision?: DatePrecision | null;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}