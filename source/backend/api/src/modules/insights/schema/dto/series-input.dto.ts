import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Series Input
 */
export class SeriesInputDto {
  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  indicatorCode!: Code;
}
