import { Module, type Type } from "@nestjs/common";
import { ListMessagesUseCase } from "#/modules/product/features/copy/use-cases/list-messages.repository.ts";

import { ProductCopyController } from "./copy.controller.ts";
import { ProductCopyService, ProductCopyServiceImpl } from "./copy.service.ts";

@Module({
  controllers: [ProductCopyController],
  providers: [
    {
      provide: ProductCopyService,
      useClass: ProductCopyServiceImpl satisfies Type<ProductCopyService>,
    },
    ListMessagesUseCase,
  ],
  exports: [ProductCopyService],
})
export class ProductCopyModule {}
