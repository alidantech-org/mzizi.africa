import { Module, type Type } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdeologyEntity } from "#/modules/political/entities/ideology.entity.ts";
import { PartyIdeologyEntity } from "#/modules/political/entities/party-ideology.entity.ts";
import { PartyMembershipEntity } from "#/modules/political/entities/party-membership.entity.ts";
import { PartyPositionHolderEntity } from "#/modules/political/entities/party-position-holder.entity.ts";
import { PartyPositionEntity } from "#/modules/political/entities/party-position.entity.ts";
import { PartyUnitEntity } from "#/modules/political/entities/party-unit.entity.ts";
import { PartyEntity } from "#/modules/political/entities/party.entity.ts";
import { PoliticalPoliticalReadServiceImpl } from "#/modules/political/political-read/political-read.service.impl.ts";
import { FindIdeologiesUseCase } from "#/modules/political/political-read/use-cases/find-ideologies.usecase.ts";
import { FindPartiesUseCase } from "#/modules/political/political-read/use-cases/find-parties.usecase.ts";
import { FindPartyIdeologiesUseCase } from "#/modules/political/political-read/use-cases/find-party-ideologies.usecase.ts";
import { FindPartyMembershipsUseCase } from "#/modules/political/political-read/use-cases/find-party-memberships.usecase.ts";
import { FindPartyPositionHoldersUseCase } from "#/modules/political/political-read/use-cases/find-party-position-holders.usecase.ts";
import { FindPartyPositionsUseCase } from "#/modules/political/political-read/use-cases/find-party-positions.usecase.ts";
import { FindPartyUnitsUseCase } from "#/modules/political/political-read/use-cases/find-party-units.usecase.ts";
import { GetIdeologyByIdUseCase } from "#/modules/political/political-read/use-cases/get-ideology-by-id.usecase.ts";
import { GetPartyByIdUseCase } from "#/modules/political/political-read/use-cases/get-party-by-id.usecase.ts";
import { GetPartyIdeologyByIdUseCase } from "#/modules/political/political-read/use-cases/get-party-ideology-by-id.usecase.ts";
import { GetPartyMembershipByIdUseCase } from "#/modules/political/political-read/use-cases/get-party-membership-by-id.usecase.ts";
import { GetPartyPositionByIdUseCase } from "#/modules/political/political-read/use-cases/get-party-position-by-id.usecase.ts";
import { GetPartyPositionHolderByIdUseCase } from "#/modules/political/political-read/use-cases/get-party-position-holder-by-id.usecase.ts";
import { GetPartyUnitByIdUseCase } from "#/modules/political/political-read/use-cases/get-party-unit-by-id.usecase.ts";

import { PoliticalPoliticalReadController } from "./political-read.controller.ts";
import { PoliticalPoliticalReadService } from "./political-read.service.ts";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IdeologyEntity,
      PartyIdeologyEntity,
      PartyMembershipEntity,
      PartyPositionHolderEntity,
      PartyPositionEntity,
      PartyUnitEntity,
      PartyEntity,
    ]),
  ],
  controllers: [PoliticalPoliticalReadController],
  providers: [
    {
      provide: PoliticalPoliticalReadService,
      useClass: PoliticalPoliticalReadServiceImpl satisfies Type<PoliticalPoliticalReadService>,
    },
    FindIdeologiesUseCase,
    FindPartiesUseCase,
    FindPartyIdeologiesUseCase,
    FindPartyMembershipsUseCase,
    FindPartyPositionHoldersUseCase,
    FindPartyPositionsUseCase,
    FindPartyUnitsUseCase,
    GetIdeologyByIdUseCase,
    GetPartyByIdUseCase,
    GetPartyIdeologyByIdUseCase,
    GetPartyMembershipByIdUseCase,
    GetPartyPositionByIdUseCase,
    GetPartyPositionHolderByIdUseCase,
    GetPartyUnitByIdUseCase,
  ],
  exports: [PoliticalPoliticalReadService],
})
export class PoliticalPoliticalReadModule {}