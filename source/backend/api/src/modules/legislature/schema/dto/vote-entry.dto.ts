import {
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { VoteChoice } from "#/modules/legislature/schema/enum/vote-choice.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Vote Entry
 */
export class VoteEntryDto {
  @IsEnum(VoteChoice)
  choice!: VoteChoice;

  @IsString()
  @IsUUID()
  holderId!: Id;

  @IsString()
  @IsUUID()
  individualId!: Id;

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
