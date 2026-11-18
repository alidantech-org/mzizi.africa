import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  type Relation,
} from "typeorm";
import { SittingsEntity } from "#/modules/governance/schema/entities/sittings.entity.ts";
import { LanguageEntity } from "#/modules/reference/schema/entities/language.entity.ts";
import { ArtifactsEntity } from "#/modules/source/schema/entities/artifacts.entity.ts";
import { CitationsEntity } from "#/modules/source/schema/entities/citations.entity.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * The official verbatim record (Hansard) of one sitting as a published document. Speeches and divisions are extracted from it and cite its pages.
 */
@Entity({ schema: "governance", name: "hansards" })
@Index(["code"], { unique: true, where: '"deleted_at" IS NULL' })
@Index(["sittingId"])
@Index(["artifactId"])
@Index(["languageId"])
@Index(["sourceCitationId"])
export class HansardsEntity {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "artifact_id", type: "uuid" })
  artifactId!: Id;

  @ManyToOne(() => ArtifactsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "artifact_id" })
  artifact?: Relation<ArtifactsEntity>;

  @Column({ name: "code", type: "varchar", length: 255 })
  code!: IdentityCode;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "is_provisional", type: "boolean" })
  isProvisional!: Flag;

  @Column({ name: "language_id", type: "uuid" })
  languageId!: Id;

  @ManyToOne(() => LanguageEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "language_id" })
  language?: Relation<LanguageEntity>;

  @Column({ name: "published_on", type: "date", nullable: true })
  publishedOn?: Date | null;

  @Column({ name: "reference", type: "varchar", length: 255, nullable: true })
  reference?: NonEmptyString255 | null;

  @Column({ name: "sitting_id", type: "uuid" })
  sittingId!: Id;

  @ManyToOne(() => SittingsEntity, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "sitting_id" })
  sitting?: Relation<SittingsEntity>;

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
