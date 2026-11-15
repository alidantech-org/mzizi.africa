
import {
  IsEnum,
  IsInt,
  IsOptional,
} from "class-validator";

import { AccountStatus } from "#/modules/auth/enum/account-status.enum.ts";
import type { Integer } from "#/modules/shared/type/integer.type.ts";

/**
 * Account Window
 */
export class AccountWindowDto {

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;
}