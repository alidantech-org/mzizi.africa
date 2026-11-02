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
import { EventKind } from "#/types/filesystem/event-kind.enum.ts";
import type { Description } from "#/types/shared/description.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/**
 * File Event
 */
@Entity({ schema: "filesystem", name: "events" })
@Index("idx_event_file", ["fileId", "occurredAt"])
export class FileEventEntity {

  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: Id;

  @Column({ name: "actor_id", type: "uuid", nullable: true })
  actorId?: Id | null;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "detail", type: "varchar", length: 4000, nullable: true })
  detail?: Description | null;

  @Column({ name: "file_id", type: "uuid" })
  fileId!: Id;

  @Column({ name: "kind", type: "enum", enum: EventKind })
  kind!: EventKind;

  @Column({ name: "occurred_at", type: "timestamptz" })
  occurredAt!: Date;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: Version;

  @Column({ name: "version_id", type: "uuid", nullable: true })
  versionId?: Id | null;
}