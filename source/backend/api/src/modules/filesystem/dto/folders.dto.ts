
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import { Access } from "#/modules/filesystem/enum/access.enum.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { JsonText } from "#/modules/shared/type/json-text.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Logical hierarchy; access escalation requires recorded authorization, independent of object keys. (entity)
 */
export class FoldersDto {

  @IsEnum(Access)
  access!: Access;

  @IsOptional()
  @ValidateIf((object) => object.authorization !== null)
  @IsString()
  @IsJSON()
  authorization?: JsonText | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  @Satisfies<FoldersDto>((object) => object.id !== object.parentId, {
    message: "Folder Must Not Parent Itself",
  })
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsString()
  @IsUUID()
  roleId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}