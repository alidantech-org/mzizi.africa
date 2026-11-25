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
import { BillEntryNamesDto } from "#/modules/legislature/schema/dto/bill-entry-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Bill Entry
 */
export class BillEntryDto {
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
  @Type(() => BillEntryNamesDto)
  names!: BillEntryNamesDto[];

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @ValidateIf((object) => object.termId !== null)
  @IsString()
  @IsUUID()
  termId!: Id | null;
}
