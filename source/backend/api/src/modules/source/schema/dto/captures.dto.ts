import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { HttpStatus } from "#/modules/shared/schema/type/http-status.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { Etag } from "#/modules/source/schema/type/etag.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One fetch of a path. (entity)
 */
export class CapturesDto {
  @IsOptional()
  @ValidateIf((object) => object.artifactId !== null)
  @IsString()
  @IsUUID()
  artifactId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.contentType !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  contentType?: NonEmptyString255 | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.discoveredAt !== null)
  @IsISO8601({})
  discoveredAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.discoveryId !== null)
  @IsString()
  @IsUUID()
  discoveryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.etag !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  etag?: Etag | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.lastModified !== null)
  @IsISO8601({})
  lastModified?: Instant | null;

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  originalUrl!: Url;

  @IsOptional()
  @ValidateIf((object) => object.pathId !== null)
  @IsString()
  @IsUUID()
  pathId?: Id | null;

  @IsISO8601({})
  retrievedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.retrievedUrl !== null)
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  retrievedUrl?: Url | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  sourceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.statusCode !== null)
  @IsInt()
  @Min(100)
  @Max(599)
  statusCode?: HttpStatus | null;
}
