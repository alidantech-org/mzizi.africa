import { Type } from "class-transformer";
import {
  IsArray,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ProjectDetailProcurementBidsDto } from "#/modules/insights/schema/dto/project-detail-procurement-bids.dto.ts";
import { ProjectDetailProcurementContractsDto } from "#/modules/insights/schema/dto/project-detail-procurement-contracts.dto.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Project Detail Procurement
 */
export class ProjectDetailProcurementDto {
  @IsOptional()
  @ValidateIf((object) => object.awardedOn !== null)
  @IsString()
  awardedOn?: String | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectDetailProcurementBidsDto)
  bids!: ProjectDetailProcurementBidsDto[];

  @IsString()
  buyer!: String;

  @IsString()
  closesOn!: String;

  @IsString()
  code!: String;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProjectDetailProcurementContractsDto)
  contracts!: ProjectDetailProcurementContractsDto[];

  @IsString()
  procedure!: String;

  @IsString()
  publishedOn!: String;

  @IsOptional()
  @ValidateIf((object) => object.reference !== null)
  @IsString()
  reference?: String | null;

  @IsString()
  status!: String;

  @IsOptional()
  @ValidateIf((object) => object.title !== null)
  @IsString()
  title?: String | null;
}
