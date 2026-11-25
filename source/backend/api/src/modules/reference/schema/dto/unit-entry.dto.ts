import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { UnitEntryNamesDto } from "#/modules/reference/schema/dto/unit-entry-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Unit Entry
 */
export class UnitEntryDto {
  @ValidateIf((object) => object.baseId !== null)
  @IsString()
  @IsUUID()
  baseId!: Id | null;

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
  @Type(() => UnitEntryNamesDto)
  names!: UnitEntryNamesDto[];

  @IsString()
  @IsUUID()
  quantityTerm!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  symbol!: NonEmptyString100;

  @IsString()
  @IsUUID()
  unitId!: Id;
}
