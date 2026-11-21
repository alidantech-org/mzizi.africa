import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { BoundaryShapeDto } from "#/modules/explorer/schema/dto/boundary-shape.dto.ts";
import { PlaceDto } from "#/modules/explorer/schema/dto/place.dto.ts";
import type { Degrees } from "#/modules/explorer/schema/type/degrees.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Boundaries
 */
export class BoundariesDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(-180, { each: true })
  @Max(180, { each: true })
  bbox!: Degrees[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceDto)
  place!: PlaceDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => BoundaryShapeDto)
  shapes!: BoundaryShapeDto[];

  @IsInt()
  @Min(0)
  withoutBoundary!: NonNegativeInteger;
}
