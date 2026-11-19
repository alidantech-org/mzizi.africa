import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { BudgetListDto } from "#/modules/ledger/schema/dto/budget-list.dto.ts";
import { CoalitionListDto } from "#/modules/ledger/schema/dto/coalition-list.dto.ts";
import { CoverageListDto } from "#/modules/ledger/schema/dto/coverage-list.dto.ts";
import { FundListDto } from "#/modules/ledger/schema/dto/fund-list.dto.ts";
import { LedgerInputDto } from "#/modules/ledger/schema/dto/ledger-input.dto.ts";
import { ManifestoListDto } from "#/modules/ledger/schema/dto/manifesto-list.dto.ts";
import { LedgerLedgerService } from "./ledger.service.ts";

@Controller()
export class LedgerLedgerController {
  constructor(private readonly service: LedgerLedgerService) {}

  @Get("/v1/coverage")
  @HttpCode(200)
  getCoverage(): Promise<CoverageListDto> {
    return this.service.getCoverage();
  }

  @Get("/v1/budgets")
  @HttpCode(200)
  listBudgets(@Query() input: LedgerInputDto): Promise<BudgetListDto> {
    return this.service.listBudgets(input);
  }

  @Get("/v1/coalitions")
  @HttpCode(200)
  listCoalitions(): Promise<CoalitionListDto> {
    return this.service.listCoalitions();
  }

  @Get("/v1/funds")
  @HttpCode(200)
  listFunds(@Query() input: LedgerInputDto): Promise<FundListDto> {
    return this.service.listFunds(input);
  }

  @Get("/v1/manifestos")
  @HttpCode(200)
  listManifestos(): Promise<ManifestoListDto> {
    return this.service.listManifestos();
  }
}
