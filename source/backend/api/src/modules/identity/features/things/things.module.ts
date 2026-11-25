import { Module, type Type } from "@nestjs/common";
import { GetIdentityUseCase } from "#/modules/identity/features/things/use-cases/get-identity.repository.ts";
import { ResolveAddressUseCase } from "#/modules/identity/features/things/use-cases/resolve-address.repository.ts";
import { SearchNamesUseCase } from "#/modules/identity/features/things/use-cases/search-names.repository.ts";

import { IdentityThingsController } from "./things.controller.ts";
import { IdentityThingsService, IdentityThingsServiceImpl } from "./things.service.ts";

@Module({
  controllers: [IdentityThingsController],
  providers: [
    {
      provide: IdentityThingsService,
      useClass: IdentityThingsServiceImpl satisfies Type<IdentityThingsService>,
    },
    GetIdentityUseCase,
    ResolveAddressUseCase,
    SearchNamesUseCase,
  ],
  exports: [IdentityThingsService],
})
export class IdentityThingsModule {}
