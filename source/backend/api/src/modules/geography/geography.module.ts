import { Module } from "@nestjs/common";
import { GeographyMapsModule } from "#/modules/geography/features/maps/maps.module.ts";
import { GeographyPlacesModule } from "#/modules/geography/features/places/places.module.ts";

@Module({
  imports: [GeographyMapsModule, GeographyPlacesModule],
})
export class GeographyModule {}
