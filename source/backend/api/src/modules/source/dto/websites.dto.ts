
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { Id } from "#/modules/shared/id.type.ts";
import type { Name } from "#/modules/shared/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Website-specific identity attached to a source channel. (entity)
 */
export class WebsitesDto {

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  canonicalUrl!: Url;

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
  @IsUUID()
  sourceId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}