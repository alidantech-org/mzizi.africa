import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Content Input
 */
export class ContentInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  languageCode?: NonEmptyString100;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  slug?: NonEmptyString255;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  subjectCode?: Code;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  subjectTable?: NonEmptyString100;
}
