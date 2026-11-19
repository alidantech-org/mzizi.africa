import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Party Detail Results
 */
export class PartyDetailResultsDto {
  @IsNumber({})
  candidates!: Number;

  @IsString()
  contest!: String;

  @IsNumber({})
  votes!: Number;

  @IsNumber({})
  won!: Number;

  @IsNumber({})
  year!: Number;
}
