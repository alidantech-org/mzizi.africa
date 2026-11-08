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
import { ProvenanceMethod } from "#/types/shared/provenance-method.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Name } from "#/types/shared/name.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * Method
 */
@Entity({ schema: "source", name: "methods" })
@Index("idx_method_kind", ["kind"])
export class MethodEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "description", type: "varchar", length: 4000, nullable: true })
  description?: Description | null;

  @Column({ name: "kind", type: "enum", enum: ProvenanceMethod })
  kind!: ProvenanceMethod;

  @Column({ name: "model", type: "varchar", length: 200, nullable: true })
  model?: ToolName | null;

  @Column({ name: "name", type: "varchar", length: 300 })
  name!: Name;

  @Column({ name: "tool", type: "varchar", length: 200, nullable: true })
  tool?: ToolName | null;

  @Column({ name: "tool_version", type: "varchar", length: 200, nullable: true })
  toolVersion?: ToolName | null;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;
}