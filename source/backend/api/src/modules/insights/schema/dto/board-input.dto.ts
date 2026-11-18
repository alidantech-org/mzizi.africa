import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Board Input
 */
export class BoardInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  kindCode?: IdentityCode;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  metricCode!: Code;

  @IsOptional()
  @IsString()
  @IsUUID()
  parentFeatureId?: Id;
}
