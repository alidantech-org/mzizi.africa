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
import { LoanDisbursementListQueryDto } from "#/modules/debt/dto/loan-disbursement-list-query.dto.ts";
import { LoanDisbursementResponseDto } from "#/modules/debt/dto/loan-disbursement-response.dto.ts";
import { LoanDisbursementsListResponseDto } from "#/modules/debt/dto/loan-disbursements-list-response.dto.ts";
import { LoanListQueryDto } from "#/modules/debt/dto/loan-list-query.dto.ts";
import { LoanRepaymentListQueryDto } from "#/modules/debt/dto/loan-repayment-list-query.dto.ts";
import { LoanRepaymentResponseDto } from "#/modules/debt/dto/loan-repayment-response.dto.ts";
import { LoanRepaymentsListResponseDto } from "#/modules/debt/dto/loan-repayments-list-response.dto.ts";
import { LoanResponseDto } from "#/modules/debt/dto/loan-response.dto.ts";
import { LoansListResponseDto } from "#/modules/debt/dto/loans-list-response.dto.ts";
import { DebtDebtReadService } from "./debt-read.service.ts";

@Controller()
export class DebtDebtReadController {
  constructor(private readonly service: DebtDebtReadService) {}


  @Get("/v1/debt/disbursements")
  @HttpCode(200)
  findLoanDisbursements(
    @Query() input: LoanDisbursementListQueryDto,
  ): Promise<LoanDisbursementsListResponseDto> {
    return this.service.findLoanDisbursements(input);
  }


  @Get("/v1/debt/repayments")
  @HttpCode(200)
  findLoanRepayments(
    @Query() input: LoanRepaymentListQueryDto,
  ): Promise<LoanRepaymentsListResponseDto> {
    return this.service.findLoanRepayments(input);
  }


  @Get("/v1/debt/loans")
  @HttpCode(200)
  findLoans(
    @Query() input: LoanListQueryDto,
  ): Promise<LoansListResponseDto> {
    return this.service.findLoans(input);
  }


  @Get("/v1/debt/loans/:loanId")
  @HttpCode(200)
  getLoanById(
    @Param("loanId") loanId: string,
  ): Promise<LoanResponseDto> {
    return this.service.getLoanById({ loanId });
  }


  @Get("/v1/debt/disbursements/:disbursementId")
  @HttpCode(200)
  getLoanDisbursementById(
    @Param("disbursementId") disbursementId: string,
  ): Promise<LoanDisbursementResponseDto> {
    return this.service.getLoanDisbursementById({ disbursementId });
  }


  @Get("/v1/debt/repayments/:repaymentId")
  @HttpCode(200)
  getLoanRepaymentById(
    @Param("repaymentId") repaymentId: string,
  ): Promise<LoanRepaymentResponseDto> {
    return this.service.getLoanRepaymentById({ repaymentId });
  }
}