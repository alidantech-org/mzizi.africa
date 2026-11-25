import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { CrosswalkKind } from "#/modules/economy/schema/enum/crosswalk-kind.enum.ts";
import type { ClassCode } from "#/modules/economy/schema/type/class-code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Official correspondence tables between classifications (UN CPC to COICOP, HS). (entity)
 */
export class CrosswalksDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  fromSchemeTerm!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  fromValue!: ClassCode;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(CrosswalkKind)
  kind!: CrosswalkKind;

  @IsString()
  @IsUUID()
  toSchemeTerm!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  toValue!: ClassCode;
}
