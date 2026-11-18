import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ContextCountryDto } from "#/modules/experience/schema/dto/context-country.dto.ts";
import { ContextLevelDto } from "#/modules/experience/schema/dto/context-level.dto.ts";
import { CountryChoiceDto } from "#/modules/experience/schema/dto/country-choice.dto.ts";
import { PlaceRefDto } from "#/modules/experience/schema/dto/place-ref.dto.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Context
 */
export class ContextDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceRefDto)
  chain!: PlaceRefDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryChoiceDto)
  countries!: CountryChoiceDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => ContextCountryDto)
  country!: ContextCountryDto;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  countrySource!: NonEmptyString100;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  languageCode!: NonEmptyString100;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ContextLevelDto)
  levels!: ContextLevelDto[];

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @ValidateNested()
  @Type(() => PlaceRefDto)
  place?: PlaceRefDto | null;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(255, { each: true })
  rest!: NonEmptyString255[];
}
