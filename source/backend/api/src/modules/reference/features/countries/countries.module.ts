import { Module, type Type } from "@nestjs/common";
import { GetCountryUseCase } from "#/modules/reference/features/countries/use-cases/get-country.repository.ts";
import { ListCountriesUseCase } from "#/modules/reference/features/countries/use-cases/list-countries.repository.ts";

import { ReferenceCountriesController } from "./countries.controller.ts";
import { ReferenceCountriesService, ReferenceCountriesServiceImpl } from "./countries.service.ts";

@Module({
  controllers: [ReferenceCountriesController],
  providers: [
    {
      provide: ReferenceCountriesService,
      useClass: ReferenceCountriesServiceImpl satisfies Type<ReferenceCountriesService>,
    },
    GetCountryUseCase,
    ListCountriesUseCase,
  ],
  exports: [ReferenceCountriesService],
})
export class ReferenceCountriesModule {}
