import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { MotionsInputDto } from "#/modules/insights/schema/dto/motions-input.dto";
import type { MotionListDto } from "#/modules/insights/schema/dto/motion-list.dto";
import { listMotions } from "#/modules/insights/features/insights/reads/activity.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/activity.ts`. */
@Injectable()
export class ListMotionsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: MotionsInputDto): Promise<MotionListDto> {
    return (await listMotions(this.db, input.institutionId, input.limit ?? 50)) as unknown as MotionListDto;
  }
}
