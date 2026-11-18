import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Motions Input
 */
export class MotionsInputDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  institutionId?: Id;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;
}
