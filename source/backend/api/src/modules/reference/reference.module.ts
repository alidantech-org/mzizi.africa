import { Module } from "@nestjs/common";
import { ReferenceCatalogueModule } from "#/modules/reference/catalogue/catalogue.module.ts";

@Module({
  imports: [
    ReferenceCatalogueModule,
  ],
})
export class ReferenceModule {}