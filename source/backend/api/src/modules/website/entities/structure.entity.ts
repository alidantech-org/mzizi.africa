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
import { StructureOwnerKind } from "#/types/website/structure-owner-kind.enum.ts";
import { StructureStatus } from "#/types/website/structure-status.enum.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Purpose } from "#/types/website/purpose.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Structure
 */
@Entity({ schema: "website", name: "structures" })
@Index("idx_structure_owner", ["ownerKind", "ownerId", "purpose"], { unique: true })
export class StructureEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "current_version_id", type: "uuid", nullable: true })
  currentVersionId?: Id | null;

  @Column({ name: "owner_id", type: "uuid" })
  ownerId!: Id;

  @Column({ name: "owner_kind", type: "enum", enum: StructureOwnerKind })
  ownerKind!: StructureOwnerKind;

  @Column({ name: "purpose", type: "varchar", length: 100 })
  purpose!: Purpose;

  @Column({ name: "status", type: "enum", enum: StructureStatus })
  status!: StructureStatus;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}