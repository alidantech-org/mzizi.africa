import { Module } from "@nestjs/common";
import { ProcurementProcurementReadModule } from "#/modules/procurement/procurement-read/procurement-read.module.ts";

@Module({
  imports: [
    ProcurementProcurementReadModule,
  ],
})
export class ProcurementModule {}