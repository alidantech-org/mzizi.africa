import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";

/**
 * Comparison Input
 */
export class ComparisonInputDto {
  @IsString()
  @IsUUID()
  a!: Id;

  @IsString()
  @IsUUID()
  b!: Id;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  metrics?: NonEmptyString1000;
}
