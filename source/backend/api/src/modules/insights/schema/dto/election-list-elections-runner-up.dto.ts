import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Election List Elections Runner Up
 */
export class ElectionListElectionsRunnerUpDto {
  @IsString()
  name!: String;

  @IsString()
  party!: String;

  @IsNumber({})
  votes!: Number;
}
