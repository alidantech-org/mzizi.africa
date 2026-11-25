import {
  IsInt,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Depth } from "#/modules/reference/schema/type/depth.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Place Detail Parents
 */
export class PlaceDetailParentsDto {
  @ValidateIf((object) => object.depth !== null)
  @IsInt()
  @Min(0)
  @Max(12)
  depth!: Depth | null;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @ValidateIf((object) => object.hierarchyId !== null)
  @IsString()
  @IsUUID()
  hierarchyId!: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @ValidateIf((object) => object.levelId !== null)
  @IsString()
  @IsUUID()
  levelId!: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  parentCode!: IdentityCode;

  @IsString()
  @IsUUID()
  parentId!: Id;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
