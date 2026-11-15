import { Injectable } from "@nestjs/common";
import type { ReadContext } from "#/database/base/read-helpers.ts";
import { AuthAccountsRepository } from "#/modules/auth/features/accounts/repositories/accounts.repository";
import type { AccountReadDto } from "#/modules/auth/schema/dto/account-read.dto";

/**
 * The signed-in person's own account.
 *
 * Scaffolded by Dryv once; this file belongs to the project. It runs the declared query
 * #/operations/auth.GetMyAccount through the feature repository and maps the rows to the response;
 * add business rules around that call.
 */
@Injectable()
export class GetMyAccountUseCase {
  constructor(private readonly repository: AuthAccountsRepository) {}

  async execute(context: ReadContext = {}): Promise<AccountReadDto> {
    const result = await this.repository.getMyAccount({}, context);
    return result as unknown as AccountReadDto;
  }
}
