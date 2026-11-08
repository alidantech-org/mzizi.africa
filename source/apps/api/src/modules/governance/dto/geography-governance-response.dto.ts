import { Type } from "class-transformer";
import {
  Allow,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBase64,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsFQDN,
  IsHexadecimal,
  IsHexColor,
  IsInt,
  IsIP,
  IsISO31661Alpha2,
  IsISO4217CurrencyCode,
  IsISO8601,
  IsJSON,
  IsJWT,
  IsLocale,
  IsMimeType,
  IsNumber,
  IsObject,
  IsOptional,
  IsSemVer,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDivisibleBy,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";

import { Satisfies } from "#/modules/common/dto/validators/satisfies.ts";
import { InstitutionPublicDto } from "#/modules/governance/dto/institution-public.dto.ts";
import { OfficeHolderPublicDto } from "#/modules/governance/dto/office-holder-public.dto.ts";
import { OfficePublicDto } from "#/modules/governance/dto/office-public.dto.ts";

/**
 * Geography Governance Response
 */
export class GeographyGovernanceResponseDto {

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeHolderPublicDto)
  holders!: OfficeHolderPublicDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstitutionPublicDto)
  institutions!: InstitutionPublicDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficePublicDto)
  offices!: OfficePublicDto[];
}