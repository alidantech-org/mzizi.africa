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
import { PlaceCivicProjectsMediaDto } from "#/modules/insights/schema/dto/place-civic-projects-media.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Civic Projects
 */
export class PlaceCivicProjectsDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsNumber({})
  amount?: Number | null;

  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.completedOn !== null)
  @IsString()
  completedOn?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.contractor !== null)
  @IsString()
  contractor?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.location !== null)
  @Allow()
  location?: unknown | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCivicProjectsMediaDto)
  media!: PlaceCivicProjectsMediaDto;

  @IsString()
  name!: String;

  @IsString()
  startedOn!: String;

  @IsString()
  status!: String;

  @IsString()
  unit!: String;

  @IsString()
  unitId!: String;

  @IsString()
  unitPath!: String;
}
