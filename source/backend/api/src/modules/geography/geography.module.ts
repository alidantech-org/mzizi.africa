import { Module } from "@nestjs/common";
import { GeographyGeographyReadModule } from "#/modules/geography/geography-read/geography-read.module.ts";

@Module({
  imports: [GeographyGeographyReadModule],
})
export class GeographyModule {}
