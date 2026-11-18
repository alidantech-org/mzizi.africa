import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One public procurement process run by a buyer, optionally linked to a project. (entity)
 */
export class ProcurementsDto {
  @IsOptional()
  @ValidateIf((object) => object.awardedOn !== null)
  @IsISO8601({ strict: true })
  awardedOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  buyerEntityId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.categoryId !== null)
  @IsString()
  @IsUUID()
  categoryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.closesOn !== null)
  @IsISO8601({ strict: true })
  closesOn?: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.natureId !== null)
  @IsString()
  @IsUUID()
  natureId?: Id | null;

  @IsString()
  @IsUUID()
  procedureKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOn !== null)
  @IsISO8601({ strict: true })
  publishedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.reference !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  reference?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.statusId !== null)
  @IsString()
  @IsUUID()
  statusId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.title !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title?: Name | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
