import { Module } from "@nestjs/common";
import { AuthAccountsModule } from "#/modules/auth/accounts/accounts.module.ts";

@Module({
  imports: [
    AuthAccountsModule,
  ],
})
export class AuthModule {}