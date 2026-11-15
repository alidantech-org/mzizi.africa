import {
  Controller,
  Get,
  HttpCode,
  Query,
} from "@nestjs/common";
import { AccountCollectionDto } from "#/modules/auth/schema/dto/account-collection.dto.ts";
import { AccountReadDto } from "#/modules/auth/schema/dto/account-read.dto.ts";
import { AccountWindowDto } from "#/modules/auth/schema/dto/account-window.dto.ts";
import { AuthAccountsService } from "./accounts.service.ts";

@Controller()
export class AuthAccountsController {
  constructor(private readonly service: AuthAccountsService) {}


  @Get("/v1/account")
  @HttpCode(200)
  getMyAccount(
  ): Promise<AccountReadDto> {
    return this.service.getMyAccount();
  }


  @Get("/v1/admin/accounts")
  @HttpCode(200)
  listAccounts(
    @Query() input: AccountWindowDto,
  ): Promise<AccountCollectionDto> {
    return this.service.listAccounts(input);
  }
}