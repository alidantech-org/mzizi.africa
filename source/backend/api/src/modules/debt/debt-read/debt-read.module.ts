import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoanDisbursementEntity } from "#/modules/debt/entities/loan-disbursement.entity.ts";
import { LoanRepaymentEntity } from "#/modules/debt/entities/loan-repayment.entity.ts";
import { LoanEntity } from "#/modules/debt/entities/loan.entity.ts";
import { BudgetaryUnitEntity } from "#/modules/finance/entities/budgetary-unit.entity.ts";
import { JurisdictionEntity } from "#/modules/reference/entities/jurisdiction.entity.ts";
import { DebtDebtReadServiceImpl } from "#/modules/debt/debt-read/debt-read.service.impl.ts";
import { FindLoanDisbursementsUseCase } from "#/modules/debt/debt-read/use-cases/find-loan-disbursements.usecase.ts";
import { FindLoanRepaymentsUseCase } from "#/modules/debt/debt-read/use-cases/find-loan-repayments.usecase.ts";
import { FindLoansUseCase } from "#/modules/debt/debt-read/use-cases/find-loans.usecase.ts";
import { GetLoanByIdUseCase } from "#/modules/debt/debt-read/use-cases/get-loan-by-id.usecase.ts";
import { GetLoanDisbursementByIdUseCase } from "#/modules/debt/debt-read/use-cases/get-loan-disbursement-by-id.usecase.ts";
import { GetLoanRepaymentByIdUseCase } from "#/modules/debt/debt-read/use-cases/get-loan-repayment-by-id.usecase.ts";

import { DebtDebtReadController } from "./debt-read.controller.ts";
import { DebtDebtReadService } from "./debt-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoanDisbursementEntity,
      LoanRepaymentEntity,
      LoanEntity,
      BudgetaryUnitEntity,
      JurisdictionEntity,
    ]),
  ],
  controllers: [DebtDebtReadController],
  providers: [
    {
      provide: DebtDebtReadService,
      useClass: DebtDebtReadServiceImpl satisfies Type<DebtDebtReadService>,
    },
    FindLoanDisbursementsUseCase,
    FindLoanRepaymentsUseCase,
    FindLoansUseCase,
    GetLoanByIdUseCase,
    GetLoanDisbursementByIdUseCase,
    GetLoanRepaymentByIdUseCase,
  ],
  exports: [DebtDebtReadService],
})
export class DebtDebtReadModule {}