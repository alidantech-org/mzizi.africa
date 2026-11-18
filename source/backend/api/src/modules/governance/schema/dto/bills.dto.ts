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

import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A proposed law from introduction to enactment. Stages record each reading, committee, assent and publication; the enacted law is a legal instrument. (entity)
 */
export class BillsDto {
  @IsString()
  @IsUUID()
  billKindId!: Id;

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
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.instrumentId !== null)
  @IsString()
  @IsUUID()
  instrumentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sponsorHolderId !== null)
  @IsString()
  @IsUUID()
  sponsorHolderId?: Id | null;

  @IsString()
  @IsUUID()
  statusId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.summary !== null)
  @IsString()
  @MaxLength(4000)
  summary?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.termId !== null)
  @IsString()
  @IsUUID()
  termId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
