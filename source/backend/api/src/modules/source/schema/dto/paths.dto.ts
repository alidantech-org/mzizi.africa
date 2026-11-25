import {
  IsEnum,
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

import { HttpMethod } from "#/modules/source/schema/enum/http-method.enum.ts";
import { PathKind } from "#/modules/source/schema/enum/path-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Note } from "#/modules/source/schema/type/note.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Any location on a domain: a page, listing, file, feed or API endpoint. (entity)
 */
export class PathsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  domainId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(PathKind)
  kind!: PathKind;

  @IsEnum(HttpMethod)
  method!: HttpMethod;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  note?: Note | null;

  @IsOptional()
  @ValidateIf((object) => object.noteLanguageId !== null)
  @IsString()
  @IsUUID()
  noteLanguageId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  path!: NonEmptyString1000;

  @IsOptional()
  @ValidateIf((object) => object.query !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  query?: NonEmptyString1000 | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
