import { Type } from "class-transformer";
import { IsArray, IsInt, Min, IsDefined, ValidateNested } from "class-validator";
import { PlaceDto } from "#/modules/explorer/schema/dto/place.dto.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Place Group
 */
export class PlaceGroupDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceDto)
  children!: PlaceDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceDto)
  place!: PlaceDto;

  @IsInt()
  @Min(0)
  total!: NonNegativeInteger;
}
