import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountsEntity } from "#/modules/auth/schema/entities/accounts.entity.ts";
import { AuthAccountsRepository } from "#/modules/auth/features/accounts/repositories/accounts.repository.ts";
import { GetMyAccountUseCase } from "#/modules/auth/features/accounts/use-cases/get-my-account.usecase.ts";
import { ListAccountsUseCase } from "#/modules/auth/features/accounts/use-cases/list-accounts.usecase.ts";

import { AuthAccountsController } from "./accounts.controller.ts";
import { AuthAccountsService, AuthAccountsServiceImpl } from "./accounts.service.ts";

@Module({
  imports: [TypeOrmModule.forFeature([AccountsEntity])],
  controllers: [AuthAccountsController],
  providers: [
    {
      provide: AuthAccountsService,
      useClass: AuthAccountsServiceImpl satisfies Type<AuthAccountsService>,
    },
    GetMyAccountUseCase,
    ListAccountsUseCase,
    AuthAccountsRepository,
  ],
  exports: [AuthAccountsService],
})
export class AuthAccountsModule {}
