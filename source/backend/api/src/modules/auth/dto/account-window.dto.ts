
import {
  IsEnum,
  IsInt,
  IsOptional,
} from "class-validator";

import { AccountStatus } from "#/modules/auth/account-status.enum.ts";
import type { Integer } from "#/modules/shared/integer.type.ts";

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