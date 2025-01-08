import { Module } from '@nestjs/common';

import { ApplicationController } from './application.controller';
import { ApplicationModuleDependencies } from 'src/modules/application.module';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  controllers: [ApplicationController],
  providers: [
    ...ApplicationModuleDependencies.providers,
    JwtService,
    ServerConfigService,
  ],
})
export class ApplicationControllerModule {}
