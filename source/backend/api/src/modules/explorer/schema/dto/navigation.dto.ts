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
import { NavigationItemDto } from "#/modules/explorer/schema/dto/navigation-item.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Navigation
 */
export class NavigationDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CountryChoiceDto)
  country!: CountryChoiceDto;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => NavigationItemDto)
  items!: NavigationItemDto[];
}
