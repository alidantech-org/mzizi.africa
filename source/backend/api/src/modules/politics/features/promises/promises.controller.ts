import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { CommitmentCollectionDto } from "#/modules/politics/schema/dto/commitment-collection.dto.ts";
import { MakerCommitmentsDto } from "#/modules/politics/schema/dto/maker-commitments.dto.ts";
import { PoliticsPromisesService } from "./promises.service.ts";

@Controller()
export class PoliticsPromisesController {
  constructor(private readonly service: PoliticsPromisesService) {}

  @Get("/v1/politics/commitments")
  @HttpCode(200)
  listCommitments(@Query() input: MakerCommitmentsDto): Promise<CommitmentCollectionDto> {
    return this.service.listCommitments(input);
  }
}
