import { Type } from "class-transformer";
import { Allow, IsArray, IsOptional, IsDefined, ValidateIf, ValidateNested } from "class-validator";
import { PlaceChildDto } from "#/modules/insights/schema/dto/place-child.dto.ts";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";

/**
 * Place Browse
 */
export class PlaceBrowseDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCrumbDto)
  chain!: PlaceCrumbDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceChildDto)
  children!: PlaceChildDto[];

  @IsArray()
  @Allow()
  media!: Record<string, unknown>[];

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place?: PlaceCrumbDto | null;
}
