import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseFloatPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Cookie } from "#/modules/common/server/http/cookie.decorator.ts";
import { PeopleListResponseDto } from "#/modules/person/dto/people-list-response.dto.ts";
import { PersonContactListQueryDto } from "#/modules/person/dto/person-contact-list-query.dto.ts";
import { PersonContactResponseDto } from "#/modules/person/dto/person-contact-response.dto.ts";
import { PersonContactsListResponseDto } from "#/modules/person/dto/person-contacts-list-response.dto.ts";
import { PersonHandleListQueryDto } from "#/modules/person/dto/person-handle-list-query.dto.ts";
import { PersonHandleResponseDto } from "#/modules/person/dto/person-handle-response.dto.ts";
import { PersonHandlesListResponseDto } from "#/modules/person/dto/person-handles-list-response.dto.ts";
import { PersonListQueryDto } from "#/modules/person/dto/person-list-query.dto.ts";
import { PersonNameListQueryDto } from "#/modules/person/dto/person-name-list-query.dto.ts";
import { PersonNameResponseDto } from "#/modules/person/dto/person-name-response.dto.ts";
import { PersonNamesListResponseDto } from "#/modules/person/dto/person-names-list-response.dto.ts";
import { PersonProfileListQueryDto } from "#/modules/person/dto/person-profile-list-query.dto.ts";
import { PersonProfileResponseDto } from "#/modules/person/dto/person-profile-response.dto.ts";
import { PersonProfilesListResponseDto } from "#/modules/person/dto/person-profiles-list-response.dto.ts";
import { PersonResponseDto } from "#/modules/person/dto/person-response.dto.ts";
import { PersonPersonReadService } from "./person-read.service.ts";

@Controller()
export class PersonPersonReadController {
  constructor(private readonly service: PersonPersonReadService) {}


  @Get("/v1/people/individuals")
  @HttpCode(200)
  findPeople(
    @Query() input: PersonListQueryDto,
  ): Promise<PeopleListResponseDto> {
    return this.service.findPeople(input);
  }


  @Get("/v1/people/contacts")
  @HttpCode(200)
  findPersonContacts(
    @Query() input: PersonContactListQueryDto,
  ): Promise<PersonContactsListResponseDto> {
    return this.service.findPersonContacts(input);
  }


  @Get("/v1/people/handles")
  @HttpCode(200)
  findPersonHandles(
    @Query() input: PersonHandleListQueryDto,
  ): Promise<PersonHandlesListResponseDto> {
    return this.service.findPersonHandles(input);
  }


  @Get("/v1/people/names")
  @HttpCode(200)
  findPersonNames(
    @Query() input: PersonNameListQueryDto,
  ): Promise<PersonNamesListResponseDto> {
    return this.service.findPersonNames(input);
  }


  @Get("/v1/people/profiles")
  @HttpCode(200)
  findPersonProfiles(
    @Query() input: PersonProfileListQueryDto,
  ): Promise<PersonProfilesListResponseDto> {
    return this.service.findPersonProfiles(input);
  }


  @Get("/v1/people/individuals/:personId")
  @HttpCode(200)
  getPersonById(
    @Param("personId") personId: string,
  ): Promise<PersonResponseDto> {
    return this.service.getPersonById({ personId });
  }


  @Get("/v1/people/contacts/:contactId")
  @HttpCode(200)
  getPersonContactById(
    @Param("contactId") contactId: string,
  ): Promise<PersonContactResponseDto> {
    return this.service.getPersonContactById({ contactId });
  }


  @Get("/v1/people/handles/:handleId")
  @HttpCode(200)
  getPersonHandleById(
    @Param("handleId") handleId: string,
  ): Promise<PersonHandleResponseDto> {
    return this.service.getPersonHandleById({ handleId });
  }


  @Get("/v1/people/names/:personNameId")
  @HttpCode(200)
  getPersonNameById(
    @Param("personNameId") personNameId: string,
  ): Promise<PersonNameResponseDto> {
    return this.service.getPersonNameById({ personNameId });
  }


  @Get("/v1/people/profiles/:profileId")
  @HttpCode(200)
  getPersonProfileById(
    @Param("profileId") profileId: string,
  ): Promise<PersonProfileResponseDto> {
    return this.service.getPersonProfileById({ profileId });
  }
}