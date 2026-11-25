import { Module } from "@nestjs/common";
import { ReferenceCountriesModule } from "#/modules/reference/features/countries/countries.module.ts";
import { ReferenceDivisionsModule } from "#/modules/reference/features/divisions/divisions.module.ts";
import { ReferenceLanguagesModule } from "#/modules/reference/features/languages/languages.module.ts";
import { ReferenceMeasuresModule } from "#/modules/reference/features/measures/measures.module.ts";

@Module({
  imports: [
    ReferenceCountriesModule,
    ReferenceDivisionsModule,
    ReferenceLanguagesModule,
    ReferenceMeasuresModule,
  ],
})
export class ReferenceModule {}
