import { Injectable } from '@nestjs/common';
import type { IdeologiesListResponseDto } from '#/modules/political/dto/ideologies-list-response.dto';
import type { IdeologyListQueryDto } from '#/modules/political/dto/ideology-list-query.dto';
import type { IdeologyResponseDto } from '#/modules/political/dto/ideology-response.dto';
import type { PartiesListResponseDto } from '#/modules/political/dto/parties-list-response.dto';
import type { PartyIdeologiesListResponseDto } from '#/modules/political/dto/party-ideologies-list-response.dto';
import type { PartyIdeologyListQueryDto } from '#/modules/political/dto/party-ideology-list-query.dto';
import type { PartyIdeologyResponseDto } from '#/modules/political/dto/party-ideology-response.dto';
import type { PartyListQueryDto } from '#/modules/political/dto/party-list-query.dto';
import type { PartyMembershipListQueryDto } from '#/modules/political/dto/party-membership-list-query.dto';
import type { PartyMembershipResponseDto } from '#/modules/political/dto/party-membership-response.dto';
import type { PartyMembershipsListResponseDto } from '#/modules/political/dto/party-memberships-list-response.dto';
import type { PartyPositionHolderListQueryDto } from '#/modules/political/dto/party-position-holder-list-query.dto';
import type { PartyPositionHolderResponseDto } from '#/modules/political/dto/party-position-holder-response.dto';
import type { PartyPositionHoldersListResponseDto } from '#/modules/political/dto/party-position-holders-list-response.dto';
import type { PartyPositionListQueryDto } from '#/modules/political/dto/party-position-list-query.dto';
import type { PartyPositionResponseDto } from '#/modules/political/dto/party-position-response.dto';
import type { PartyPositionsListResponseDto } from '#/modules/political/dto/party-positions-list-response.dto';
import type { PartyResponseDto } from '#/modules/political/dto/party-response.dto';
import type { PartyUnitListQueryDto } from '#/modules/political/dto/party-unit-list-query.dto';
import type { PartyUnitResponseDto } from '#/modules/political/dto/party-unit-response.dto';
import type { PartyUnitsListResponseDto } from '#/modules/political/dto/party-units-list-response.dto';
import { FindIdeologiesUseCase } from '#/modules/political/political-read/use-cases/find-ideologies.usecase';
import { FindPartiesUseCase } from '#/modules/political/political-read/use-cases/find-parties.usecase';
import { FindPartyIdeologiesUseCase } from '#/modules/political/political-read/use-cases/find-party-ideologies.usecase';
import { FindPartyMembershipsUseCase } from '#/modules/political/political-read/use-cases/find-party-memberships.usecase';
import { FindPartyPositionHoldersUseCase } from '#/modules/political/political-read/use-cases/find-party-position-holders.usecase';
import { FindPartyPositionsUseCase } from '#/modules/political/political-read/use-cases/find-party-positions.usecase';
import { FindPartyUnitsUseCase } from '#/modules/political/political-read/use-cases/find-party-units.usecase';
import { GetIdeologyByIdUseCase } from '#/modules/political/political-read/use-cases/get-ideology-by-id.usecase';
import { GetPartyByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-by-id.usecase';
import { GetPartyIdeologyByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-ideology-by-id.usecase';
import { GetPartyMembershipByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-membership-by-id.usecase';
import { GetPartyPositionByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-position-by-id.usecase';
import { GetPartyPositionHolderByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-position-holder-by-id.usecase';
import { GetPartyUnitByIdUseCase } from '#/modules/political/political-read/use-cases/get-party-unit-by-id.usecase';

/**
 * Political Read: implements the generated PoliticalPoliticalReadService contract by
 * delegating to one use case per operation. The feature module binds it to that contract.
 *
 * Scaffolded by Dryv once; this file belongs to the project. New operations need a method here.
 */
@Injectable()
export class PoliticalPoliticalReadServiceImpl {
  constructor(
    private readonly findIdeologiesUseCase: FindIdeologiesUseCase,
    private readonly findPartiesUseCase: FindPartiesUseCase,
    private readonly findPartyIdeologiesUseCase: FindPartyIdeologiesUseCase,
    private readonly findPartyMembershipsUseCase: FindPartyMembershipsUseCase,
    private readonly findPartyPositionHoldersUseCase: FindPartyPositionHoldersUseCase,
    private readonly findPartyPositionsUseCase: FindPartyPositionsUseCase,
    private readonly findPartyUnitsUseCase: FindPartyUnitsUseCase,
    private readonly getIdeologyByIdUseCase: GetIdeologyByIdUseCase,
    private readonly getPartyByIdUseCase: GetPartyByIdUseCase,
    private readonly getPartyIdeologyByIdUseCase: GetPartyIdeologyByIdUseCase,
    private readonly getPartyMembershipByIdUseCase: GetPartyMembershipByIdUseCase,
    private readonly getPartyPositionByIdUseCase: GetPartyPositionByIdUseCase,
    private readonly getPartyPositionHolderByIdUseCase: GetPartyPositionHolderByIdUseCase,
    private readonly getPartyUnitByIdUseCase: GetPartyUnitByIdUseCase,
  ) {}

  /** List ideologies. */
  findIdeologies(input: IdeologyListQueryDto) {
    return this.findIdeologiesUseCase.execute(input);
  }

  /** List parties. */
  findParties(input: PartyListQueryDto) {
    return this.findPartiesUseCase.execute(input);
  }

  /** List party ideologies. */
  findPartyIdeologies(input: PartyIdeologyListQueryDto) {
    return this.findPartyIdeologiesUseCase.execute(input);
  }

  /** List party memberships. */
  findPartyMemberships(input: PartyMembershipListQueryDto) {
    return this.findPartyMembershipsUseCase.execute(input);
  }

  /** List party position holders. */
  findPartyPositionHolders(input: PartyPositionHolderListQueryDto) {
    return this.findPartyPositionHoldersUseCase.execute(input);
  }

  /** List party positions. */
  findPartyPositions(input: PartyPositionListQueryDto) {
    return this.findPartyPositionsUseCase.execute(input);
  }

  /** List party units. */
  findPartyUnits(input: PartyUnitListQueryDto) {
    return this.findPartyUnitsUseCase.execute(input);
  }

  /** Get ideologies by id. */
  getIdeologyById(input: { ideologyId: string }) {
    return this.getIdeologyByIdUseCase.execute(input);
  }

  /** Get parties by id. */
  getPartyById(input: { partyId: string }) {
    return this.getPartyByIdUseCase.execute(input);
  }

  /** Get party ideologies by id. */
  getPartyIdeologyById(input: { partyIdeologyId: string }) {
    return this.getPartyIdeologyByIdUseCase.execute(input);
  }

  /** Get party memberships by id. */
  getPartyMembershipById(input: { membershipId: string }) {
    return this.getPartyMembershipByIdUseCase.execute(input);
  }

  /** Get party positions by id. */
  getPartyPositionById(input: { positionId: string }) {
    return this.getPartyPositionByIdUseCase.execute(input);
  }

  /** Get party position holders by id. */
  getPartyPositionHolderById(input: { holderId: string }) {
    return this.getPartyPositionHolderByIdUseCase.execute(input);
  }

  /** Get party units by id. */
  getPartyUnitById(input: { unitId: string }) {
    return this.getPartyUnitByIdUseCase.execute(input);
  }
}