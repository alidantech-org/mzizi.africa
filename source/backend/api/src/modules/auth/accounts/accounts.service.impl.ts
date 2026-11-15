import { Injectable } from '@nestjs/common';
import type { AccountCollectionDto } from '#/modules/auth/dto/account-collection.dto';
import type { AccountReadDto } from '#/modules/auth/dto/account-read.dto';
import type { AccountWindowDto } from '#/modules/auth/dto/account-window.dto';
import { GetMyAccountUseCase } from '#/modules/auth/accounts/use-cases/get-my-account.usecase';
import { ListAccountsUseCase } from '#/modules/auth/accounts/use-cases/list-accounts.usecase';

/**
 * Accounts: implements the generated AuthAccountsService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class AuthAccountsServiceImpl {
  constructor(
    private readonly getMyAccountUseCase: GetMyAccountUseCase,
    private readonly listAccountsUseCase: ListAccountsUseCase,
  ) {}

  /** The signed-in person's own account. */
  getMyAccount() {
    return this.getMyAccountUseCase.execute();
  }

  /** Page through accounts, optionally by status. Administrators only. */
  listAccounts(input: AccountWindowDto) {
    return this.listAccountsUseCase.execute(input);
  }
}