import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, IsDefined, ValidateNested } from "class-validator";
import { PlaceElectionsElectionsContestsDto } from "#/modules/insights/schema/dto/place-elections-elections-contests.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Elections Elections
 */
export class PlaceElectionsElectionsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceElectionsElectionsContestsDto)
  contests!: PlaceElectionsElectionsContestsDto[];

  @IsString()
  electionId!: String;

  @IsString()
  heldOn!: String;

  @IsString()
  kind!: String;

  @IsNumber({})
  year!: Number;
}
