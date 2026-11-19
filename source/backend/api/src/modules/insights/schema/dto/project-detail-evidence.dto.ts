import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Project Detail Evidence
 */
export class ProjectDetailEvidenceDto {
  @IsString()
  artifactTitle!: String;

  @IsString()
  citationId!: String;

  @IsOptional()
  @ValidateIf((object) => object.confidence !== null)
  @IsNumber({})
  confidence?: Number | null;

  @IsString()
  locator!: String;

  @IsOptional()
  @ValidateIf((object) => object.publisherName !== null)
  @IsString()
  publisherName?: String | null;

  @IsString()
  retrievedAt!: String;

  @IsString()
  sourceName!: String;

  @IsOptional()
  @ValidateIf((object) => object.verification !== null)
  @IsString()
  verification?: String | null;
}
