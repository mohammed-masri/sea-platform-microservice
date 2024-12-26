import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { RoleController } from './role.controller';
import { RoleService } from 'src/models/role/role.service';
import { roleProviders } from 'src/models/role/role.provider';
import { PermissionModuleDependencies } from 'src/modules/permission.module';

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    ...roleProviders,
    ...PermissionModuleDependencies.providers,
    JwtService,
    ServerConfigService,
  ],
})
export class RoleControllerModule {}
