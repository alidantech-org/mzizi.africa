import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Legal Basis
 */
export class InstitutionDetailLegalBasisDto {
  @IsString()
  designation!: String;

  @IsString()
  effect!: String;

  @IsOptional()
  @IsString()
  effectCode?: String;

  @IsString()
  excerpt!: String;

  @IsOptional()
  @IsString()
  explanation?: String;

  @IsOptional()
  @ValidateIf((object) => object.heading !== null)
  @IsString()
  heading?: String | null;

  @IsString()
  instrument!: String;

  @IsOptional()
  @ValidateIf((object) => object.instrumentCode !== null)
  @IsString()
  instrumentCode?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.provisionCode !== null)
  @IsString()
  provisionCode?: String | null;

  @IsString()
  reviewStatus!: String;

  @IsString()
  type!: String;

  @IsOptional()
  @ValidateIf((object) => object.via !== null)
  @IsString()
  via?: String | null;
}
