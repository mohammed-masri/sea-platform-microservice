import { Module } from '@nestjs/common';

import { StaticController } from './static.controller';
import { PermissionModuleDependencies } from 'src/modules/permission.module';

@Module({
  controllers: [StaticController],
  providers: [...PermissionModuleDependencies.providers],
})
export class StaticControllerModule {}
