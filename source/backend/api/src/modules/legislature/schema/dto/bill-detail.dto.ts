import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { BillDetailNamesDto } from "#/modules/legislature/schema/dto/bill-detail-names.dto.ts";
import { BillDetailStagesDto } from "#/modules/legislature/schema/dto/bill-detail-stages.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Bill Detail
 */
export class BillDetailDto {
  @IsString()
  @IsUUID()
  billId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @ValidateIf((object) => object.instrumentId !== null)
  @IsString()
  @IsUUID()
  instrumentId!: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => BillDetailNamesDto)
  names!: BillDetailNamesDto[];

  @ValidateIf((object) => object.sponsorId !== null)
  @IsString()
  @IsUUID()
  sponsorId!: Id | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => BillDetailStagesDto)
  stages!: BillDetailStagesDto[];

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
