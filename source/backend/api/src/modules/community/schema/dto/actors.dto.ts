import {
  IsEnum,
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
import { ActorKind } from "#/modules/community/schema/enum/actor-kind.enum.ts";
import { ActorStatus } from "#/modules/community/schema/enum/actor-status.enum.ts";
import type { Handle } from "#/modules/community/schema/type/handle.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A visitor or member; a member's public profile. Members are not identities. (entity)
 */
export class ActorsDto {
  @IsOptional()
  @ValidateIf((object) => object.accountId !== null)
  @IsString()
  @IsUUID()
  accountId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.avatarId !== null)
  @IsString()
  @IsUUID()
  avatarId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.displayName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  displayName?: NonEmptyString100 | null;

  @IsISO8601({})
  firstSeenAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.handle !== null)
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(new RegExp("^[a-z][a-z0-9]*([._][a-z0-9]+)*$"))
  @Satisfies<ActorsDto>((object) => object.handle == null || object.kind === "member", {
    message: "Handle Is For Members",
  })
  handle?: Handle | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(ActorKind)
  @Satisfies<ActorsDto>((object) => object.kind !== "member" || object.accountId != null, {
    message: "Member Has Account",
  })
  kind!: ActorKind;

  @IsOptional()
  @ValidateIf((object) => object.languageId !== null)
  @IsString()
  @IsUUID()
  languageId?: Id | null;

  @IsISO8601({})
  lastSeenAt!: Instant;

  @IsEnum(ActorStatus)
  status!: ActorStatus;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
