import { IsNumber, IsOptional, ValidateIf } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Leader Profile Activity Votes
 */
export class LeaderProfileActivityVotesDto {
  @IsNumber({})
  absent!: Number;

  @IsNumber({})
  abstain!: Number;

  @IsOptional()
  @ValidateIf((object) => object.attendance !== null)
  @IsNumber({})
  attendance?: Number | null;

  @IsNumber({})
  no!: Number;

  @IsNumber({})
  total!: Number;

  @IsNumber({})
  yes!: Number;
}
