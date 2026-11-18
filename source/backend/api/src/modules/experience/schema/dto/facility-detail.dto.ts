import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { FacilityRowDto } from "#/modules/experience/schema/dto/facility-row.dto.ts";
import { HostedStationDto } from "#/modules/experience/schema/dto/hosted-station.dto.ts";
import { PlaceRefDto } from "#/modules/experience/schema/dto/place-ref.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Facility Detail
 */
export class FacilityDetailDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceRefDto)
  chain!: PlaceRefDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => FacilityRowDto)
  facility!: FacilityRowDto;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => HostedStationDto)
  stations!: HostedStationDto[];
}
