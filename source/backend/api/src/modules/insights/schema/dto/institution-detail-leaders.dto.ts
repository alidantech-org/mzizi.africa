import { Type } from "class-transformer";
import { IsOptional, IsString, IsDefined, ValidateIf, ValidateNested } from "class-validator";
import { InstitutionDetailLeadersHowDto } from "#/modules/insights/schema/dto/institution-detail-leaders-how.dto.ts";
import { InstitutionDetailLeadersTierDto } from "#/modules/insights/schema/dto/institution-detail-leaders-tier.dto.ts";
import { InstitutionDetailLeadersUnitDto } from "#/modules/insights/schema/dto/institution-detail-leaders-unit.dto.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Leaders
 */
export class InstitutionDetailLeadersDto {
  @IsString()
  holderId!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailLeadersHowDto)
  how!: InstitutionDetailLeadersHowDto;

  @IsString()
  leaderSlug!: String;

  @IsString()
  name!: String;

  @IsString()
  officeCode!: String;

  @IsOptional()
  @ValidateIf((object) => object.party !== null)
  @IsString()
  party?: String | null;

  @IsString()
  photo!: String;

  @IsString()
  since!: String;

  @IsDefined()
  @ValidateNested()
  @Type(() => InstitutionDetailLeadersTierDto)
  tier!: InstitutionDetailLeadersTierDto;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @ValidateNested()
  @Type(() => InstitutionDetailLeadersUnitDto)
  unit?: InstitutionDetailLeadersUnitDto | null;
}
