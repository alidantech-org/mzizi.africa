import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { AppropriationCollectionDto } from "#/modules/finance/schema/dto/appropriation-collection.dto.ts";
import { BudgetCollectionDto } from "#/modules/finance/schema/dto/budget-collection.dto.ts";
import { FindingCollectionDto } from "#/modules/finance/schema/dto/finding-collection.dto.ts";
import { GovernmentBudgetsDto } from "#/modules/finance/schema/dto/government-budgets.dto.ts";
import { InstitutionFindingsDto } from "#/modules/finance/schema/dto/institution-findings.dto.ts";
import { RevisionLinesDto } from "#/modules/finance/schema/dto/revision-lines.dto.ts";
import { FinanceBudgetsService } from "./budgets.service.ts";

@Controller()
export class FinanceBudgetsController {
  constructor(private readonly service: FinanceBudgetsService) {}

  @Get("/v1/finance/appropriations")
  @HttpCode(200)
  listAppropriations(@Query() input: RevisionLinesDto): Promise<AppropriationCollectionDto> {
    return this.service.listAppropriations(input);
  }

  @Get("/v1/finance/budgets")
  @HttpCode(200)
  listBudgets(@Query() input: GovernmentBudgetsDto): Promise<BudgetCollectionDto> {
    return this.service.listBudgets(input);
  }

  @Get("/v1/finance/findings")
  @HttpCode(200)
  listFindings(@Query() input: InstitutionFindingsDto): Promise<FindingCollectionDto> {
    return this.service.listFindings(input);
  }
}
