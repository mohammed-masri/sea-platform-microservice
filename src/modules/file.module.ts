import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { fileProviders } from 'src/models/file/file.provider';
import { FileService } from 'src/models/file/file.service';

export const FileModuleDependencies = {
  imports: [DatabaseModule],
  providers: [FileService, ...fileProviders],
};

@Module({
  imports: [...FileModuleDependencies.imports],
  providers: [...FileModuleDependencies.providers],
})
export class FileModule {}
