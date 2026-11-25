import { IsBoolean } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";

/**
 * Recorded
 */
export class RecordedDto {
  @IsBoolean()
  recorded!: Flag;
}
