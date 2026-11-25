import { IsEnum, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { TextOrigin } from "#/modules/media/schema/enum/text-origin.enum.ts";
import { TextStatus } from "#/modules/media/schema/enum/text-status.enum.ts";
import type { Summary } from "#/modules/media/schema/type/summary.type.ts";
import type { Title } from "#/modules/media/schema/type/title.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Article Entry Titles
 */
export class ArticleEntryTitlesDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  languageCode!: IdentityCode;

  @IsEnum(TextOrigin)
  origin!: TextOrigin;

  @IsEnum(TextStatus)
  status!: TextStatus;

  @ValidateIf((object) => object.summary !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  summary!: Summary | null;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: Title;
}
