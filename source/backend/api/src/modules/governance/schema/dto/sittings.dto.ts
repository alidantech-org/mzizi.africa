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
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The legislative or deliberative record of one meeting of a public body. When and where it happened is the linked occurrence; this holds the house, term, session and what was considered. (entity)
 */
export class SittingsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

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

  @IsString()
  @IsUUID()
  occurrenceId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sequenceNumber !== null)
  @IsInt()
  @Min(1)
  sequenceNumber?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.sessionLabel !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  sessionLabel?: NonEmptyString100 | null;

  @IsString()
  @IsUUID()
  sittingKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

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
