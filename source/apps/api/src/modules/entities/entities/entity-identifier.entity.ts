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
import { LegalEntityEntity } from "#/modules/entities/entities/legal-entity.entity.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { IdentifierValue } from "#/types/entities/identifier-value.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Entity Identifier
 */
@Entity({ schema: "organization", name: "identifiers" })
@Index("idx_entity_identifier_entity", ["entityId"])
@Index("idx_entity_identifier_value", ["schemeId", "value"])
export class EntityIdentifierEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "entity_id", type: "uuid" })
  entityId!: Id;

  @ManyToOne(() => LegalEntityEntity)
  @JoinColumn({ name: "entity_id" })
  entity?: Relation<LegalEntityEntity>;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "issuing_authority_id", type: "uuid", nullable: true })
  issuingAuthorityId?: Id | null;

  @Column({ name: "scheme_id", type: "uuid" })
  schemeId!: Id;

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

  @Column({ name: "value", type: "varchar", length: 200 })
  value!: IdentifierValue;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}