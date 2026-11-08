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
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Occupation } from "#/types/person/occupation.type.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Person Profile
 */
@Entity({ schema: "person", name: "profiles" })
@Index("idx_person_profile_person", ["personId"])
export class PersonProfileEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "biography", type: "text", nullable: true })
  biography?: LongText | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "language", type: "varchar", length: 300, nullable: true })
  language?: Label | null;

  @Column({ name: "nationality_id", type: "uuid", nullable: true })
  nationalityId?: Id | null;

  @Column({ name: "occupation", type: "varchar", length: 300, nullable: true })
  occupation?: Occupation | null;

  @Column({ name: "person_id", type: "uuid" })
  personId!: Id;

  @ManyToOne(() => PersonEntity)
  @JoinColumn({ name: "person_id" })
  person?: Relation<PersonEntity>;

  @Column({ name: "summary", type: "varchar", length: 4000, nullable: true })
  summary?: Description | null;

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