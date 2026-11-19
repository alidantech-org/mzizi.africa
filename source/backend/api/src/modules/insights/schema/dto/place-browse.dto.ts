import { Type } from "class-transformer";
import { IsArray, IsOptional, IsDefined, ValidateIf, ValidateNested } from "class-validator";
import { PlaceBrowseMediaDto } from "#/modules/insights/schema/dto/place-browse-media.dto.ts";
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
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceBrowseMediaDto)
  media!: PlaceBrowseMediaDto[];

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place?: PlaceCrumbDto | null;
}
