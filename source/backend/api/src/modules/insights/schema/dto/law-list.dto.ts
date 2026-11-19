import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { LawInstrumentDto } from "#/modules/insights/schema/dto/law-instrument.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Law List
 */
export class LawListDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LawInstrumentDto)
  instruments!: LawInstrumentDto[];
}
