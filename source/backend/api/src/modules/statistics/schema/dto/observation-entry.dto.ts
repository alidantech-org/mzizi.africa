import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ObservationEntryBreakdownsDto } from "#/modules/statistics/schema/dto/observation-entry-breakdowns.dto.ts";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Cell } from "#/modules/shared/schema/type/cell.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Observation Entry
 */
export class ObservationEntryDto {
  @IsEnum(FigureBasis)
  basis!: FigureBasis;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ObservationEntryBreakdownsDto)
  breakdowns!: ObservationEntryBreakdownsDto[];

  @IsString()
  @MaxLength(1000)
  cell!: Cell;

  @ValidateIf((object) => object.collectionId !== null)
  @IsString()
  @IsUUID()
  collectionId!: Id | null;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @ValidateIf((object) => object.lower !== null)
  @IsNumber({})
  lower!: Number | null;

  @IsString()
  @IsUUID()
  observationId!: Id;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId!: Id | null;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;

  @ValidateIf((object) => object.upper !== null)
  @IsNumber({})
  upper!: Number | null;

  @ValidateIf((object) => object.value !== null)
  @IsNumber({})
  value!: Number | null;
}
