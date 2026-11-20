import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CountryChoiceDto } from "#/modules/explorer/schema/dto/country-choice.dto.ts";
import { LevelDto } from "#/modules/explorer/schema/dto/level.dto.ts";
import { PlaceDto } from "#/modules/explorer/schema/dto/place.dto.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Context
 */
export class ContextDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceDto)
  chain!: PlaceDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => CountryChoiceDto)
  country!: CountryChoiceDto;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsString()
  @MinLength(2)
  @MaxLength(35)
  language!: LanguageCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LevelDto)
  levels!: LevelDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceDto)
  place!: PlaceDto;
}
