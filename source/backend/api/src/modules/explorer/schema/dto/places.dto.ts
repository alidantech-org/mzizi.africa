import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PlaceDto } from "#/modules/explorer/schema/dto/place.dto.ts";
import type { Limit } from "#/modules/explorer/schema/type/limit.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Places
 */
export class PlacesDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsInt()
  @Min(1)
  @Max(100)
  limit!: Limit;

  @IsInt()
  @Min(1)
  page!: PositiveInteger;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceDto)
  places!: PlaceDto[];

  @IsInt()
  @Min(0)
  total!: NonNegativeInteger;
}
