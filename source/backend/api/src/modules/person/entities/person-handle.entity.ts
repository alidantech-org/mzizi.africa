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
import { Exposure } from "#/types/person/exposure.enum.ts";
import { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { HandleName } from "#/types/person/handle-name.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Url } from "#/types/shared/url.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/**
 * Person Handle
 */
@Entity({ schema: "person", name: "handles" })
@Index("idx_person_handle_person", ["personId", "exposure"])
export class PersonHandleEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "exposure", type: "enum", enum: Exposure })
  exposure!: Exposure;

  @Column({ name: "handle", type: "varchar", length: 200 })
  handle!: HandleName;

  @Column({ name: "is_current", type: "boolean" })
  isCurrent!: Flag;

  @Column({ name: "is_verified", type: "boolean" })
  isVerified!: Flag;

  @Column({ name: "person_id", type: "uuid" })
  personId!: Id;

  @ManyToOne(() => PersonEntity)
  @JoinColumn({ name: "person_id" })
  person?: Relation<PersonEntity>;

  @Column({ name: "platform_id", type: "uuid" })
  platformId!: Id;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "url", type: "varchar", length: 1000, nullable: true })
  url?: Url | null;

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