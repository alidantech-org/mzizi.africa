import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Leader Profile Activity Speeches
 */
export class LeaderProfileActivitySpeechesDto {
  @IsString()
  heldOn!: String;

  @IsString()
  kind!: String;

  @IsString()
  motion!: String;

  @IsString()
  motionCode!: String;

  @IsString()
  summary!: String;

  @IsNumber({})
  wordCount!: Number;
}
