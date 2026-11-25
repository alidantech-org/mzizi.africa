import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Maker Commitments
 */
export class MakerCommitmentsDto {
  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsString()
  @IsUUID()
  makerId!: Id;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
