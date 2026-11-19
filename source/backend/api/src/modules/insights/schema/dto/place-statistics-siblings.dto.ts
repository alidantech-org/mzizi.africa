import { Type } from "class-transformer";
import { IsNumber, IsOptional, ValidateIf, ValidateNested } from "class-validator";
import { PlaceStatisticsSiblingsDensityDto } from "#/modules/insights/schema/dto/place-statistics-siblings-density.dto.ts";
import { PlaceStatisticsSiblingsPopulationDto } from "#/modules/insights/schema/dto/place-statistics-siblings-population.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Place Statistics Siblings
 */
export class PlaceStatisticsSiblingsDto {
  @IsOptional()
  @ValidateIf((object) => object.density !== null)
  @ValidateNested()
  @Type(() => PlaceStatisticsSiblingsDensityDto)
  density?: PlaceStatisticsSiblingsDensityDto | null;

  @IsNumber({})
  peers!: Number;

  @IsOptional()
  @ValidateIf((object) => object.population !== null)
  @ValidateNested()
  @Type(() => PlaceStatisticsSiblingsPopulationDto)
  population?: PlaceStatisticsSiblingsPopulationDto | null;
}
