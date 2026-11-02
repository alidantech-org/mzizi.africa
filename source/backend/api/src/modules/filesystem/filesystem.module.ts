import { Module } from "@nestjs/common";
import { FilesystemFilesystemReadModule } from "#/modules/filesystem/filesystem-read/filesystem-read.module.ts";

@Module({
  imports: [
    FilesystemFilesystemReadModule,
  ],
})
export class FilesystemModule {}