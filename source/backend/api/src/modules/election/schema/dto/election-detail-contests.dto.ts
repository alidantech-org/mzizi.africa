import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ElectionDetailContestsCandidatesDto } from "#/modules/election/schema/dto/election-detail-contests-candidates.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Election Detail Contests
 */
export class ElectionDetailContestsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionDetailContestsCandidatesDto)
  candidates!: ElectionDetailContestsCandidatesDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  contestId!: Id;

  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId!: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @ValidateIf((object) => object.officeId !== null)
  @IsString()
  @IsUUID()
  officeId!: Id | null;
}
