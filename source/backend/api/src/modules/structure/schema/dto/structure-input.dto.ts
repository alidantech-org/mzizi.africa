import { IsString, Length, Matches } from "class-validator";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/**
 * Structure Input
 */
export class StructureInputDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;
}
