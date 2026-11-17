import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { EvidenceRefDto } from "#/modules/locality/schema/dto/evidence-ref.dto.ts";
import type { Amount } from "#/modules/locality/schema/type/amount.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Procurement Item
 */
export class ProcurementItemDto {
  @IsOptional()
  @ValidateIf((object) => object.amount !== null)
  @IsNumber({})
  @Min(0)
  amount?: Amount | null;

  @IsOptional()
  @ValidateIf((object) => object.awardedTo !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  awardedTo?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.currency !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  currency?: NonEmptyString100 | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => EvidenceRefDto)
  evidence!: EvidenceRefDto[];

  @IsString()
  @IsUUID()
  procurementId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.status !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  status?: NonEmptyString100 | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsOptional()
  @ValidateIf((object) => object.year !== null)
  @IsInt()
  year?: Integer | null;
}
