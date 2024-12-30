import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PermissionModuleDependencies } from './permission.module';
import { accountPermissionProviders } from 'src/models/account-permission/account-permission.provider';
import { AccountPermissionService } from 'src/models/account-permission/account-permission.service';

export const AccountPermissionModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    AccountPermissionService,
    ...accountPermissionProviders,
    ...PermissionModuleDependencies.providers,
  ],
};

@Module({
  imports: [...AccountPermissionModuleDependencies.imports],
  providers: [...AccountPermissionModuleDependencies.providers],
})
export class AccountPermissionModule {}
