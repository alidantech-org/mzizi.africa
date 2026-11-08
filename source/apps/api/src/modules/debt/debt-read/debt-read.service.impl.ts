import { Injectable } from '@nestjs/common';
import type { LoanDisbursementListQueryDto } from '#/modules/debt/dto/loan-disbursement-list-query.dto';
import type { LoanDisbursementResponseDto } from '#/modules/debt/dto/loan-disbursement-response.dto';
import type { LoanDisbursementsListResponseDto } from '#/modules/debt/dto/loan-disbursements-list-response.dto';
import type { LoanListQueryDto } from '#/modules/debt/dto/loan-list-query.dto';
import type { LoanRepaymentListQueryDto } from '#/modules/debt/dto/loan-repayment-list-query.dto';
import type { LoanRepaymentResponseDto } from '#/modules/debt/dto/loan-repayment-response.dto';
import type { LoanRepaymentsListResponseDto } from '#/modules/debt/dto/loan-repayments-list-response.dto';
import type { LoanResponseDto } from '#/modules/debt/dto/loan-response.dto';
import type { LoansListResponseDto } from '#/modules/debt/dto/loans-list-response.dto';
import { FindLoanDisbursementsUseCase } from '#/modules/debt/debt-read/use-cases/find-loan-disbursements.usecase';
import { FindLoanRepaymentsUseCase } from '#/modules/debt/debt-read/use-cases/find-loan-repayments.usecase';
import { FindLoansUseCase } from '#/modules/debt/debt-read/use-cases/find-loans.usecase';
import { GetLoanByIdUseCase } from '#/modules/debt/debt-read/use-cases/get-loan-by-id.usecase';
import { GetLoanDisbursementByIdUseCase } from '#/modules/debt/debt-read/use-cases/get-loan-disbursement-by-id.usecase';
import { GetLoanRepaymentByIdUseCase } from '#/modules/debt/debt-read/use-cases/get-loan-repayment-by-id.usecase';

/**
 * Debt Read: implements the generated DebtDebtReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class DebtDebtReadServiceImpl {
  constructor(
    private readonly findLoanDisbursementsUseCase: FindLoanDisbursementsUseCase,
    private readonly findLoanRepaymentsUseCase: FindLoanRepaymentsUseCase,
    private readonly findLoansUseCase: FindLoansUseCase,
    private readonly getLoanByIdUseCase: GetLoanByIdUseCase,
    private readonly getLoanDisbursementByIdUseCase: GetLoanDisbursementByIdUseCase,
    private readonly getLoanRepaymentByIdUseCase: GetLoanRepaymentByIdUseCase,
  ) {}

  /** List loan disbursements. */
  findLoanDisbursements(input: LoanDisbursementListQueryDto) {
    return this.findLoanDisbursementsUseCase.execute(input);
  }

  /** List loan repayments. */
  findLoanRepayments(input: LoanRepaymentListQueryDto) {
    return this.findLoanRepaymentsUseCase.execute(input);
  }

  /** List loans. */
  findLoans(input: LoanListQueryDto) {
    return this.findLoansUseCase.execute(input);
  }

  /** Get loans by id. */
  getLoanById(input: { loanId: string }) {
    return this.getLoanByIdUseCase.execute(input);
  }

  /** Get loan disbursements by id. */
  getLoanDisbursementById(input: { disbursementId: string }) {
    return this.getLoanDisbursementByIdUseCase.execute(input);
  }

  /** Get loan repayments by id. */
  getLoanRepaymentById(input: { repaymentId: string }) {
    return this.getLoanRepaymentByIdUseCase.execute(input);
  }
}