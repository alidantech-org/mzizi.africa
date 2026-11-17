import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { LocalityUnitDto } from "#/modules/locality/schema/dto/locality-unit.dto.ts";
import { MediaRefDto } from "#/modules/locality/schema/dto/media-ref.dto.ts";
import { OfficeHolderDto } from "#/modules/locality/schema/dto/office-holder.dto.ts";
import { ProcurementSummaryDto } from "#/modules/locality/schema/dto/procurement-summary.dto.ts";
import type { LanguageCode } from "#/modules/locality/schema/type/language-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Locality Profile
 */
export class LocalityProfileDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LocalityUnitDto)
  chain!: LocalityUnitDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsOptional()
  @ValidateIf((object) => object.languageRequested !== null)
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageRequested?: LanguageCode | null;

  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageServed!: LanguageCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MediaRefDto)
  media!: MediaRefDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeHolderDto)
  officials!: OfficeHolderDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => LocalityUnitDto)
  place!: LocalityUnitDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ProcurementSummaryDto)
  procurement!: ProcurementSummaryDto;
}
