import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { EvidenceRefDto } from "#/modules/locality/schema/dto/evidence-ref.dto.ts";
import { MediaRefDto } from "#/modules/locality/schema/dto/media-ref.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Office Holder
 */
export class OfficeHolderDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => EvidenceRefDto)
  evidence!: EvidenceRefDto[];

  @IsString()
  @IsUUID()
  holderId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.leftOfficeOn !== null)
  @IsISO8601({ strict: true })
  leftOfficeOn?: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  officeCode!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  officeTitle!: Name;

  @IsOptional()
  @ValidateIf((object) => object.partyName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  partyName?: Name | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  personName!: Name;

  @IsOptional()
  @ValidateIf((object) => object.portrait !== null)
  @ValidateNested()
  @Type(() => MediaRefDto)
  portrait?: MediaRefDto | null;

  @IsOptional()
  @ValidateIf((object) => object.tookOfficeOn !== null)
  @IsISO8601({ strict: true })
  tookOfficeOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.unitFeatureId !== null)
  @IsString()
  @IsUUID()
  unitFeatureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.unitName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  unitName?: Name | null;
}
