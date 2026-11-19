import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CoalitionDto } from "#/modules/ledger/schema/dto/coalition.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Coalition List
 */
export class CoalitionListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CoalitionDto)
  coalitions!: CoalitionDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];
}
