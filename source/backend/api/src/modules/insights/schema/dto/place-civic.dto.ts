import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PlaceCivicClassesDto } from "#/modules/insights/schema/dto/place-civic-classes.dto.ts";
import { PlaceCivicFundDto } from "#/modules/insights/schema/dto/place-civic-fund.dto.ts";
import { PlaceCivicInfrastructureDto } from "#/modules/insights/schema/dto/place-civic-infrastructure.dto.ts";
import { PlaceCivicLeadershipDto } from "#/modules/insights/schema/dto/place-civic-leadership.dto.ts";
import { PlaceCivicProjectsDto } from "#/modules/insights/schema/dto/place-civic-projects.dto.ts";
import { PlaceCivicYearsDto } from "#/modules/insights/schema/dto/place-civic-years.dto.ts";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Place Civic
 */
export class PlaceCivicDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCrumbDto)
  chain!: PlaceCrumbDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCivicClassesDto)
  classes!: PlaceCivicClassesDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCivicFundDto)
  fund!: PlaceCivicFundDto;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCivicInfrastructureDto)
  infrastructure!: PlaceCivicInfrastructureDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCivicLeadershipDto)
  leadership!: PlaceCivicLeadershipDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCivicProjectsDto)
  projects!: PlaceCivicProjectsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCivicYearsDto)
  years!: PlaceCivicYearsDto[];
}
