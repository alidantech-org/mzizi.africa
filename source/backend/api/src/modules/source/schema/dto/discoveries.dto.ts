import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateIf,
} from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NullableString1000 } from "#/modules/shared/schema/type/nullable-string1000.type.ts";
import type { Url } from "#/modules/shared/schema/type/url.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A link found while crawling. (entity)
 */
export class DiscoveriesDto {
  @IsOptional()
  @ValidateIf((object) => object.anchorText !== null)
  @IsString()
  @MaxLength(1000)
  anchorText?: NullableString1000 | null;

  @IsOptional()
  @ValidateIf((object) => object.context !== null)
  @IsString()
  @MaxLength(4000)
  context?: Description | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsISO8601({})
  discoveredAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.foundOnId !== null)
  @IsString()
  @IsUUID()
  foundOnId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  observedUrl!: Url;

  @IsOptional()
  @ValidateIf((object) => object.pathId !== null)
  @IsString()
  @IsUUID()
  pathId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  sourceId?: Id | null;
}
