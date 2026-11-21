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
import { ContextDto } from "#/modules/explorer/schema/dto/context.dto.ts";
import { PlaceGroupDto } from "#/modules/explorer/schema/dto/place-group.dto.ts";
import { PlacesDto } from "#/modules/explorer/schema/dto/places.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Location
 */
export class LocationDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => ContextDto)
  context!: ContextDto;

  @IsOptional()
  @ValidateIf((object) => object.found !== null)
  @ValidateNested()
  @Type(() => PlacesDto)
  found?: PlacesDto | null;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceGroupDto)
  groups!: PlaceGroupDto[];
}
