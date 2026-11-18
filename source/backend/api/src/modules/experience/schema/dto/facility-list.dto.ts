import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ClassCountDto } from "#/modules/experience/schema/dto/class-count.dto.ts";
import { FacilityRowDto } from "#/modules/experience/schema/dto/facility-row.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Facility List
 */
export class FacilityListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ClassCountDto)
  classes!: ClassCountDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FacilityRowDto)
  facilities!: FacilityRowDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsInt()
  @Min(0)
  total!: NonNegativeInteger;
}
