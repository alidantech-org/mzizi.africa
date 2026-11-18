import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { context } from "#/modules/experience/features/experience/reads/context.ts";
import type { ContextInputDto } from "#/modules/experience/schema/dto/context-input.dto";
import type { ContextDto } from "#/modules/experience/schema/dto/context.dto";

/**
 * Who and where the visitor is: the country and how it was decided, the language, the place resolved from the clean address path, the levels of the country's ladder and the countries that can be chosen.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetContextUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ContextInputDto): Promise<ContextDto> {
    return (await context(this.db, input)) as unknown as ContextDto;
  }
}
