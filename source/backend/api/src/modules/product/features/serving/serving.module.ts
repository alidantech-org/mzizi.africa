import { Module, type Type } from "@nestjs/common";
import { GetSiteUseCase } from "#/modules/product/features/serving/use-cases/get-site.repository.ts";
import { ListReleasesUseCase } from "#/modules/product/features/serving/use-cases/list-releases.repository.ts";

import { ProductServingController } from "./serving.controller.ts";
import { ProductServingService, ProductServingServiceImpl } from "./serving.service.ts";

@Module({
  controllers: [ProductServingController],
  providers: [
    {
      provide: ProductServingService,
      useClass: ProductServingServiceImpl satisfies Type<ProductServingService>,
    },
    GetSiteUseCase,
    ListReleasesUseCase,
  ],
  exports: [ProductServingService],
})
export class ProductServingModule {}
