import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PowerEntryToNamesDto } from "#/modules/governance/schema/dto/power-entry-to-names.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Power Entry
 */
export class PowerEntryDto {
  @IsBoolean()
  isBinding!: Flag;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsString()
  @IsUUID()
  powerId!: Id;

  @ValidateIf((object) => object.provisionId !== null)
  @IsString()
  @IsUUID()
  provisionId!: Id | null;

  @ValidateIf((object) => object.thresholdTerm !== null)
  @IsString()
  @IsUUID()
  thresholdTerm!: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  toCode!: IdentityCode;

  @IsString()
  @IsUUID()
  toId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PowerEntryToNamesDto)
  toNames!: PowerEntryToNamesDto[];
}
