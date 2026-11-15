import { Injectable } from "@nestjs/common";
import type { Row } from "#/database/base/read-helpers.ts";
import { AuthAccountsRepository } from "#/modules/auth/features/accounts/repositories/accounts.repository";
import type { AccountCollectionDto } from "#/modules/auth/schema/dto/account-collection.dto";
import type { AccountWindowDto } from "#/modules/auth/schema/dto/account-window.dto";

/**
 * Page through accounts, optionally by status. Administrators only.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/auth.ListAccounts through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class ListAccountsUseCase {
  constructor(private readonly repository: AuthAccountsRepository) {}

  async execute(input: AccountWindowDto): Promise<AccountCollectionDto> {
    const result = await this.repository.listAccounts(input as unknown as Row);
    return {
      accounts: result,
    } as unknown as AccountCollectionDto;
  }
}
