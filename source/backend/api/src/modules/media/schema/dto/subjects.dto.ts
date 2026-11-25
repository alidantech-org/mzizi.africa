import { IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The named things an article is about, beyond its main identity (section 34.5). (entity)
 */
export class SubjectsDto {
  @IsString()
  @IsUUID()
  articleId!: Id;

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
  identityId!: Id;

  @IsString()
  @IsUUID()
  roleTerm!: Id;
}
