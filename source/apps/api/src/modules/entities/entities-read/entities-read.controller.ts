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
import { EntityIdentifierListQueryDto } from "#/modules/entities/dto/entity-identifier-list-query.dto.ts";
import { EntityIdentifierResponseDto } from "#/modules/entities/dto/entity-identifier-response.dto.ts";
import { EntityIdentifiersListResponseDto } from "#/modules/entities/dto/entity-identifiers-list-response.dto.ts";
import { EntityOwnershipListQueryDto } from "#/modules/entities/dto/entity-ownership-list-query.dto.ts";
import { EntityOwnershipResponseDto } from "#/modules/entities/dto/entity-ownership-response.dto.ts";
import { EntityOwnershipsListResponseDto } from "#/modules/entities/dto/entity-ownerships-list-response.dto.ts";
import { LegalEntitiesListResponseDto } from "#/modules/entities/dto/legal-entities-list-response.dto.ts";
import { LegalEntityListQueryDto } from "#/modules/entities/dto/legal-entity-list-query.dto.ts";
import { LegalEntityResponseDto } from "#/modules/entities/dto/legal-entity-response.dto.ts";
import { EntitiesEntitiesReadService } from "./entities-read.service.ts";

@Controller()
export class EntitiesEntitiesReadController {
  constructor(private readonly service: EntitiesEntitiesReadService) {}


  @Get("/v1/entities/identifiers")
  @HttpCode(200)
  findEntityIdentifiers(
    @Query() input: EntityIdentifierListQueryDto,
  ): Promise<EntityIdentifiersListResponseDto> {
    return this.service.findEntityIdentifiers(input);
  }


  @Get("/v1/entities/ownerships")
  @HttpCode(200)
  findEntityOwnerships(
    @Query() input: EntityOwnershipListQueryDto,
  ): Promise<EntityOwnershipsListResponseDto> {
    return this.service.findEntityOwnerships(input);
  }


  @Get("/v1/entities/legal-entities")
  @HttpCode(200)
  findLegalEntities(
    @Query() input: LegalEntityListQueryDto,
  ): Promise<LegalEntitiesListResponseDto> {
    return this.service.findLegalEntities(input);
  }


  @Get("/v1/entities/identifiers/:identifierId")
  @HttpCode(200)
  getEntityIdentifierById(
    @Param("identifierId") identifierId: string,
  ): Promise<EntityIdentifierResponseDto> {
    return this.service.getEntityIdentifierById({ identifierId });
  }


  @Get("/v1/entities/ownerships/:ownershipId")
  @HttpCode(200)
  getEntityOwnershipById(
    @Param("ownershipId") ownershipId: string,
  ): Promise<EntityOwnershipResponseDto> {
    return this.service.getEntityOwnershipById({ ownershipId });
  }


  @Get("/v1/entities/legal-entities/:entityId")
  @HttpCode(200)
  getLegalEntityById(
    @Param("entityId") entityId: string,
  ): Promise<LegalEntityResponseDto> {
    return this.service.getLegalEntityById({ entityId });
  }
}