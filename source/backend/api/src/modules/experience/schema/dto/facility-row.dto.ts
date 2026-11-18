import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CapacityDto } from "#/modules/experience/schema/dto/capacity.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Facility Row
 */
export class FacilityRowDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CapacityDto)
  capacity!: CapacityDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  classCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  classLabel!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  code!: NonEmptyString255;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  domainCode!: NonEmptyString100;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  domainLabel!: Name;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.latitude !== null)
  @IsNumber({})
  latitude?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.longitude !== null)
  @IsNumber({})
  longitude?: Number | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.operator !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  operator?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.ownershipLabel !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  ownershipLabel?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.placeName !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  placeName?: Name | null;

  @IsOptional()
  @ValidateIf((object) => object.placePath !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  placePath?: NonEmptyString1000 | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  statusLabel!: Name;
}
