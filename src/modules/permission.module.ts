import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { permissionProviders } from 'src/models/permission/permission.provider';
import { PermissionService } from 'src/models/permission/permission.service';

export const PermissionModuleDependencies = {
  imports: [DatabaseModule],
  providers: [PermissionService, ...permissionProviders],
};

@Module({
  imports: [...PermissionModuleDependencies.imports],
  providers: [...PermissionModuleDependencies.providers],
})
export class PermissionModule {}
