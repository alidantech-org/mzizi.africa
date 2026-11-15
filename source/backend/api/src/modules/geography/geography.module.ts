import { Module } from "@nestjs/common";
import { GeographyPlacesModule } from "#/modules/geography/places/places.module.ts";

@Module({
  imports: [
    GeographyPlacesModule,
  ],
})
export class GeographyModule {}