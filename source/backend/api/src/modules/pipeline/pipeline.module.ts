import { Module } from "@nestjs/common";
import { PipelinePipelineReviewModule } from "#/modules/pipeline/pipeline-review/pipeline-review.module.ts";

@Module({
  imports: [
    PipelinePipelineReviewModule,
  ],
})
export class PipelineModule {}