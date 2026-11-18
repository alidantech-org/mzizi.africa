import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { ContentInputDto } from "#/modules/insights/schema/dto/content-input.dto";
import type { ContentPageDto } from "#/modules/insights/schema/dto/content-page.dto";
import { getContent } from "#/modules/insights/features/insights/reads/content.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class GetContentUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ContentInputDto): Promise<ContentPageDto> {
    return (await getContent(this.db, input)) as unknown as ContentPageDto;
  }
}
