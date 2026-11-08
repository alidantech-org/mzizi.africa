import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonContactEntity } from "#/modules/person/entities/person-contact.entity.ts";
import { PersonHandleEntity } from "#/modules/person/entities/person-handle.entity.ts";
import { PersonNameEntity } from "#/modules/person/entities/person-name.entity.ts";
import { PersonProfileEntity } from "#/modules/person/entities/person-profile.entity.ts";
import { PersonEntity } from "#/modules/person/entities/person.entity.ts";
import { PersonPersonReadServiceImpl } from "#/modules/person/person-read/person-read.service.impl.ts";
import { FindPeopleUseCase } from "#/modules/person/person-read/use-cases/find-people.usecase.ts";
import { FindPersonContactsUseCase } from "#/modules/person/person-read/use-cases/find-person-contacts.usecase.ts";
import { FindPersonHandlesUseCase } from "#/modules/person/person-read/use-cases/find-person-handles.usecase.ts";
import { FindPersonNamesUseCase } from "#/modules/person/person-read/use-cases/find-person-names.usecase.ts";
import { FindPersonProfilesUseCase } from "#/modules/person/person-read/use-cases/find-person-profiles.usecase.ts";
import { GetPersonByIdUseCase } from "#/modules/person/person-read/use-cases/get-person-by-id.usecase.ts";
import { GetPersonContactByIdUseCase } from "#/modules/person/person-read/use-cases/get-person-contact-by-id.usecase.ts";
import { GetPersonHandleByIdUseCase } from "#/modules/person/person-read/use-cases/get-person-handle-by-id.usecase.ts";
import { GetPersonNameByIdUseCase } from "#/modules/person/person-read/use-cases/get-person-name-by-id.usecase.ts";
import { GetPersonProfileByIdUseCase } from "#/modules/person/person-read/use-cases/get-person-profile-by-id.usecase.ts";

import { PersonPersonReadController } from "./person-read.controller.ts";
import { PersonPersonReadService } from "./person-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonContactEntity,
      PersonHandleEntity,
      PersonNameEntity,
      PersonProfileEntity,
      PersonEntity,
    ]),
  ],
  controllers: [PersonPersonReadController],
  providers: [
    {
      provide: PersonPersonReadService,
      useClass: PersonPersonReadServiceImpl satisfies Type<PersonPersonReadService>,
    },
    FindPeopleUseCase,
    FindPersonContactsUseCase,
    FindPersonHandlesUseCase,
    FindPersonNamesUseCase,
    FindPersonProfilesUseCase,
    GetPersonByIdUseCase,
    GetPersonContactByIdUseCase,
    GetPersonHandleByIdUseCase,
    GetPersonNameByIdUseCase,
    GetPersonProfileByIdUseCase,
  ],
  exports: [PersonPersonReadService],
})
export class PersonPersonReadModule {}