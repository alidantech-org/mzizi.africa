import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
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
import { GoodKind } from "#/modules/economy/schema/enum/good-kind.enum.ts";
import { GoodStatus } from "#/modules/economy/schema/enum/good-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The catalogue of goods, services and works ("Cement, 50 kg bag, grade 42.5N"). (entity)
 */
export class GoodsDto {
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
  @Satisfies<GoodsDto>((object) => object.id !== object.parentId, {
    message: "Good Is Not Its Own Parent",
  })
  id!: Id;

  @IsEnum(GoodKind)
  kind!: GoodKind;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.size !== null)
  @IsNumber({})
  @Satisfies<GoodsDto>((object) => object.size == null || object.sizeUnitId != null, {
    message: "Size Has Unit",
  })
  size?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.sizeUnitId !== null)
  @IsString()
  @IsUUID()
  sizeUnitId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.standardTerm !== null)
  @IsString()
  @IsUUID()
  standardTerm?: Id | null;

  @IsEnum(GoodStatus)
  status!: GoodStatus;

  @IsOptional()
  @ValidateIf((object) => object.unitId !== null)
  @IsString()
  @IsUUID()
  unitId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
