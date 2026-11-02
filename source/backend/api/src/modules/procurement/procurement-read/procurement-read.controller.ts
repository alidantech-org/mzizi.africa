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
import { BidListQueryDto } from "#/modules/procurement/dto/bid-list-query.dto.ts";
import { BidResponseDto } from "#/modules/procurement/dto/bid-response.dto.ts";
import { BidsListResponseDto } from "#/modules/procurement/dto/bids-list-response.dto.ts";
import { ContractMilestoneListQueryDto } from "#/modules/procurement/dto/contract-milestone-list-query.dto.ts";
import { ContractMilestoneResponseDto } from "#/modules/procurement/dto/contract-milestone-response.dto.ts";
import { ContractMilestonesListResponseDto } from "#/modules/procurement/dto/contract-milestones-list-response.dto.ts";
import { ContractVariationListQueryDto } from "#/modules/procurement/dto/contract-variation-list-query.dto.ts";
import { ContractVariationResponseDto } from "#/modules/procurement/dto/contract-variation-response.dto.ts";
import { ContractVariationsListResponseDto } from "#/modules/procurement/dto/contract-variations-list-response.dto.ts";
import { ProcurementContractListQueryDto } from "#/modules/procurement/dto/procurement-contract-list-query.dto.ts";
import { ProcurementContractResponseDto } from "#/modules/procurement/dto/procurement-contract-response.dto.ts";
import { ProcurementContractsListResponseDto } from "#/modules/procurement/dto/procurement-contracts-list-response.dto.ts";
import { TenderListQueryDto } from "#/modules/procurement/dto/tender-list-query.dto.ts";
import { TenderResponseDto } from "#/modules/procurement/dto/tender-response.dto.ts";
import { TendersListResponseDto } from "#/modules/procurement/dto/tenders-list-response.dto.ts";
import { ProcurementProcurementReadService } from "./procurement-read.service.ts";

@Controller()
export class ProcurementProcurementReadController {
  constructor(private readonly service: ProcurementProcurementReadService) {}


  @Get("/v1/procurement/bids")
  @HttpCode(200)
  findBids(
    @Query() input: BidListQueryDto,
  ): Promise<BidsListResponseDto> {
    return this.service.findBids(input);
  }


  @Get("/v1/procurement/milestones")
  @HttpCode(200)
  findContractMilestones(
    @Query() input: ContractMilestoneListQueryDto,
  ): Promise<ContractMilestonesListResponseDto> {
    return this.service.findContractMilestones(input);
  }


  @Get("/v1/procurement/variations")
  @HttpCode(200)
  findContractVariations(
    @Query() input: ContractVariationListQueryDto,
  ): Promise<ContractVariationsListResponseDto> {
    return this.service.findContractVariations(input);
  }


  @Get("/v1/procurement/contracts")
  @HttpCode(200)
  findProcurementContracts(
    @Query() input: ProcurementContractListQueryDto,
  ): Promise<ProcurementContractsListResponseDto> {
    return this.service.findProcurementContracts(input);
  }


  @Get("/v1/procurement/tenders")
  @HttpCode(200)
  findTenders(
    @Query() input: TenderListQueryDto,
  ): Promise<TendersListResponseDto> {
    return this.service.findTenders(input);
  }


  @Get("/v1/procurement/bids/:bidId")
  @HttpCode(200)
  getBidById(
    @Param("bidId") bidId: string,
  ): Promise<BidResponseDto> {
    return this.service.getBidById({ bidId });
  }


  @Get("/v1/procurement/milestones/:milestoneId")
  @HttpCode(200)
  getContractMilestoneById(
    @Param("milestoneId") milestoneId: string,
  ): Promise<ContractMilestoneResponseDto> {
    return this.service.getContractMilestoneById({ milestoneId });
  }


  @Get("/v1/procurement/variations/:variationId")
  @HttpCode(200)
  getContractVariationById(
    @Param("variationId") variationId: string,
  ): Promise<ContractVariationResponseDto> {
    return this.service.getContractVariationById({ variationId });
  }


  @Get("/v1/procurement/contracts/:contractId")
  @HttpCode(200)
  getProcurementContractById(
    @Param("contractId") contractId: string,
  ): Promise<ProcurementContractResponseDto> {
    return this.service.getProcurementContractById({ contractId });
  }


  @Get("/v1/procurement/tenders/:tenderId")
  @HttpCode(200)
  getTenderById(
    @Param("tenderId") tenderId: string,
  ): Promise<TenderResponseDto> {
    return this.service.getTenderById({ tenderId });
  }
}