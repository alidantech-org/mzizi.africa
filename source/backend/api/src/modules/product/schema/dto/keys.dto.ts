import {
  IsArray,
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

import type { KeyCode } from "#/modules/product/schema/type/key-code.type.ts";
import type { Placeholder } from "#/modules/product/schema/type/placeholder.type.ts";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An interface text key declared in contracts; unknown keys are refused and missing messages are gaps. (entity)
 */
export class KeysDto {
  @IsOptional()
  @ValidateIf((object) => object.appId !== null)
  @IsString()
  @IsUUID()
  appId?: Id | null;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z][a-z0-9-]*(\\.[a-z0-9][a-z0-9-]*)+$"))
  code!: KeyCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MaxLength(4000)
  description?: Description | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.maxLength !== null)
  @IsInt()
  @Min(1)
  maxLength?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.placeholders !== null)
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(64, { each: true })
  @Matches(new RegExp("^[a-zA-Z][a-zA-Z0-9]*$"), { each: true })
  placeholders?: Placeholder[] | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
