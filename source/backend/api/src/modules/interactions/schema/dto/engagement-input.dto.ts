import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { DeviceId } from "#/modules/interactions/schema/type/device-id.type.ts";
import type { Ref } from "#/modules/interactions/schema/type/ref.type.ts";
import type { Table } from "#/modules/interactions/schema/type/table.type.ts";

/**
 * Engagement Input
 */
export class EngagementInputDto {
  @IsOptional()
  @IsString()
  @MinLength(16)
  @MaxLength(128)
  deviceId?: DeviceId;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  subjectRef!: Ref;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  subjectTable!: Table;
}
