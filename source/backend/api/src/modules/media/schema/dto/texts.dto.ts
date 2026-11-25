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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { TextOrigin } from "#/modules/media/schema/enum/text-origin.enum.ts";
import { TextStatus } from "#/modules/media/schema/enum/text-status.enum.ts";
import type { Markdown } from "#/modules/media/schema/type/markdown.type.ts";
import type { Summary } from "#/modules/media/schema/type/summary.type.ts";
import type { Title } from "#/modules/media/schema/type/title.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One article in one language: exactly one original per article, at most one live text per language. (entity)
 */
export class TextsDto {
  @IsString()
  @IsUUID()
  articleId!: Id;

  @IsString()
  @MinLength(1)
  body!: Markdown;

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
  languageId!: Id;

  @IsEnum(TextOrigin)
  @Satisfies<TextsDto>(
    (object) => object.origin === "original" || object.translatedFromId != null,
    {
      message: "Translation Names Its Source",
    },
  )
  origin!: TextOrigin;

  @IsEnum(TextStatus)
  status!: TextStatus;

  @IsOptional()
  @ValidateIf((object) => object.summary !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  summary?: Summary | null;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: Title;

  @IsOptional()
  @ValidateIf((object) => object.translatedFromId !== null)
  @IsString()
  @IsUUID()
  translatedFromId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
