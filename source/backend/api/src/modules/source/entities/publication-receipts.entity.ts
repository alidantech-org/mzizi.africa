import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";

/**
 * Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict.
 */
@Entity({ schema: "source", name: "publication_receipts" })
@Index(["idempotencyKey"], { unique: true })
@Index(["publicationRefId"], { unique: true })
export class PublicationReceiptsEntity {

  @PrimaryColumn({ name: "id", type: "uuid" })
  id!: Id;

  @Column({ name: "actor_snapshot", type: "text" })
  actorSnapshot!: JsonText;

  @Column({ name: "contract_version", type: "varchar", length: 255 })
  contractVersion!: NonEmptyString255;

  @Column({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;

  @Column({ name: "idempotency_key", type: "varchar", length: 255 })
  idempotencyKey!: NonEmptyString255;

  @Column({ name: "payload_hash", type: "char", length: 64 })
  payloadHash!: Sha256;

  @Column({ name: "publication_ref_id", type: "uuid" })
  publicationRefId!: Id;

  @Column({ name: "published_at", type: "timestamptz" })
  publishedAt!: Date;

  @Column({ name: "request_hash", type: "char", length: 64 })
  requestHash!: Sha256;

  @Column({ name: "result_manifest", type: "text" })
  resultManifest!: JsonText;

  @Column({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ name: "version", type: "integer" })
  version!: PositiveInteger;
}