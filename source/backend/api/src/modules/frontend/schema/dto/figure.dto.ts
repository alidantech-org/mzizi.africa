import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { LocalizedTextDto } from "#/modules/shared/schema/dto/localized-text.dto.ts";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Figure
 */
export class FigureDto {
  @IsEnum(FigureBasis)
  basis!: FigureBasis;

  @IsOptional()
  @ValidateIf((object) => object.decimals !== null)
  @IsInt()
  @Min(0)
  decimals?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  indicator!: IdentityCode;

  @IsDefined()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  label!: LocalizedTextDto;

  @IsOptional()
  @ValidateIf((object) => object.lower !== null)
  @IsNumber({})
  lower?: Number | null;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  unit?: NonEmptyString100 | null;

  @IsOptional()
  @ValidateIf((object) => object.upper !== null)
  @IsNumber({})
  upper?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.value !== null)
  @IsNumber({})
  value?: Number | null;
}
