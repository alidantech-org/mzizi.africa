import {
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
import type { Layer } from "#/modules/geography/schema/type/layer.type.ts";
import type { Member } from "#/modules/geography/schema/type/member.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A stored GIS file or prepared map output (tile set, TopoJSON) for a feature, through filesystem versions. (entity)
 */
export class AssetsDto {
  @IsOptional()
  @ValidateIf((object) => object.band !== null)
  @IsInt()
  @Min(1)
  band?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.builtAt !== null)
  @IsISO8601({})
  builtAt?: Instant | null;

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
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.geometryId !== null)
  @IsString()
  @IsUUID()
  geometryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.hierarchyId !== null)
  @IsString()
  @IsUUID()
  hierarchyId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.layer !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  layer?: Layer | null;

  @IsOptional()
  @ValidateIf((object) => object.levelId !== null)
  @IsString()
  @IsUUID()
  levelId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.member !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  member?: Member | null;

  @IsString()
  @IsUUID()
  purposeTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.staleAt !== null)
  @IsISO8601({})
  staleAt?: Instant | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsString()
  @IsUUID()
  versionId!: Id;
}
