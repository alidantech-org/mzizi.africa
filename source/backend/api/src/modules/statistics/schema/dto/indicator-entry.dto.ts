import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
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
import { IndicatorEntryNamesDto } from "#/modules/statistics/schema/dto/indicator-entry-names.dto.ts";
import { Aggregation } from "#/modules/statistics/schema/enum/aggregation.enum.ts";
import { Frequency } from "#/modules/statistics/schema/enum/frequency.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { Decimals } from "#/modules/statistics/schema/type/decimals.type.ts";

/**
 * Indicator Entry
 */
export class IndicatorEntryDto {
  @IsEnum(Aggregation)
  aggregation!: Aggregation;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.decimals !== null)
  @IsInt()
  @Min(0)
  @Max(10)
  decimals!: Decimals | null;

  @ValidateIf((object) => object.frequency !== null)
  @IsEnum(Frequency)
  frequency!: Frequency | null;

  @ValidateIf((object) => object.higherIsBetter !== null)
  @IsBoolean()
  higherIsBetter!: Flag | null;

  @IsString()
  @IsUUID()
  indicatorId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IndicatorEntryNamesDto)
  names!: IndicatorEntryNamesDto[];

  @ValidateIf((object) => object.roleTerm !== null)
  @IsString()
  @IsUUID()
  roleTerm!: Id | null;

  @IsString()
  @IsUUID()
  topicTerm!: Id;

  @ValidateIf((object) => object.unitSymbol !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  unitSymbol!: NonEmptyString100 | null;
}
