import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { GovernanceTabsArmsInstitutionsKindDto } from "#/modules/insights/schema/dto/governance-tabs-arms-institutions-kind.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tabs Arms Institutions
 */
export class GovernanceTabsArmsInstitutionsDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.image !== null)
  @IsString()
  image?: String | null;

  @IsDefined()
  @ValidateNested()
  @Type(() => GovernanceTabsArmsInstitutionsKindDto)
  kind!: GovernanceTabsArmsInstitutionsKindDto;

  @IsNumber({})
  leaders!: Number;

  @IsString()
  name!: String;
}
