import { Module } from "@nestjs/common";
import { GeographyPlacesModule } from "#/modules/geography/features/places/places.module.ts";

@Module({
  imports: [GeographyPlacesModule],
})
export class GeographyModule {}
