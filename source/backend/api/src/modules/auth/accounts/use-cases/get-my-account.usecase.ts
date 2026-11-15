import { Injectable, NotImplementedException } from '@nestjs/common';
import type { AccountReadDto } from '#/modules/auth/dto/account-read.dto';
import type { ApiErrorDto } from '#/modules/shared/dto/api-error.dto';

/**
 * The signed-in person's own account.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetMyAccountUseCase {

  async execute(): Promise<AccountReadDto> {
    throw new NotImplementedException('GetMyAccount is not implemented yet');
  }
}