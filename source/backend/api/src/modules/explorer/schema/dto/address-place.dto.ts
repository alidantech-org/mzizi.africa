import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PlaceDto } from "#/modules/explorer/schema/dto/place.dto.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";

/**
 * Address Place
 */
export class AddressPlaceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  address!: Path;

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @ValidateNested()
  @Type(() => PlaceDto)
  place?: PlaceDto | null;
}
