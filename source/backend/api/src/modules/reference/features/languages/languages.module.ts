import { Module, type Type } from "@nestjs/common";
import { ListLanguagesUseCase } from "#/modules/reference/features/languages/use-cases/list-languages.repository.ts";

import { ReferenceLanguagesController } from "./languages.controller.ts";
import { ReferenceLanguagesService, ReferenceLanguagesServiceImpl } from "./languages.service.ts";

@Module({
  controllers: [ReferenceLanguagesController],
  providers: [
    {
      provide: ReferenceLanguagesService,
      useClass: ReferenceLanguagesServiceImpl satisfies Type<ReferenceLanguagesService>,
    },
    ListLanguagesUseCase,
  ],
  exports: [ReferenceLanguagesService],
})
export class ReferenceLanguagesModule {}
