import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Election Input
 */
export class ElectionInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  contestKind?: NonEmptyString100;

  @IsString()
  @IsUUID()
  electionId!: Id;

  @IsOptional()
  @IsString()
  @IsUUID()
  parentFeatureId?: Id;
}
