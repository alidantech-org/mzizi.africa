import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PlaceCivicLeadershipEvidenceDto } from "#/modules/insights/schema/dto/place-civic-leadership-evidence.dto.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Civic Leadership
 */
export class PlaceCivicLeadershipDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCivicLeadershipEvidenceDto)
  evidence!: PlaceCivicLeadershipEvidenceDto[];

  @IsString()
  holderId!: String;

  @IsString()
  leaderSlug!: String;

  @IsOptional()
  @ValidateIf((object) => object.leftOfficeOn !== null)
  @IsString()
  leftOfficeOn?: String | null;

  @IsString()
  officeCode!: String;

  @IsString()
  officeTitle!: String;

  @IsOptional()
  @ValidateIf((object) => object.partyName !== null)
  @IsString()
  partyName?: String | null;

  @IsString()
  personName!: String;

  @IsOptional()
  @ValidateIf((object) => object.portrait !== null)
  @Allow()
  portrait?: unknown | null;

  @IsString()
  tookOfficeOn!: String;

  @IsString()
  unitFeatureId!: String;

  @IsString()
  unitName!: String;
}
