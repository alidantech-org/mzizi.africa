import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One typed relationship between a Civic project and one Geography feature. (entity)
 */
export class ProjectFeaturesDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  featureKindId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  projectId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
