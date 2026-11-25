import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { IdentityDetailIdentifiersDto } from "#/modules/identity/schema/dto/identity-detail-identifiers.dto.ts";
import { IdentityDetailNamesDto } from "#/modules/identity/schema/dto/identity-detail-names.dto.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Identity Detail
 */
export class IdentityDetailDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IdentityDetailIdentifiersDto)
  identifiers!: IdentityDetailIdentifiersDto[];

  @IsString()
  @IsUUID()
  identityId!: Id;

  @IsEnum(IdentityKind)
  kind!: IdentityKind;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IdentityDetailNamesDto)
  names!: IdentityDetailNamesDto[];
}
