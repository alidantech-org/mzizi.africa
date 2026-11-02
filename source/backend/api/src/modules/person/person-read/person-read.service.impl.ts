import { Injectable } from '@nestjs/common';
import type { PeopleListResponseDto } from '#/modules/person/dto/people-list-response.dto';
import type { PersonContactListQueryDto } from '#/modules/person/dto/person-contact-list-query.dto';
import type { PersonContactResponseDto } from '#/modules/person/dto/person-contact-response.dto';
import type { PersonContactsListResponseDto } from '#/modules/person/dto/person-contacts-list-response.dto';
import type { PersonHandleListQueryDto } from '#/modules/person/dto/person-handle-list-query.dto';
import type { PersonHandleResponseDto } from '#/modules/person/dto/person-handle-response.dto';
import type { PersonHandlesListResponseDto } from '#/modules/person/dto/person-handles-list-response.dto';
import type { PersonListQueryDto } from '#/modules/person/dto/person-list-query.dto';
import type { PersonNameListQueryDto } from '#/modules/person/dto/person-name-list-query.dto';
import type { PersonNameResponseDto } from '#/modules/person/dto/person-name-response.dto';
import type { PersonNamesListResponseDto } from '#/modules/person/dto/person-names-list-response.dto';
import type { PersonProfileListQueryDto } from '#/modules/person/dto/person-profile-list-query.dto';
import type { PersonProfileResponseDto } from '#/modules/person/dto/person-profile-response.dto';
import type { PersonProfilesListResponseDto } from '#/modules/person/dto/person-profiles-list-response.dto';
import type { PersonResponseDto } from '#/modules/person/dto/person-response.dto';
import { FindPeopleUseCase } from '#/modules/person/person-read/use-cases/find-people.usecase';
import { FindPersonContactsUseCase } from '#/modules/person/person-read/use-cases/find-person-contacts.usecase';
import { FindPersonHandlesUseCase } from '#/modules/person/person-read/use-cases/find-person-handles.usecase';
import { FindPersonNamesUseCase } from '#/modules/person/person-read/use-cases/find-person-names.usecase';
import { FindPersonProfilesUseCase } from '#/modules/person/person-read/use-cases/find-person-profiles.usecase';
import { GetPersonByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-by-id.usecase';
import { GetPersonContactByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-contact-by-id.usecase';
import { GetPersonHandleByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-handle-by-id.usecase';
import { GetPersonNameByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-name-by-id.usecase';
import { GetPersonProfileByIdUseCase } from '#/modules/person/person-read/use-cases/get-person-profile-by-id.usecase';

/**
 * Person Read: implements the generated PersonPersonReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class PersonPersonReadServiceImpl {
  constructor(
    private readonly findPeopleUseCase: FindPeopleUseCase,
    private readonly findPersonContactsUseCase: FindPersonContactsUseCase,
    private readonly findPersonHandlesUseCase: FindPersonHandlesUseCase,
    private readonly findPersonNamesUseCase: FindPersonNamesUseCase,
    private readonly findPersonProfilesUseCase: FindPersonProfilesUseCase,
    private readonly getPersonByIdUseCase: GetPersonByIdUseCase,
    private readonly getPersonContactByIdUseCase: GetPersonContactByIdUseCase,
    private readonly getPersonHandleByIdUseCase: GetPersonHandleByIdUseCase,
    private readonly getPersonNameByIdUseCase: GetPersonNameByIdUseCase,
    private readonly getPersonProfileByIdUseCase: GetPersonProfileByIdUseCase,
  ) {}

  /** List people. */
  findPeople(input: PersonListQueryDto) {
    return this.findPeopleUseCase.execute(input);
  }

  /** List public person contacts. */
  findPersonContacts(input: PersonContactListQueryDto) {
    return this.findPersonContactsUseCase.execute(input);
  }

  /** List public person handles. */
  findPersonHandles(input: PersonHandleListQueryDto) {
    return this.findPersonHandlesUseCase.execute(input);
  }

  /** List person names. */
  findPersonNames(input: PersonNameListQueryDto) {
    return this.findPersonNamesUseCase.execute(input);
  }

  /** List person profiles. */
  findPersonProfiles(input: PersonProfileListQueryDto) {
    return this.findPersonProfilesUseCase.execute(input);
  }

  /** Get people by id. */
  getPersonById(input: { personId: string }) {
    return this.getPersonByIdUseCase.execute(input);
  }

  /** Get public person contacts by id. */
  getPersonContactById(input: { contactId: string }) {
    return this.getPersonContactByIdUseCase.execute(input);
  }

  /** Get public person handles by id. */
  getPersonHandleById(input: { handleId: string }) {
    return this.getPersonHandleByIdUseCase.execute(input);
  }

  /** Get person names by id. */
  getPersonNameById(input: { personNameId: string }) {
    return this.getPersonNameByIdUseCase.execute(input);
  }

  /** Get person profiles by id. */
  getPersonProfileById(input: { profileId: string }) {
    return this.getPersonProfileByIdUseCase.execute(input);
  }
}