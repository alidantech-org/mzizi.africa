import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Tender List Tenders
 */
export class TenderListTendersDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsNumber({})
  amount?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.awardedOn !== null)
  @IsString()
  awardedOn?: String | null;

  @IsNumber({})
  bids!: Number;

  @IsString()
  buyer!: String;

  @IsString()
  closesOn!: String;

  @IsString()
  code!: String;

  @IsNumber({})
  disclosed!: Number;

  @IsNumber({})
  disclosedOf!: Number;

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @IsString()
  place?: String | null;

  @IsString()
  procedure!: String;

  @IsString()
  publishedOn!: String;

  @IsOptional()
  @ValidateIf((object) => object.reference !== null)
  @IsString()
  reference?: String | null;

  @IsString()
  status!: String;

  @IsOptional()
  @ValidateIf((object) => object.supplier !== null)
  @IsString()
  supplier?: String | null;

  @IsString()
  title!: String;
}
