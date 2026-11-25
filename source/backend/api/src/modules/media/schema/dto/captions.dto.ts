import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { TextOrigin } from "#/modules/media/schema/enum/text-origin.enum.ts";
import type { Summary } from "#/modules/media/schema/type/summary.type.ts";
import type { Title } from "#/modules/media/schema/type/title.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Title, description and alt text of an asset in one language. (entity)
 */
export class CaptionsDto {
  @IsOptional()
  @ValidateIf((object) => object.altText !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  altText?: NonEmptyString1000 | null;

  @IsString()
  @IsUUID()
  assetId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  description?: Summary | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsEnum(TextOrigin)
  origin!: TextOrigin;

  @IsOptional()
  @ValidateIf((object) => object.title !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: Title | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
