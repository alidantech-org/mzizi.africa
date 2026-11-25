import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { LocalizedTextDto } from "#/modules/shared/schema/dto/localized-text.dto.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Rank Row
 */
export class RankRowDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name!: LocalizedTextDto;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  place!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.rank !== null)
  @IsInt()
  @Min(1)
  rank?: PositiveInteger | null;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @IsOptional()
  @ValidateIf((object) => object.value !== null)
  @IsNumber({})
  value?: Number | null;
}
