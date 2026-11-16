import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Stable identity and stewardship snapshot for a controlled vocabulary scheme. (entity)
 */
export class SchemeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"))
  code!: IdentityCode;

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
  @MinLength(1)
  @MaxLength(255)
  ownerSnapshot!: NonEmptyString255;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
