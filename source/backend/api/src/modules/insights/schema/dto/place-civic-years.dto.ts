import { Type } from "class-transformer";
import { IsArray, IsNumber, IsDefined, ValidateNested } from "class-validator";
import { PlaceCivicYearsClassesDto } from "#/modules/insights/schema/dto/place-civic-years-classes.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Place Civic Years
 */
export class PlaceCivicYearsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCivicYearsClassesDto)
  classes!: PlaceCivicYearsClassesDto[];

  @IsNumber({})
  total!: Number;

  @IsNumber({})
  year!: Number;
}
