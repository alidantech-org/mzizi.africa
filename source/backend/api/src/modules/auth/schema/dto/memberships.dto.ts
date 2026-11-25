import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { MembershipStatus } from "#/modules/auth/schema/enum/membership-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An account's membership of an institution, verified and revocable with attribution. (entity)
 */
export class MembershipsDto {
  @IsString()
  @IsUUID()
  accountId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.endsAt !== null)
  @IsISO8601({})
  endsAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  institutionId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.revokedAt !== null)
  @IsISO8601({})
  revokedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.revokedBy !== null)
  @IsString()
  @IsUUID()
  revokedBy?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.startsAt !== null)
  @IsISO8601({})
  startsAt?: Instant | null;

  @IsEnum(MembershipStatus)
  status!: MembershipStatus;

  @IsOptional()
  @ValidateIf((object) => object.verifiedAt !== null)
  @IsISO8601({})
  verifiedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.verifiedBy !== null)
  @IsString()
  @IsUUID()
  verifiedBy?: Id | null;
}
