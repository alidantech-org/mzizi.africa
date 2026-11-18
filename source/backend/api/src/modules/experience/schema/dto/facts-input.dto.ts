import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from "class-validator";
import type { Limit } from "#/modules/experience/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Facts Input
 */
export class FactsInputDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  featureId?: Id;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;
}
