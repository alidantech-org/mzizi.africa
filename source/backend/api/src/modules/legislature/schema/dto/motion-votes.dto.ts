import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Motion Votes
 */
export class MotionVotesDto {
  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsString()
  @IsUUID()
  motionId!: Id;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}
