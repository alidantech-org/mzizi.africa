import { Type } from "class-transformer";
import { IsOptional, ValidateIf, ValidateNested } from "class-validator";
import { MotionDetailLegalFiscalYearDto } from "#/modules/insights/schema/dto/motion-detail-legal-fiscal-year.dto.ts";
import { MotionDetailLegalProvisionDto } from "#/modules/insights/schema/dto/motion-detail-legal-provision.dto.ts";

/**
 * Motion Detail Legal
 */
export class MotionDetailLegalDto {
  @IsOptional()
  @ValidateIf((object) => object.fiscalYear !== null)
  @ValidateNested()
  @Type(() => MotionDetailLegalFiscalYearDto)
  fiscalYear?: MotionDetailLegalFiscalYearDto | null;

  @IsOptional()
  @ValidateIf((object) => object.provision !== null)
  @ValidateNested()
  @Type(() => MotionDetailLegalProvisionDto)
  provision?: MotionDetailLegalProvisionDto | null;
}
