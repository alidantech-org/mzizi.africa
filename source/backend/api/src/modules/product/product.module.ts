import { Module } from "@nestjs/common";
import { ProductCopyModule } from "#/modules/product/features/copy/copy.module.ts";
import { ProductServingModule } from "#/modules/product/features/serving/serving.module.ts";

@Module({
  imports: [ProductCopyModule, ProductServingModule],
})
export class ProductModule {}
