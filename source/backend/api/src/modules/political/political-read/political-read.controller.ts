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
import { IdeologiesListResponseDto } from "#/modules/political/dto/ideologies-list-response.dto.ts";
import { IdeologyListQueryDto } from "#/modules/political/dto/ideology-list-query.dto.ts";
import { IdeologyResponseDto } from "#/modules/political/dto/ideology-response.dto.ts";
import { PartiesListResponseDto } from "#/modules/political/dto/parties-list-response.dto.ts";
import { PartyIdeologiesListResponseDto } from "#/modules/political/dto/party-ideologies-list-response.dto.ts";
import { PartyIdeologyListQueryDto } from "#/modules/political/dto/party-ideology-list-query.dto.ts";
import { PartyIdeologyResponseDto } from "#/modules/political/dto/party-ideology-response.dto.ts";
import { PartyListQueryDto } from "#/modules/political/dto/party-list-query.dto.ts";
import { PartyMembershipListQueryDto } from "#/modules/political/dto/party-membership-list-query.dto.ts";
import { PartyMembershipResponseDto } from "#/modules/political/dto/party-membership-response.dto.ts";
import { PartyMembershipsListResponseDto } from "#/modules/political/dto/party-memberships-list-response.dto.ts";
import { PartyPositionHolderListQueryDto } from "#/modules/political/dto/party-position-holder-list-query.dto.ts";
import { PartyPositionHolderResponseDto } from "#/modules/political/dto/party-position-holder-response.dto.ts";
import { PartyPositionHoldersListResponseDto } from "#/modules/political/dto/party-position-holders-list-response.dto.ts";
import { PartyPositionListQueryDto } from "#/modules/political/dto/party-position-list-query.dto.ts";
import { PartyPositionResponseDto } from "#/modules/political/dto/party-position-response.dto.ts";
import { PartyPositionsListResponseDto } from "#/modules/political/dto/party-positions-list-response.dto.ts";
import { PartyResponseDto } from "#/modules/political/dto/party-response.dto.ts";
import { PartyUnitListQueryDto } from "#/modules/political/dto/party-unit-list-query.dto.ts";
import { PartyUnitResponseDto } from "#/modules/political/dto/party-unit-response.dto.ts";
import { PartyUnitsListResponseDto } from "#/modules/political/dto/party-units-list-response.dto.ts";
import { PoliticalPoliticalReadService } from "./political-read.service.ts";

@Controller()
export class PoliticalPoliticalReadController {
  constructor(private readonly service: PoliticalPoliticalReadService) {}


  @Get("/v1/political/ideologies")
  @HttpCode(200)
  findIdeologies(
    @Query() input: IdeologyListQueryDto,
  ): Promise<IdeologiesListResponseDto> {
    return this.service.findIdeologies(input);
  }


  @Get("/v1/political/parties")
  @HttpCode(200)
  findParties(
    @Query() input: PartyListQueryDto,
  ): Promise<PartiesListResponseDto> {
    return this.service.findParties(input);
  }


  @Get("/v1/political/party-ideologies")
  @HttpCode(200)
  findPartyIdeologies(
    @Query() input: PartyIdeologyListQueryDto,
  ): Promise<PartyIdeologiesListResponseDto> {
    return this.service.findPartyIdeologies(input);
  }


  @Get("/v1/political/memberships")
  @HttpCode(200)
  findPartyMemberships(
    @Query() input: PartyMembershipListQueryDto,
  ): Promise<PartyMembershipsListResponseDto> {
    return this.service.findPartyMemberships(input);
  }


  @Get("/v1/political/position-holders")
  @HttpCode(200)
  findPartyPositionHolders(
    @Query() input: PartyPositionHolderListQueryDto,
  ): Promise<PartyPositionHoldersListResponseDto> {
    return this.service.findPartyPositionHolders(input);
  }


  @Get("/v1/political/positions")
  @HttpCode(200)
  findPartyPositions(
    @Query() input: PartyPositionListQueryDto,
  ): Promise<PartyPositionsListResponseDto> {
    return this.service.findPartyPositions(input);
  }


  @Get("/v1/political/units")
  @HttpCode(200)
  findPartyUnits(
    @Query() input: PartyUnitListQueryDto,
  ): Promise<PartyUnitsListResponseDto> {
    return this.service.findPartyUnits(input);
  }


  @Get("/v1/political/ideologies/:ideologyId")
  @HttpCode(200)
  getIdeologyById(
    @Param("ideologyId") ideologyId: string,
  ): Promise<IdeologyResponseDto> {
    return this.service.getIdeologyById({ ideologyId });
  }


  @Get("/v1/political/parties/:partyId")
  @HttpCode(200)
  getPartyById(
    @Param("partyId") partyId: string,
  ): Promise<PartyResponseDto> {
    return this.service.getPartyById({ partyId });
  }


  @Get("/v1/political/party-ideologies/:partyIdeologyId")
  @HttpCode(200)
  getPartyIdeologyById(
    @Param("partyIdeologyId") partyIdeologyId: string,
  ): Promise<PartyIdeologyResponseDto> {
    return this.service.getPartyIdeologyById({ partyIdeologyId });
  }


  @Get("/v1/political/memberships/:membershipId")
  @HttpCode(200)
  getPartyMembershipById(
    @Param("membershipId") membershipId: string,
  ): Promise<PartyMembershipResponseDto> {
    return this.service.getPartyMembershipById({ membershipId });
  }


  @Get("/v1/political/positions/:positionId")
  @HttpCode(200)
  getPartyPositionById(
    @Param("positionId") positionId: string,
  ): Promise<PartyPositionResponseDto> {
    return this.service.getPartyPositionById({ positionId });
  }


  @Get("/v1/political/position-holders/:holderId")
  @HttpCode(200)
  getPartyPositionHolderById(
    @Param("holderId") holderId: string,
  ): Promise<PartyPositionHolderResponseDto> {
    return this.service.getPartyPositionHolderById({ holderId });
  }


  @Get("/v1/political/units/:unitId")
  @HttpCode(200)
  getPartyUnitById(
    @Param("unitId") unitId: string,
  ): Promise<PartyUnitResponseDto> {
    return this.service.getPartyUnitById({ unitId });
  }
}