import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CountryContextDocumentLevelsDto } from "#/modules/structure/schema/dto/country-context-document-levels.dto.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Country Context Document
 */
export class CountryContextDocumentDto {
  @ValidateIf((object) => object.code !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  code!: IsoAlpha2 | null;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryContextDocumentLevelsDto)
  levels!: CountryContextDocumentLevelsDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;
}
