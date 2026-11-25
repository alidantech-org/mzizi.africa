import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common";

import { BillCollectionDto } from "#/modules/legislature/schema/dto/bill-collection.dto.ts";
import { BillDetailDto } from "#/modules/legislature/schema/dto/bill-detail.dto.ts";
import { BillWindowDto } from "#/modules/legislature/schema/dto/bill-window.dto.ts";
import { MotionVotesDto } from "#/modules/legislature/schema/dto/motion-votes.dto.ts";
import { VoteCollectionDto } from "#/modules/legislature/schema/dto/vote-collection.dto.ts";
import { LegislatureLawmakingService } from "./lawmaking.service.ts";

@Controller()
export class LegislatureLawmakingController {
  constructor(private readonly service: LegislatureLawmakingService) {}

  @Get("/v1/legislature/bills")
  @HttpCode(200)
  listBills(@Query() input: BillWindowDto): Promise<BillCollectionDto> {
    return this.service.listBills(input);
  }

  @Get("/v1/legislature/votes")
  @HttpCode(200)
  listVotes(@Query() input: MotionVotesDto): Promise<VoteCollectionDto> {
    return this.service.listVotes(input);
  }

  @Get("/v1/legislature/bills/:code")
  @HttpCode(200)
  getBill(@Param("code") code: string): Promise<BillDetailDto> {
    return this.service.getBill({ code });
  }
}
