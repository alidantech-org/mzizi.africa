import { Module, type Type } from "@nestjs/common";
import { AuthAccountsServiceImpl } from "#/modules/auth/features/accounts/accounts.service.impl.ts";
import { GetMyAccountUseCase } from "#/modules/auth/features/accounts/use-cases/get-my-account.usecase.ts";
import { ListAccountsUseCase } from "#/modules/auth/features/accounts/use-cases/list-accounts.usecase.ts";

import { AuthAccountsController } from "./accounts.controller.ts";
import { AuthAccountsService } from "./accounts.service.ts";

@Module({
  controllers: [AuthAccountsController],
  providers: [
    {
      provide: AuthAccountsService,
      useClass: AuthAccountsServiceImpl satisfies Type<AuthAccountsService>,
    },
    GetMyAccountUseCase,
    ListAccountsUseCase,
  ],
  exports: [AuthAccountsService],
})
export class AuthAccountsModule {}