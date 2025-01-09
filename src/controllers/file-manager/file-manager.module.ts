import { Module } from '@nestjs/common';

import { FileManagerController } from './file-manager.controller';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { FileModuleDependencies } from 'src/modules/file.module';

@Module({
  controllers: [FileManagerController],
  providers: [
    ...FileModuleDependencies.providers,
    JwtService,
    ServerConfigService,
  ],
})
export class FileManagerControllerModule {}
