import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Election List Elections Winner
 */
export class ElectionListElectionsWinnerDto {
  @IsString()
  name!: String;

  @IsString()
  party!: String;

  @IsNumber({})
  votes!: Number;
}
