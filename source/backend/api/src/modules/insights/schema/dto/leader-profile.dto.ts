import {
  Allow,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Leader Profile
 */
export class LeaderProfileDto {
  @Allow()
  activity!: Record<string, unknown>;

  @IsArray()
  @Allow()
  contacts!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  election!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  evidence!: Record<string, unknown>[];

  @IsOptional()
  @ValidateIf((object) => object.fund !== null)
  @Allow()
  fund?: Record<string, unknown> | null;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @Allow()
  leader!: Record<string, unknown>;

  @IsArray()
  @Allow()
  media!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  offices!: Record<string, unknown>[];
}
