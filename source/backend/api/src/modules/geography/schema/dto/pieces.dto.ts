import { Allow, IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Subdivided polygons with a spatial index, so "where am I?" lookups stay fast even for long coastlines. (entity)
 */
export class PiecesDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @Allow()
  geometry!: unknown;

  @IsString()
  @IsUUID()
  geometryId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;
}
