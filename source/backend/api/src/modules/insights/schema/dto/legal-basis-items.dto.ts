import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Legal Basis Items
 */
export class LegalBasisItemsDto {
  @IsString()
  designation!: String;

  @IsString()
  effect!: String;

  @IsString()
  effectCode!: String;

  @IsString()
  excerpt!: String;

  @IsString()
  explanation!: String;

  @IsOptional()
  @ValidateIf((object) => object.heading !== null)
  @IsString()
  heading?: String | null;

  @IsString()
  instrument!: String;

  @IsString()
  instrumentCode!: String;

  @IsString()
  provisionCode!: String;

  @IsString()
  reviewStatus!: String;

  @IsOptional()
  @ValidateIf((object) => object.via !== null)
  @IsString()
  via?: String | null;
}
