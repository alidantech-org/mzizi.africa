import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Motion Detail Legal Provision
 */
export class MotionDetailLegalProvisionDto {
  @IsString()
  designation!: String;

  @IsString()
  instrument!: String;

  @IsString()
  title!: String;
}
