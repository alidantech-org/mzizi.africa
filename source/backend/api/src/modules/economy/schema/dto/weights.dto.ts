import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";
import type { Weight } from "#/modules/economy/schema/type/weight.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A good's weight in a basket. (entity)
 */
export class WeightsDto {
  @IsString()
  @IsUUID()
  basketId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  goodId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsNumber({})
  @Min(0)
  weight!: Weight;
}
