import { Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { SchemeEntryDto } from "#/modules/reference/schema/dto/scheme-entry.dto.ts";

/**
 * Scheme Collection
 */
export class SchemeCollectionDto {

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SchemeEntryDto)
  schemes!: SchemeEntryDto[];
}