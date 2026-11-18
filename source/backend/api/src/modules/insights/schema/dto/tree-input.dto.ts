import { IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Tree Input
 */
export class TreeInputDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  featureId?: Id;
}
