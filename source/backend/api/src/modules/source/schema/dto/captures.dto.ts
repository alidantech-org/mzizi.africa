import {
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/schema/type/json-text.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One retrieval of a path by a source: when, from which link, with what response. The content is a document, shared by every capture of the same bytes; failed requests remain in Operations. (entity)
 */
export class CapturesDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

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
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.manifestReleaseId !== null)
  @IsString()
  @IsUUID()
  manifestReleaseId?: Id | null;

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  originalUrl!: Url;

  @IsOptional()
  @ValidateIf((object) => object.pathId !== null)
  @IsString()
  @IsUUID()
  pathId?: Id | null;

  @IsString()
  @IsJSON()
  responseMetadata!: JsonText;

  @IsISO8601({})
  retrievedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.retrievedUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  retrievedUrl?: Url | null;

  @IsString()
  @IsUUID()
  sourceId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
