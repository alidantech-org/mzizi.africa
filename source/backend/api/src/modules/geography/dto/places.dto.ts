
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from "class-validator";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";

/**
 * Optional physical-place attributes for a feature; does not create a separate identity. (entity)
 */
export class PlacesDto {

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.isInhabited !== null)
  @IsBoolean()
  isInhabited?: Flag | null;
}