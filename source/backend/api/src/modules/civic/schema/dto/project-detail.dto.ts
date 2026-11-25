import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ProjectDetailContractsDto } from "#/modules/civic/schema/dto/project-detail-contracts.dto.ts";
import { ProjectDetailNamesDto } from "#/modules/civic/schema/dto/project-detail-names.dto.ts";
import { ProjectDetailSitesDto } from "#/modules/civic/schema/dto/project-detail-sites.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Project Detail
 */
export class ProjectDetailDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectDetailContractsDto)
  contracts!: ProjectDetailContractsDto[];

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @ValidateIf((object) => object.implementerId !== null)
  @IsString()
  @IsUUID()
  implementerId!: Id | null;

  @ValidateIf((object) => object.institutionId !== null)
  @IsString()
  @IsUUID()
  institutionId!: Id | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectDetailNamesDto)
  names!: ProjectDetailNamesDto[];

  @IsString()
  @IsUUID()
  projectId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectDetailSitesDto)
  sites!: ProjectDetailSitesDto[];

  @ValidateIf((object) => object.sponsorId !== null)
  @IsString()
  @IsUUID()
  sponsorId!: Id | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
