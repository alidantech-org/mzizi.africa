import { Injectable, NotImplementedException } from '@nestjs/common';
import type { AccountCollectionDto } from '#/modules/auth/schema/dto/account-collection.dto';
import type { AccountWindowDto } from '#/modules/auth/schema/dto/account-window.dto';

/**
 * Page through accounts, optionally by status. Administrators only.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ListAccountsUseCase {

  async execute(input: AccountWindowDto): Promise<AccountCollectionDto> {
    throw new NotImplementedException('ListAccounts is not implemented yet');
  }
}