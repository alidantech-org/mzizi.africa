import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ElectionDetailContestsCandidatesNamesDto } from "#/modules/election/schema/dto/election-detail-contests-candidates-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Election Detail Contests Candidates
 */
export class ElectionDetailContestsCandidatesDto {
  @ValidateIf((object) => object.ballotOrder !== null)
  @IsInt()
  @Min(1)
  ballotOrder!: PositiveInteger | null;

  @IsString()
  @IsUUID()
  candidateId!: Id;

  @IsString()
  @IsUUID()
  individualId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionDetailContestsCandidatesNamesDto)
  names!: ElectionDetailContestsCandidatesNamesDto[];

  @ValidateIf((object) => object.partyCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  partyCode!: IdentityCode | null;

  @ValidateIf((object) => object.partyId !== null)
  @IsString()
  @IsUUID()
  partyId!: Id | null;
}
