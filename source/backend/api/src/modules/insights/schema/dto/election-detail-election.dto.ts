import { IsNumber, IsOptional, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Election Detail Election
 */
export class ElectionDetailElectionDto {
  @IsString()
  code!: String;

  @IsOptional()
  @IsString()
  contestKind?: String;

  @IsString()
  electionId!: String;

  @IsString()
  heldOn!: String;

  @IsNumber({})
  year!: Number;
}
