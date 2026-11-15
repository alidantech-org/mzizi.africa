
import {
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/id.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Base for association rows: id, created timestamp and soft delete.
 */
export class AssociationDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;
}