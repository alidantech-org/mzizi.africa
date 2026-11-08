import { Module } from "@nestjs/common";
import { ServicesServicesReadModule } from "#/modules/services/services-read/services-read.module.ts";

@Module({
  imports: [
    ServicesServicesReadModule,
  ],
})
export class ServicesModule {}