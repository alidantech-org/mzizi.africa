import { Module } from "@nestjs/common";
import { AuthAccountsModule } from "#/modules/auth/features/accounts/accounts.module.ts";

@Module({
  imports: [
    AuthAccountsModule,
  ],
})
export class AuthModule {}