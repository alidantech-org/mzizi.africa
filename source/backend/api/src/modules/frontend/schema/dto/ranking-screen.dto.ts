import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { RankRowDto } from "#/modules/frontend/schema/dto/rank-row.dto.ts";
import { LocalizedTextDto } from "#/modules/shared/schema/dto/localized-text.dto.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Ranking Screen
 */
export class RankingScreenDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  indicator!: LocalizedTextDto;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  language!: LanguageCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => RankRowDto)
  rows!: RankRowDto[];

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  unit?: NonEmptyString100 | null;

  @IsOptional()
  @ValidateIf((object) => object.year !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  year?: Year | null;
}
