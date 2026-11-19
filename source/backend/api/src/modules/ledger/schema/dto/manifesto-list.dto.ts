import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ManifestoDto } from "#/modules/ledger/schema/dto/manifesto.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Manifesto List
 */
export class ManifestoListDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ManifestoDto)
  manifestos!: ManifestoDto[];
}
