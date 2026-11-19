import { Type } from "class-transformer";
import {
  Allow,
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { NearbyProjectsProjectsMediaDto } from "#/modules/insights/schema/dto/nearby-projects-projects-media.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Nearby Projects Projects
 */
export class NearbyProjectsProjectsDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsNumber({})
  amount?: Number | null;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.contractor !== null)
  @IsString()
  contractor?: String | null;

  @IsNumber({})
  distanceKm!: Number;

  @Allow()
  location!: unknown;

  @IsDefined()
  @ValidateNested()
  @Type(() => NearbyProjectsProjectsMediaDto)
  media!: NearbyProjectsProjectsMediaDto;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.responsible !== null)
  @IsString()
  responsible?: String | null;

  @IsString()
  status!: String;

  @IsString()
  unit!: String;

  @IsString()
  unitId!: String;

  @IsString()
  unitPath!: String;
}
