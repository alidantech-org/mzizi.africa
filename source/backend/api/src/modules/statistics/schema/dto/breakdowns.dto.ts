import { IsISO8601, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The categories that cut one observation: at most one term per dimension. (entity)
 */
export class BreakdownsDto {
  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  observationId!: Id;

  @IsString()
  @IsUUID()
  schemeId!: Id;

  @IsString()
  @IsUUID()
  termId!: Id;
}
