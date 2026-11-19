import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { EngagementInputDto } from "#/modules/interactions/schema/dto/engagement-input.dto";
import type { EngagementDto } from "#/modules/interactions/schema/dto/engagement.dto";
import { engagement } from "#/modules/interactions/features/interactions/engagement.ts";

/**
 * How many likes a subject has, and whether this device has liked it. Views are counted and not returned.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetEngagementUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: EngagementInputDto): Promise<EngagementDto> {
    return await engagement(this.db, input.subjectTable, input.subjectRef, input.deviceId);
  }
}
