
import {
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict. (entity)
 */
export class PublicationReceiptsDto {

  @IsString()
  @IsJSON()
  actorSnapshot!: JsonText;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  contractVersion!: NonEmptyString255;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  idempotencyKey!: NonEmptyString255;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  payloadHash!: Sha256;

  @IsString()
  @IsUUID()
  publicationRefId!: Id;

  @IsISO8601({})
  publishedAt!: Instant;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  requestHash!: Sha256;

  @IsString()
  @IsJSON()
  resultManifest!: JsonText;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}