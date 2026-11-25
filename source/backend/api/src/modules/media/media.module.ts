import { Module } from "@nestjs/common";
import { MediaLibraryModule } from "#/modules/media/features/library/library.module.ts";

@Module({
  imports: [MediaLibraryModule],
})
export class MediaModule {}
