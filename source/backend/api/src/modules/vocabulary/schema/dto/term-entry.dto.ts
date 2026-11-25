import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
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
import { TermEntryLabelsDto } from "#/modules/vocabulary/schema/dto/term-entry-labels.dto.ts";
import { TermStatus } from "#/modules/vocabulary/schema/enum/term-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { ColorToken } from "#/modules/vocabulary/schema/type/color-token.type.ts";
import type { IconCode } from "#/modules/vocabulary/schema/type/icon-code.type.ts";

/**
 * Term Entry
 */
export class TermEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.colorToken !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  colorToken!: ColorToken | null;

  @ValidateIf((object) => object.iconCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  iconCode!: IconCode | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TermEntryLabelsDto)
  labels!: TermEntryLabelsDto[];

  @ValidateIf((object) => object.lower !== null)
  @IsNumber({})
  lower!: Number | null;

  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId!: Id | null;

  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position!: NonNegativeInteger | null;

  @IsEnum(TermStatus)
  status!: TermStatus;

  @IsString()
  @IsUUID()
  termId!: Id;

  @ValidateIf((object) => object.upper !== null)
  @IsNumber({})
  upper!: Number | null;
}
