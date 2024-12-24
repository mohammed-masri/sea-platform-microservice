import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { accountProviders } from 'src/models/account/account.provider';
import { AccountService } from 'src/models/account/account.service';
import { AccountTypeModuleDependencies } from './account-type.module';

export const AccountModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    AccountService,
    ...accountProviders,
    ...AccountTypeModuleDependencies.providers,
  ],
};

@Module({
  imports: [...AccountModuleDependencies.imports],
  providers: [...AccountModuleDependencies.providers],
})
export class AccountModule {}
