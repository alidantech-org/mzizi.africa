import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ProvisionEntryWordingsDto } from "#/modules/legal/schema/dto/provision-entry-wordings.dto.ts";
import { ProvisionKind } from "#/modules/legal/schema/enum/provision-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Provision Entry
 */
export class ProvisionEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  designation!: NonEmptyString255;

  @IsEnum(ProvisionKind)
  kind!: ProvisionKind;

  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId!: Id | null;

  @IsInt()
  @Min(1)
  position!: PositiveInteger;

  @IsString()
  @IsUUID()
  provisionId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProvisionEntryWordingsDto)
  wordings!: ProvisionEntryWordingsDto[];
}
