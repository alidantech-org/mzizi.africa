import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Compare Options Input
 */
export class CompareOptionsInputDto {
  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  metric?: Code;
}
