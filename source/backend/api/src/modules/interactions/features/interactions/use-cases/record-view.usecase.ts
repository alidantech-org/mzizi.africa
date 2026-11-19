import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { RecordedDto } from "#/modules/interactions/schema/dto/recorded.dto";
import type { ViewInputDto } from "#/modules/interactions/schema/dto/view-input.dto";
import { recordView } from "#/modules/interactions/features/interactions/engagement.ts";

/**
 * A subject was viewed; one view per visitor per day.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class RecordViewUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: { body: ViewInputDto }): Promise<RecordedDto> {
    return await recordView(this.db, input.body.subjectTable, input.body.subjectRef, input.body.visitor);
  }
}
