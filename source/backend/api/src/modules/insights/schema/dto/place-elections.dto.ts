import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import { PlaceElectionsElectionsDto } from "#/modules/insights/schema/dto/place-elections-elections.dto.ts";
import { PlaceElectionsRegistrationTrendDto } from "#/modules/insights/schema/dto/place-elections-registration-trend.dto.ts";
import { PlaceElectionsTurnoutTrendDto } from "#/modules/insights/schema/dto/place-elections-turnout-trend.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Place Elections
 */
export class PlaceElectionsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceElectionsElectionsDto)
  elections!: PlaceElectionsElectionsDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceElectionsRegistrationTrendDto)
  registrationTrend!: PlaceElectionsRegistrationTrendDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceElectionsTurnoutTrendDto)
  turnoutTrend!: PlaceElectionsTurnoutTrendDto[];
}
