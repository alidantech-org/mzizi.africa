import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Project Detail Procurement Contracts
 */
export class ProjectDetailProcurementContractsDto {
  @IsNumber({})
  amount!: Number;

  @IsString()
  contractor!: String;

  @IsString()
  signedOn!: String;

  @IsString()
  status!: String;
}
