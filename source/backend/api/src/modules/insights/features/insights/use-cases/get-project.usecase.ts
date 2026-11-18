import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto";
import type { ProjectDetailDto } from "#/modules/insights/schema/dto/project-detail.dto";
import { projectDetail } from "#/modules/insights/features/insights/reads/civic.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/civic.ts`. */
@Injectable()
export class GetProjectUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CodeInputDto): Promise<ProjectDetailDto> {
    return (await projectDetail(this.db, input.code)) as unknown as ProjectDetailDto;
  }
}
