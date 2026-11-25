import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * How power flows between positions and institutions, by procedure and threshold. (entity)
 */
export class PowersDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  @Satisfies<PowersDto>((object) => object.fromId !== object.toId, {
    message: "Power Is Not Self",
  })
  fromId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isBinding!: Flag;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.procedureId !== null)
  @IsString()
  @IsUUID()
  procedureId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.provisionId !== null)
  @IsString()
  @IsUUID()
  provisionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.step !== null)
  @IsInt()
  @Min(1)
  step?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.thresholdTerm !== null)
  @IsString()
  @IsUUID()
  thresholdTerm?: Id | null;

  @IsString()
  @IsUUID()
  toId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
