import { IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Media attached to a post; reviewed with the post. (entity)
 */
export class AttachmentsDto {
  @IsString()
  @IsUUID()
  assetId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  postCountryId!: Id;

  @IsString()
  @IsUUID()
  postId!: Id;
}
