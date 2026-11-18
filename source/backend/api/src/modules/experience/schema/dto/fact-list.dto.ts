import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { FactRowDto } from "#/modules/experience/schema/dto/fact-row.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Fact List
 */
export class FactListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FactRowDto)
  facts!: FactRowDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];
}
