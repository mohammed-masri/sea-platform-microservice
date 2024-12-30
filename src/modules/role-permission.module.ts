import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { rolePermissionProviders } from 'src/models/role-permission/role-permission.provider';
import { RolePermissionService } from 'src/models/role-permission/role-permission.service';
import { PermissionModuleDependencies } from './permission.module';

export const RolePermissionModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    RolePermissionService,
    ...rolePermissionProviders,
    ...PermissionModuleDependencies.providers,
  ],
};

@Module({
  imports: [...RolePermissionModuleDependencies.imports],
  providers: [...RolePermissionModuleDependencies.providers],
})
export class RolePermissionModule {}
