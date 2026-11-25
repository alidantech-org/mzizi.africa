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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Note } from "#/modules/election/schema/type/note.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A polling station in an election. (entity)
 */
export class StationsDto {
  @IsOptional()
  @ValidateIf((object) => object.closesAt !== null)
  @IsISO8601({})
  closesAt?: Instant | null;

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
  electionId!: Id;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.hostId !== null)
  @IsString()
  @IsUUID()
  hostId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  @Satisfies<StationsDto>((object) => object.note == null || object.noteLanguageId != null, {
    message: "Station Note Has Language",
  })
  note?: Note | null;

  @IsOptional()
  @ValidateIf((object) => object.noteLanguageId !== null)
  @IsString()
  @IsUUID()
  noteLanguageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.opensAt !== null)
  @IsISO8601({})
  opensAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.registeredVoters !== null)
  @IsInt()
  @Min(0)
  registeredVoters?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.statusTerm !== null)
  @IsString()
  @IsUUID()
  statusTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.streams !== null)
  @IsInt()
  @Min(1)
  streams?: PositiveInteger | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
