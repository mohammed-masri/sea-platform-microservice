import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { accountProviders } from 'src/models/account/account.provider';
import { AccountService } from 'src/models/account/account.service';

export const AccountModuleDependencies = {
  imports: [DatabaseModule],
  providers: [AccountService, ...accountProviders],
};

@Module({
  imports: [...AccountModuleDependencies.imports],
  providers: [...AccountModuleDependencies.providers],
})
export class AccountModule {}
