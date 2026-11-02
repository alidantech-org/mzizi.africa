import { Module } from "@nestjs/common";
import { PersonPersonReadModule } from "#/modules/person/person-read/person-read.module.ts";

@Module({
  imports: [
    PersonPersonReadModule,
  ],
})
export class PersonModule {}