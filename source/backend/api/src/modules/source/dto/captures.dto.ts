
import {
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/id.type.ts";
import type { JsonText } from "#/modules/shared/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Sha256 } from "#/modules/shared/sha256.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Immutable accepted retrieval snapshot with exact bytes; failed requests remain in Operations. (entity)
 */
export class CapturesDto {

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  contentHash!: Sha256;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.documentId !== null)
  @IsString()
  @IsUUID()
  documentId?: Id | null;

  @IsString()
  @IsUUID()
  fileVersionId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.manifestReleaseId !== null)
  @IsString()
  @IsUUID()
  manifestReleaseId?: Id | null;

  @IsString()
  @IsJSON()
  responseMetadata!: JsonText;

  @IsISO8601({})
  retrievedAt!: Instant;

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  retrievedUrl!: Url;

  @IsString()
  @IsUUID()
  sourceId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}