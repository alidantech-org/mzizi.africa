import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Leader Profile Election
 */
export class LeaderProfileElectionDto {
  @IsNumber({})
  candidates!: Number;

  @IsString()
  heldOn!: String;

  @IsNumber({})
  margin!: Number;

  @IsNumber({})
  registered!: Number;

  @IsNumber({})
  runnerUp!: Number;

  @IsNumber({})
  share!: Number;

  @IsNumber({})
  total!: Number;

  @IsNumber({})
  votes!: Number;

  @IsNumber({})
  year!: Number;
}
