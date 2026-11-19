import { Allow, IsArray, IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Party Detail Party
 */
export class PartyDetailPartyDto {
  @IsString()
  code!: String;

  @IsArray()
  @Allow()
  media!: unknown[];

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.registeredOn !== null)
  @IsString()
  registeredOn?: String | null;
}
