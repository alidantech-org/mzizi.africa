import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";

import { ContactChannel } from "#/types/contact/contact-channel.enum.ts";
import { ContactVisibility } from "#/types/contact/contact-visibility.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { ContactValue } from "#/types/contact/contact-value.type.ts";
import type { Date } from "#/types/shared/date.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { TargetKind } from "#/types/shared/target-kind.type.ts";
import type { Version } from "#/types/shared/version.type.ts";

/**
 * Contact Point
 */
@Entity({ schema: "contact", name: "points" })
@Index("idx_contact_point_scope", ["scopeKind", "scopeId", "channel"])
export class ContactPointEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "channel", type: "enum", enum: ContactChannel })
  channel!: ContactChannel;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "label", type: "varchar", length: 300, nullable: true })
  label?: Label | null;

  @Column({ name: "scope_id", type: "uuid" })
  scopeId!: Id;

  @Column({ name: "scope_kind", type: "varchar", length: 100 })
  scopeKind!: TargetKind;

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

  @Column({ name: "value", type: "varchar", length: 500 })
  value!: ContactValue;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "visibility", type: "enum", enum: ContactVisibility })
  visibility!: ContactVisibility;
}
