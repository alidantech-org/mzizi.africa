import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Party List Parties
 */
export class PartyListPartiesDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.fundAllocationKes !== null)
  @IsNumber({})
  fundAllocationKes?: Number | null;

  @IsNumber({})
  members!: Number;

  @IsString()
  name!: String;

  @IsNumber({})
  officeHolders!: Number;

  @IsNumber({})
  votes2022!: Number;
}
