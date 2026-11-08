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
import { PersonEntity } from "#/modules/person/entities/person.entity.ts";
import { ContactKind } from "#/types/person/contact-kind.enum.ts";
import { Exposure } from "#/types/person/exposure.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ContactValue } from "#/types/person/contact-value.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Person Contact
 */
@Entity({ schema: "person", name: "contacts" })
@Index("idx_person_contact_person", ["personId", "exposure"])
export class PersonContactEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "exposure", type: "enum", enum: Exposure })
  exposure!: Exposure;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "kind", type: "enum", enum: ContactKind })
  kind!: ContactKind;

  @Column({ name: "label", type: "varchar", length: 300, nullable: true })
  label?: Label | null;

  @Column({ name: "office_id", type: "uuid", nullable: true })
  officeId?: Id | null;

  @Column({ name: "person_id", type: "uuid" })
  personId!: Id;

  @ManyToOne(() => PersonEntity)
  @JoinColumn({ name: "person_id" })
  person?: Relation<PersonEntity>;

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
}