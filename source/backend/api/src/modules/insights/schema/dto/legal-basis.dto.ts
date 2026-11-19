import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { LegalBasisItemsDto } from "#/modules/insights/schema/dto/legal-basis-items.dto.ts";
import { LegalBasisSubjectDto } from "#/modules/insights/schema/dto/legal-basis-subject.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Legal Basis
 */
export class LegalBasisDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LegalBasisItemsDto)
  items!: LegalBasisItemsDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => LegalBasisSubjectDto)
  subject!: LegalBasisSubjectDto;
}
