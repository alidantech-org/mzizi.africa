import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { EngagementDto } from "#/modules/interactions/schema/dto/engagement.dto";
import type { LikeInputDto } from "#/modules/interactions/schema/dto/like-input.dto";
import { unlike } from "#/modules/interactions/features/interactions/engagement.ts";

/**
 * This device withdraws its like.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class UnlikeUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: { body: LikeInputDto }): Promise<EngagementDto> {
    return await unlike(this.db, input.body.subjectTable, input.body.subjectRef, input.body.deviceId);
  }
}
