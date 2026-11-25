import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { RecordedDto } from "#/modules/community/schema/dto/recorded.dto.ts";
import { ViewInputDto } from "#/modules/community/schema/dto/view-input.dto.ts";
import { CommunityCountingService } from "./counting.service.ts";

@Controller()
export class CommunityCountingController {
  constructor(private readonly service: CommunityCountingService) {}

  @Post("/v1/community/views")
  @HttpCode(200)
  recordView(@Body() body: ViewInputDto): Promise<RecordedDto> {
    return this.service.recordView({ body });
  }
}
