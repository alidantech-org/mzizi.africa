import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

import { DatabaseModule } from "./database/database.module.ts";
import { GeographyModule } from "#/modules/geography/geography.module.ts";
import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";

@Module({
  imports: [DatabaseModule, GeographyModule],
  providers: [
    { provide: APP_PIPE, useValue: new HttpValidationPipe(httpOptions) },
  ],
})
export class AppModule {}
