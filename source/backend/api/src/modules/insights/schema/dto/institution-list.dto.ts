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
import { InstitutionListArmsDto } from "#/modules/insights/schema/dto/institution-list-arms.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Institution List
 */
export class InstitutionListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionListArmsDto)
  arms!: InstitutionListArmsDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsInt()
  @Min(0)
  total!: NonNegativeInteger;
}
