import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { DispatchState } from "#/modules/community/schema/enum/dispatch-state.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One sending of a notification to one device; partitioned by month. (entity)
 */
export class DispatchesDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  deviceId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  notificationCreatedAt!: Instant;

  @IsString()
  @IsUUID()
  notificationId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.openedAt !== null)
  @IsISO8601({})
  openedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.sentAt !== null)
  @IsISO8601({})
  sentAt?: Instant | null;

  @IsEnum(DispatchState)
  state!: DispatchState;

  @IsString()
  @IsUUID()
  subscriptionId!: Id;
}
