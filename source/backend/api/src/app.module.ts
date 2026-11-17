import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

import { DatabaseModule } from "./database/database.module.ts";
import { AuthModule } from "#/modules/auth/auth.module.ts";
import { GeographyModule } from "#/modules/geography/geography.module.ts";
import { GovernanceModule } from "#/modules/governance/governance.module.ts";
import { LocalityModule } from "#/modules/locality/locality.module.ts";
import { ReferenceModule } from "#/modules/reference/reference.module.ts";
import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    GeographyModule,
    GovernanceModule,
    LocalityModule,
    ReferenceModule,
  ],
  providers: [{ provide: APP_PIPE, useValue: new HttpValidationPipe(httpOptions) }],
})
export class AppModule {}
