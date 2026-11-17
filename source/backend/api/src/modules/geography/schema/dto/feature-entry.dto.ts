import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { FeatureEntryNamesDto } from "#/modules/geography/schema/dto/feature-entry-names.dto.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Feature Entry
 */
export class FeatureEntryDto {
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
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  featureTypeId!: Id;

  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision!: DatePrecision | null;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FeatureEntryNamesDto)
  names!: FeatureEntryNamesDto[];

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
