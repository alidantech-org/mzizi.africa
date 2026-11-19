import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsDefined, ValidateIf, ValidateNested } from "class-validator";
import { PlaceStatisticsComparisonsPlaceDto } from "#/modules/insights/schema/dto/place-statistics-comparisons-place.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Place Statistics Comparisons
 */
export class PlaceStatisticsComparisonsDto {
  @IsOptional()
  @ValidateIf((object) => object.areaKm2 !== null)
  @IsNumber({})
  areaKm2?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.density !== null)
  @IsNumber({})
  density?: Number | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceStatisticsComparisonsPlaceDto)
  place!: PlaceStatisticsComparisonsPlaceDto;

  @IsOptional()
  @ValidateIf((object) => object.population !== null)
  @IsNumber({})
  population?: Number | null;
}
