import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One part of a composite index, with its weight and transform. (entity)
 */
export class ComponentsDto {
  @IsString()
  @IsUUID()
  componentId!: Id;

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
  @Satisfies<ComponentsDto>((object) => object.indicatorId !== object.componentId, {
    message: "Component Is Not Itself",
  })
  indicatorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  transformTerm!: Id;

  @IsNumber({})
  @Satisfies<ComponentsDto>((object) => object.weight > 0, {
    message: "Weight Is Positive",
  })
  weight!: Number;
}
