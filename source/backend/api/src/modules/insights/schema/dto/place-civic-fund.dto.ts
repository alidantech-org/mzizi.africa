import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Civic Fund
 */
export class PlaceCivicFundDto {
  @IsString()
  code!: String;

  @IsNumber({})
  funds!: Number;

  @IsString()
  managedBy!: String;
}
