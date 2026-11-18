import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { ContentListInputDto } from "#/modules/insights/schema/dto/content-list-input.dto";
import type { ContentListDto } from "#/modules/insights/schema/dto/content-list.dto";
import { listContent } from "#/modules/insights/features/insights/reads/content.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class ListContentUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ContentListInputDto): Promise<ContentListDto> {
    return (await listContent(this.db, input)) as unknown as ContentListDto;
  }
}
