import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { EngagementInputDto } from "#/modules/interactions/schema/dto/engagement-input.dto.ts";
import { EngagementDto } from "#/modules/interactions/schema/dto/engagement.dto.ts";
import { LikeInputDto } from "#/modules/interactions/schema/dto/like-input.dto.ts";
import { RecordedDto } from "#/modules/interactions/schema/dto/recorded.dto.ts";
import { ViewInputDto } from "#/modules/interactions/schema/dto/view-input.dto.ts";
import { InteractionsInteractionsService } from "./interactions.service.ts";

@Controller()
export class InteractionsInteractionsController {
  constructor(private readonly service: InteractionsInteractionsService) {}

  @Get("/v1/engagement")
  @HttpCode(200)
  getEngagement(@Query() input: EngagementInputDto): Promise<EngagementDto> {
    return this.service.getEngagement(input);
  }

  @Post("/v1/likes")
  @HttpCode(200)
  like(@Body() body: LikeInputDto): Promise<EngagementDto> {
    return this.service.like({ body });
  }

  @Post("/v1/views")
  @HttpCode(200)
  recordView(@Body() body: ViewInputDto): Promise<RecordedDto> {
    return this.service.recordView({ body });
  }

  @Post("/v1/likes/remove")
  @HttpCode(200)
  unlike(@Body() body: LikeInputDto): Promise<EngagementDto> {
    return this.service.unlike({ body });
  }
}
