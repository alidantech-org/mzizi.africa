import { Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { AccountSummaryDto } from "#/modules/auth/dto/account-summary.dto.ts";

/**
 * Account Collection
 */
export class AccountCollectionDto {

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AccountSummaryDto)
  accounts!: AccountSummaryDto[];
}