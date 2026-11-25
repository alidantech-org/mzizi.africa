import { Module, type Type } from "@nestjs/common";
import { GetMyAccountUseCase } from "#/modules/auth/features/accounts/use-cases/get-my-account.repository.ts";
import { ListAccountsUseCase } from "#/modules/auth/features/accounts/use-cases/list-accounts.repository.ts";

import { AuthAccountsController } from "./accounts.controller.ts";
import { AuthAccountsService, AuthAccountsServiceImpl } from "./accounts.service.ts";

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
