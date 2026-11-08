import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { BudgetListQueryDto } from "#/modules/finance/dto/budget-list-query.dto.ts";
import { BudgetResponseDto } from "#/modules/finance/dto/budget-response.dto.ts";
import { BudgetaryUnitListQueryDto } from "#/modules/finance/dto/budgetary-unit-list-query.dto.ts";
import { BudgetaryUnitResponseDto } from "#/modules/finance/dto/budgetary-unit-response.dto.ts";
import { BudgetaryUnitsListResponseDto } from "#/modules/finance/dto/budgetary-units-list-response.dto.ts";
import { BudgetsListResponseDto } from "#/modules/finance/dto/budgets-list-response.dto.ts";
import { ExpenditureListQueryDto } from "#/modules/finance/dto/expenditure-list-query.dto.ts";
import { ExpenditureResponseDto } from "#/modules/finance/dto/expenditure-response.dto.ts";
import { ExpendituresListResponseDto } from "#/modules/finance/dto/expenditures-list-response.dto.ts";
import { FiscalYearListQueryDto } from "#/modules/finance/dto/fiscal-year-list-query.dto.ts";
import { FiscalYearResponseDto } from "#/modules/finance/dto/fiscal-year-response.dto.ts";
import { FiscalYearsListResponseDto } from "#/modules/finance/dto/fiscal-years-list-response.dto.ts";
import { LedgerEntriesListResponseDto } from "#/modules/finance/dto/ledger-entries-list-response.dto.ts";
import { LedgerEntryListQueryDto } from "#/modules/finance/dto/ledger-entry-list-query.dto.ts";
import { LedgerEntryResponseDto } from "#/modules/finance/dto/ledger-entry-response.dto.ts";
import { RevenueRecordListQueryDto } from "#/modules/finance/dto/revenue-record-list-query.dto.ts";
import { RevenueRecordResponseDto } from "#/modules/finance/dto/revenue-record-response.dto.ts";
import { RevenueRecordsListResponseDto } from "#/modules/finance/dto/revenue-records-list-response.dto.ts";
import { TransferListQueryDto } from "#/modules/finance/dto/transfer-list-query.dto.ts";
import { TransferResponseDto } from "#/modules/finance/dto/transfer-response.dto.ts";
import { TransfersListResponseDto } from "#/modules/finance/dto/transfers-list-response.dto.ts";
import { FinanceFinanceReadService } from "./finance-read.service.ts";

@Controller()
export class FinanceFinanceReadController {
  constructor(private readonly service: FinanceFinanceReadService) {}


  @Get("/v1/finance/units")
  @HttpCode(200)
  findBudgetaryUnits(
    @Query() input: BudgetaryUnitListQueryDto,
  ): Promise<BudgetaryUnitsListResponseDto> {
    return this.service.findBudgetaryUnits(input);
  }


  @Get("/v1/finance/budgets")
  @HttpCode(200)
  findBudgets(
    @Query() input: BudgetListQueryDto,
  ): Promise<BudgetsListResponseDto> {
    return this.service.findBudgets(input);
  }


  @Get("/v1/finance/expenditures")
  @HttpCode(200)
  findExpenditures(
    @Query() input: ExpenditureListQueryDto,
  ): Promise<ExpendituresListResponseDto> {
    return this.service.findExpenditures(input);
  }


  @Get("/v1/finance/fiscal-years")
  @HttpCode(200)
  findFiscalYears(
    @Query() input: FiscalYearListQueryDto,
  ): Promise<FiscalYearsListResponseDto> {
    return this.service.findFiscalYears(input);
  }


  @Get("/v1/finance/ledger-entries")
  @HttpCode(200)
  findLedgerEntries(
    @Query() input: LedgerEntryListQueryDto,
  ): Promise<LedgerEntriesListResponseDto> {
    return this.service.findLedgerEntries(input);
  }


  @Get("/v1/finance/revenue")
  @HttpCode(200)
  findRevenueRecords(
    @Query() input: RevenueRecordListQueryDto,
  ): Promise<RevenueRecordsListResponseDto> {
    return this.service.findRevenueRecords(input);
  }


  @Get("/v1/finance/transfers")
  @HttpCode(200)
  findTransfers(
    @Query() input: TransferListQueryDto,
  ): Promise<TransfersListResponseDto> {
    return this.service.findTransfers(input);
  }


  @Get("/v1/finance/budgets/:budgetId")
  @HttpCode(200)
  getBudgetById(
    @Param("budgetId") budgetId: string,
  ): Promise<BudgetResponseDto> {
    return this.service.getBudgetById({ budgetId });
  }


  @Get("/v1/finance/units/:unitId")
  @HttpCode(200)
  getBudgetaryUnitById(
    @Param("unitId") unitId: string,
  ): Promise<BudgetaryUnitResponseDto> {
    return this.service.getBudgetaryUnitById({ unitId });
  }


  @Get("/v1/finance/expenditures/:expenditureId")
  @HttpCode(200)
  getExpenditureById(
    @Param("expenditureId") expenditureId: string,
  ): Promise<ExpenditureResponseDto> {
    return this.service.getExpenditureById({ expenditureId });
  }


  @Get("/v1/finance/fiscal-years/:fiscalYearId")
  @HttpCode(200)
  getFiscalYearById(
    @Param("fiscalYearId") fiscalYearId: string,
  ): Promise<FiscalYearResponseDto> {
    return this.service.getFiscalYearById({ fiscalYearId });
  }


  @Get("/v1/finance/ledger-entries/:entryId")
  @HttpCode(200)
  getLedgerEntryById(
    @Param("entryId") entryId: string,
  ): Promise<LedgerEntryResponseDto> {
    return this.service.getLedgerEntryById({ entryId });
  }


  @Get("/v1/finance/revenue/:revenueId")
  @HttpCode(200)
  getRevenueRecordById(
    @Param("revenueId") revenueId: string,
  ): Promise<RevenueRecordResponseDto> {
    return this.service.getRevenueRecordById({ revenueId });
  }


  @Get("/v1/finance/transfers/:transferId")
  @HttpCode(200)
  getTransferById(
    @Param("transferId") transferId: string,
  ): Promise<TransferResponseDto> {
    return this.service.getTransferById({ transferId });
  }
}