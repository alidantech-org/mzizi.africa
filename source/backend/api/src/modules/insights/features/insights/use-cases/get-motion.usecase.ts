import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto";
import type { MotionDetailDto } from "#/modules/insights/schema/dto/motion-detail.dto";
import { motionDetail } from "#/modules/insights/features/insights/reads/activity.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/activity.ts`. */
@Injectable()
export class GetMotionUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CodeInputDto): Promise<MotionDetailDto> {
    return (await motionDetail(this.db, input.code)) as unknown as MotionDetailDto;
  }
}
